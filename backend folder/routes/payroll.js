const router = require("express").Router();
const db = require("../db");

router.get("/:id", (req, res) => {
  db.query("SELECT * FROM payroll WHERE user_id=?", [req.params.id], (err, data) => {
    res.json(data);
  });
});

module.exports = router;
