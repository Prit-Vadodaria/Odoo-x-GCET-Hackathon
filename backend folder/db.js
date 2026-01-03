const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dayflow"
});

db.connect((err) => {
  if (err) {
    console.error("MySQL error:", err);
    return;
  }
  console.log("MySQL Connected");
});

module.exports = db;
