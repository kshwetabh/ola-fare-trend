const fs = require("fs");
const puppeteer = require("puppeteer");
const { URL } = require("url");
const Config = require("./config");

// database consts
var sqlite3 = require("sqlite3").verbose();
const DBFILE = "db.sqlite";

async function getLatestOlaFares(url, fileNameInitial) {
  const browser = await puppeteer.launch(),
    page = await browser.newPage();

  page.on("console", msg => {
    console.log(msg.text());
  });

  page.on("response", async response => {
    const url = new URL(response.url());
    // capture only the response that has fare response
    if (url.pathname.indexOf("category-fare") !== -1) {
      let currTime = new Date().getTime();

      await response.json().then(
        b => {
          processAndSaveResponseData(currTime, b, fileNameInitial);
        },
        e => {
          console.log("response err");
        }
      );
    }
  });

  await page.goto(url, { waitUntil: "networkidle0" });
  browser.close();
}

getLatestOlaFares(Config.olaHomeToOfcUrl, Config.homeToOfc);
getLatestOlaFares(Config.olaOfcToHomeURL, Config.ofcToHome);

/** Schedule fare download every 5 mins */
var minutes = 5,
  the_interval = minutes * 60 * 1000;

setInterval(function() {
  console.log(Date.now(), "Getting latest fares ....................");
  getLatestOlaFares(Config.olaHomeToOfcUrl, Config.homeToOfc);
  getLatestOlaFares(Config.olaOfcToHomeURL, Config.ofcToHome);
  console.log(
    Date.now(),
    "Updated latest fares into the Database ...................."
  );
}, the_interval);

function writeDataToDatabase(dataArr) {
  var db = new sqlite3.Database(DBFILE);
  var stmt = db.prepare(
    "INSERT INTO FARE (route, timestamp, type, min, max) values (?, ?, ?, ?, ?)"
  );
  stmt.run(dataArr);
  stmt.finalize();
}

function processAndSaveResponseData(timestamp, data, tableName) {
  data = data.data.p2p.categories;
  var keys = Object.keys(data);

  if (!data) {
    console.log("error in response data");
    return;
  }
  if (data && data.error) {
    console.log("error in response data");
    return;
  }

  for (var i = 0; i < keys.length; i++) {
    var minMax = data[keys[i]].price.replace(/₹/g, ""),
      minMaxArr = minMax.split(" - ");

    writeDataToDatabase([
      tableName,
      timestamp,
      keys[i],
      minMaxArr[0],
      minMaxArr[1]
    ]);
  }
}
