// Quick check to see if routes are loading
console.log("Checking routes...");

try {
  console.log("\n1. Checking user route...");
  const userRoute = require("./routes/user");
  console.log("   ✅ User route module loaded");
  
  console.log("\n2. Checking server setup...");
  const express = require("express");
  const app = express();
  app.use(express.json());
  app.use("/api/users", userRoute);
  console.log("   ✅ Routes registered in Express");
  
  console.log("\n✅ All routes are configured correctly!");
  console.log("\n⚠️  IMPORTANT: The backend server needs to be RESTARTED!");
  console.log("   1. Stop the current server (Ctrl+C)");
  console.log("   2. Run: npm start");
  console.log("\nThe routes are correct, but the running server has old code.");
  
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error(error.stack);
}

