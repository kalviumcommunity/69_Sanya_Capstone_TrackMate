const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

// Temporarily store OTPs (Replace with Redis or a database for production)
const otpStorage = new Map();

// Configure SMTP Transporter
// const transporter = nodemailer.createTransport({
//     service: process.env.SMTP_SERVICE || "smtp.gmail.com", // Use Gmail or another provider
//     port:587,
//     auth: {
//         user: process.env.SMTP_EMAIL, // Your email
//         pass: process.env.SMTP_PASSWORD, // App password or SMTP password
//     },
// });

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for 587
    auth: {
      user: process.env.SMTP_EMAIL, // Your Gmail address
      pass: process.env.SMTP_PASSWORD, // App password (not regular password)
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates if needed
    },
  });

/**
 * Generate a 6-digit OTP
 * @returns {string} - 6-digit OTP
 */
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

/**
 * Send OTP via email
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 * @returns {Promise<void>}
 */
const sendOTP = async (email, otp) => {
    try {
        const mailOptions = {
            from: `"TrackMate" <${process.env.SMTP_EMAIL}>`, // Customize sender name
            to: email,
            subject: "Your OTP Code for TrackMate",
            text: `Your OTP code is: ${otp}. It expires in 10 minutes.`,
            html: `<p>Your OTP code is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`, // Optional: Add HTML version
        };
        // console.log(`${process.env.SMTP_SERVICE}`);
        console.log("SMTP_EMAIL:", process.env.SMTP_EMAIL);
        console.log("SMTP_PASSWORD exists:", !!process.env.SMTP_PASSWORD);
        console.log("Attempting to send OTP to:", email);
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        // console.error("Error sending OTP:", error.message);
        // throw new Error("Failed to send OTP. Please try again later.");
        console.error("FULL NODEMAILER ERROR:");
        console.error(error);
        throw error;
    }
};

/**
 * Store OTP temporarily
 * @param {string} email - User's email
 * @param {string} otp - OTP code
 */
const storeOTP = (email, otp) => {
    otpStorage.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); // Store for 10 minutes
    console.log(otpStorage)
    console.log(`Stored OTP for ${email}:`, otp, "Expires At:", otpStorage.get(email).expiresAt);
};

/**
 * Verify OTP
 * @param {string} email - User's email
 * @param {string} enteredOTP - OTP entered by the user
 * @returns {boolean} - True if valid, else false
 */
const verifyOTP = (email, enteredOTP) => {
    const otpData = otpStorage.get(email);

    console.log(`Stored OTP Data for ${email}:`, otpData);
    console.log(`Entered OTP:`, enteredOTP);

    if (!otpData) {
        console.warn(`No OTP found for email: ${email}`);
        return false;
    }

    // Check if OTP has expired
    if (otpData.expiresAt < Date.now()) {
        otpStorage.delete(email); // Clean up expired OTP
        console.warn(`OTP expired for email: ${email}`);
        return false;
    }

    // Check if OTP matches
    if (otpData.otp === enteredOTP) {
        otpStorage.delete(email); // Remove OTP after successful verification
        console.log(`OTP verified for email: ${email}`);
        return true;
    }

    console.warn(`Invalid OTP entered for email: ${email}`);
    return false;
};

module.exports = { generateOTP, sendOTP, storeOTP, verifyOTP };