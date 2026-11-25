require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL
}));

app.use(express.json({ limit: "100kb" }));

app.use("/api/auth", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30
}));

app.use("/api/auth", authRoutes);
app.use("/api/tests", testRoutes);

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is required");
    }

    await connectDB();

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server started successfully");
    });

  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

startServer();