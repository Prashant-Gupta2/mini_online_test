require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "https://mini-online-test-six.vercel.app",
  "https://mini-online-test-i2insx6rn-prashant-kumars-projects-cf441b30.vercel.app",
  process.env.CLIENT_URL?.trim().replace(/\/+$/, "")
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "100kb" }));

app.use("/api/auth", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30
}));

app.use("/api/auth", authRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/admin", adminRoutes);


app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is required");
    }

    await connectDB();

   const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

startServer();