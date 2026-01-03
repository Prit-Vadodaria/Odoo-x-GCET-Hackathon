const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dayflow",
  multipleStatements: true
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database");
  
  // Add new columns if they don't exist
  const migrationQueries = [
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(100)",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS contact VARCHAR(20)",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
  ];

  // Execute migrations one by one (MySQL doesn't support IF NOT EXISTS for ALTER TABLE, so we'll use a workaround)
  db.query(`
    SELECT COUNT(*) as count 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'dayflow' 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME = 'department'
  `, (err, results) => {
    if (err) {
      console.error("Error checking columns:", err);
      return;
    }
    
    if (results[0].count === 0) {
      db.query("ALTER TABLE users ADD COLUMN department VARCHAR(100)", (err) => {
        if (err) console.error("Error adding department:", err);
        else console.log("Added department column");
      });
    }
    
    db.query(`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'dayflow' 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'contact'
    `, (err, results) => {
      if (err) {
        console.error("Error checking columns:", err);
        return;
      }
      
      if (results[0].count === 0) {
        db.query("ALTER TABLE users ADD COLUMN contact VARCHAR(20)", (err) => {
          if (err) console.error("Error adding contact:", err);
          else console.log("Added contact column");
        });
      }
      
      db.query(`
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'dayflow' 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME = 'updated_at'
      `, (err, results) => {
        if (err) {
          console.error("Error checking columns:", err);
          db.end();
          return;
        }
        
        if (results[0].count === 0) {
          db.query("ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP", (err) => {
            if (err) console.error("Error adding updated_at:", err);
            else console.log("Added updated_at column");
            console.log("Migration completed!");
            db.end();
          });
        } else {
          console.log("Migration completed! All columns already exist.");
          db.end();
        }
      });
    });
  });
});

