require("dotenv").config(); // Load variables from .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const transactionRoutes = require("./routes/transactionRoutes");
app.use("/api/transactions", transactionRoutes);

// Environment Variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

  app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});