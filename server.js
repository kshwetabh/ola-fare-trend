var express = require("express");
var history = require("connect-history-api-fallback");
const path = require("path");
const bodyParser = require("body-parser");

// Database consts
var sqlite3 = require("sqlite3").verbose();
const DBFILE = "db.sqlite";
var db = new sqlite3.Database(DBFILE);

var app = express();

// Middleware for serving '/dist' directory
const staticFileMiddleware = express.static("dist");

// 1st call for unredirected requests
app.use(staticFileMiddleware);
app.use(bodyParser.json());

// Support history API
//app.use(history());

// 2nd call for redirected requests
app.use(staticFileMiddleware);

// Handle a get request to an api route
app.get("/getHomeToOfcRates", function(req, res) {
  console.log("Received request");

  const type = req.query.type;
  const route = req.query.route;
  console.log(`Getting fares for route:"${route}" category:"${type}"`);

  db.all(
    "Select route, timestamp, type, min, max from FARE where route=? and type=?",
    [route, type],
    (err, rows) => {
      if (err) {
        res.send(JSON.stringify(err));
        return;
      }
      console.log("got from the database", rows.length);
      res.send(rows);
    }
  );
});

app.get("/getOfficeToHomeRates", function(req, res) {
  // You can retrieve the :id parameter via 'req.params.id'
  console.log("Received request");
  const type = req.query.type;
  const route = req.query.route;
  console.log(`Getting fares for route:"${route}" category:"${type}"`);

  db.all(
    "Select route, timestamp, type, min, max from FARE where route=? and type=?",
    [route, type],
    (err, rows) => {
      if (err) {
        res.send(JSON.stringify(err));
        return;
      }
      console.log("got from the database", rows.length);
      res.send(rows);
    }
  );
});

app.get("/reloaddb", function(req, res) {
  // You can retrieve the :id parameter via 'req.params.id'
  console.log("Reloading database from file");
  db.read();
  res.send("Reload successful");
});

function getFaresForRoute(route) {
  var data = [];

  db.all(
    "Select route, timestamp, type, min, max from FARE where route=?",
    [route],
    (err, rows) => {
      if (err) {
        throw err;
      }
      console.log("got from the database", rows.length);
      data = rows;
    }
  );
  console.log("Returning data from database", data);
  return data;
}

app.listen(3001, function() {
  console.log("Serving on port 30001");
});
