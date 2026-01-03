const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { employee_id, name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (employee_id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [employee_id, name, email, hashedPassword, role],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "User already exists" });
        }
        res.json({ message: "Registered successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Registration error" });
  }
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // ✅ FIXED jwt.sign SYNTAX
      const token = jwt.sign(
        { id: user.id, role: user.role },
        "dayflow_secret",
        { expiresIn: "1d" }
      );

      res.json({
        token: token,
        role: user.role,
        userId: user.id
      });
    }
  );
});

module.exports = router;
