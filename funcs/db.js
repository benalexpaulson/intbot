const { dbuser, dbpw, db } = require("../config.json");
const EventEmitter = require('node:events');

module.exports = new EventEmitter();

const mysql = require('mysql');
const dbclient = mysql.createPool({
  host: "localhost",
  user: dbuser,
  password: dbpw,
  database: db,
  charset : "utf8mb4",
});

var customMp3 = function (callback) {
    let customMp3 = [];
  dbclient.query("SELECT * FROM songs", function (err, result, fields) {
    if (err) throw err;
    customMp3 = result;
  });
}

var customUser = function (callback) {
  let customUser = [];
  dbclient.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    customUser = result;
  });
}

module.exports = { dbUser: custmUser, dbMp3: customMp3 };