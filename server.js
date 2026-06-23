/* ================================================================
   UNIFIED CLIPS — SERVER
   ================================================================ */

require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");

const clipsRouter = require("./routes/clips");
const authRouter = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ---- MIDDLEWARE ----
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: false, // set to true once you're running on HTTPS in production
    },
  })
);

// ---- API ROUTES ----
app.use("/api/clips", clipsRouter);
app.use("/auth", authRouter);

// ---- STATIC FRONTEND ----
app.use(express.static(path.join(__dirname, "public")));

// ---- DATABASE CONNECTION ----
if (!MONGO_URI) {
  console.error(
    "\n[Unified Clips] No MONGO_URI found in .env — the server will start, but /api/clips will fail until a real MongoDB connection string is added.\n"
  );
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("[Unified Clips] Connected to MongoDB"))
    .catch((err) => console.error("[Unified Clips] MongoDB connection failed:", err));
}

// ---- START SERVER ----
app.listen(PORT, () => {
  console.log(`[Unified Clips] Server running on http://localhost:${PORT}`);
});