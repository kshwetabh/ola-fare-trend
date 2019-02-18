var sqlite3 = require("sqlite3").verbose();
const DBFILE = "db.sqlite";

function migrate() {
  // Create DB if db file does not exist
  var db = new sqlite3.Database(DBFILE, err => {
    if (err) {
      // Cannot open database
      console.error(err.message);
      throw err;
    } else {
      console.log("Connected to the database");
      db.run(
        `CREATE TABLE FARE (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                route text,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                type text,
                min integer,
                max integer
            )`,
        err => {
          if (err) {
            // Table already created
            console.error(err.message);
          }
        }
      );
    }
  });

  db.close();
}

// function insertData() {
//   var db = new sqlite3.Database(DBFILE);

//   var homeToOfcData = lowDB.get("home_to_ofc").value();
//   var ofcToHomeData = lowDB.get("ofc_to_home").value();

//   //timestamp, type, min, max

//   processInsert(homeToOfcData, "home_to_ofc", db);
//   processInsert(ofcToHomeData, "ofc_to_home", db);

//   console.log("Insert complete");
//   db.close();
// }

// function processInsert(dataArr, routeName, db) {
//   var stmt = db.prepare(
//     "INSERT INTO FARE (route, timestamp, type, min, max) values (?, ?, ?, ?, ?)"
//   );
//   for (var i = 0; i < dataArr.length; i++) {
//     let data = dataArr[i];
//     stmt.run([routeName, data.timestamp, data.type, data.min, data.max]);
//   }
//   stmt.finalize();
// }
// insertData();

// Create database file and the required table
migrate();
