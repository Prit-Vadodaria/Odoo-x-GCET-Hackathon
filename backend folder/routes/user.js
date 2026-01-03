const router = require("express").Router();
const db = require("../db");

// Get user profile by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT id, employee_id, name, email, role, department, contact, created_at FROM users WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(results[0]);
    }
  );
});

// Update user profile
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, department, contact } = req.body;
  
  db.query(
    "UPDATE users SET name = ?, department = ?, contact = ? WHERE id = ?",
    [name, department, contact, id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.json({ message: "Profile updated successfully" });
    }
  );
});

module.exports = router;

