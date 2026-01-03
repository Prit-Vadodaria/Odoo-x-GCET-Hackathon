const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  multipleStatements: true
});

// Read SQL file
const sql = fs.readFileSync(path.join(__dirname, "init.sql"), "utf8");

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL server");
  
  // Execute SQL script
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing SQL:", err);
      process.exit(1);
    }
    console.log("Database initialized successfully!");
    console.log("Tables created: users, attendance, leave_requests, payroll");
    db.end();
  });
});

