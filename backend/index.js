const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = 5000;
const app = express();
const authRoutes = require('./routes/auth');
const taskRoutes=require('./routes/taskRoutes');
const { generateOTP, sendOTP, storeOTP, verifyOTP } = require("./utils/otpService");
const path = require("path");
const departmentRoutes=require('./routes/departmentRoutes');
app.use(express.json({ limit: '20mb' }));
// app.use((req, res, next) => {
//     console.log(`Incoming request: ${req.method} ${req.url}`); // Debug
//     console.log("Request headers:", req.headers); // Debug
//     next();
//   });
app.use(cors({
    origin: 'http://localhost:5173',
    // origin: 'https://trackmateapp.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(express.text({ type: '*/*', limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));



// Routes
app.use("/api/auth", authRoutes);
app.use("/api", taskRoutes);
app.use('/api/departments', departmentRoutes);

// Send OTP via Email
app.post("/otp-login", async (req, res) => {
    const { email } = req.body;
    // console.log(email)
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const otp = generateOTP();
        // console.log(otp)
        await sendOTP(email, otp); // Send OTP via email
        storeOTP(email, otp); // Store OTP
        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("OTP send error:", error.message);
        res.status(500).json({ error: "Failed to send OTP" });
    }
});

// Verify OTP
app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required" });
    }

    if (verifyOTP(email, otp)) {
        res.json({ message: "OTP verified successfully" });
    } else {
        res.status(400).json({ error: "Invalid or expired OTP" });
    }
});

// Error handling for uncaught exceptions
// process.on('uncaughtException', (error) => {
//     console.error('Uncaught Exception:', error);
//     process.exit(1);
//   });
  
//   process.on('unhandledRejection', (reason, promise) => {
//     console.error('Unhandled Rejection at:', promise, 'reason:', reason);
//   });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database connected.")
        console.log('Connected to DB:', mongoose.connection.name);
    })
    .catch((err) => console.log("Error connecting to database. Error:", err));
    


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}. Open server on: http://localhost:${PORT}`);
});