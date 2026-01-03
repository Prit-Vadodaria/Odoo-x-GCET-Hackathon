const router = require("express").Router();
const db = require("../db");

router.post("/apply", (req, res) => {
  const { user_id, leave_type, start_date, end_date, reason } = req.body;
  
  if (!user_id || !leave_type || !start_date || !end_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  db.query(
    "INSERT INTO leave_requests(user_id, leave_type, start_date, end_date, reason) VALUES (?, ?, ?, ?, ?)",
    [user_id, leave_type, start_date, end_date, reason],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.json({ message: "Leave applied successfully" });
    }
  );
});

router.get("/all", (req, res) => {
  db.query("SELECT * FROM leave_requests", (err, data) => res.json(data));
});

// Get leave requests by user ID
router.get("/user/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM leave_requests WHERE user_id = ? ORDER BY created_at DESC",
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.json(results);
    }
  );
});

module.exports = router;
