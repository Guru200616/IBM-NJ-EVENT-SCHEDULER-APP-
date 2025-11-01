import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => console.log("✅ MySQL Connected"))
  .catch(err => console.error("❌ Database connection failed:", err));

// ✅ Basic route
app.get("/", (req, res) => {
  res.send("IBM-NJ Event Scheduler API is running successfully 🚀");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
