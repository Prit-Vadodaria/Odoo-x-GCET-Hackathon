const router = require("express").Router();
const db = require("../db");

router.post("/checkin", (req, res) => {
  const { user_id } = req.body;
  
  // Check if already checked in today
  db.query(
    "SELECT * FROM attendance WHERE user_id = ? AND date = CURDATE()",
    [user_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ message: "Already checked in today" });
      }
      
      db.query(
        "INSERT INTO attendance(user_id, date, check_in, status) VALUES (?, CURDATE(), CURTIME(), 'Present')",
        [user_id],
        (err) => {
          if (err) {
            return res.status(500).json({ message: "Database error", error: err });
          }
          res.json({ message: "Checked in successfully" });
        }
      );
    }
  );
});

router.post("/checkout", (req, res) => {
  const { user_id } = req.body;
  
  // Check if checked in today
  db.query(
    "SELECT * FROM attendance WHERE user_id = ? AND date = CURDATE()",
    [user_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      
      if (results.length === 0) {
        return res.status(400).json({ message: "Please check in first" });
      }
      
      if (results[0].check_out) {
        return res.status(400).json({ message: "Already checked out today" });
      }
      
      db.query(
        "UPDATE attendance SET check_out = CURTIME() WHERE user_id = ? AND date = CURDATE()",
        [user_id],
        (err) => {
          if (err) {
            return res.status(500).json({ message: "Database error", error: err });
          }
          res.json({ message: "Checked out successfully" });
        }
      );
    }
  );
});

router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM attendance WHERE user_id = ? ORDER BY date DESC",
    [req.params.id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.json(results);
    }
  );
});

// Check if user has checked in today
router.get("/today/:id", (req, res) => {
  db.query(
    "SELECT * FROM attendance WHERE user_id = ? AND date = CURDATE()",
    [req.params.id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.json(results.length > 0 ? results[0] : null);
    }
  );
});

module.exports = router;

