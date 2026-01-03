const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/leave", require("./routes/leave"));
app.use("/api/payroll", require("./routes/payroll"));

app.get("/", (req, res) => {
  res.send("Dayflow Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
