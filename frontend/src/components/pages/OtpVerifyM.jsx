import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OtpVerifyM = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("otpEmail");
    if (storedEmail) {
      setEmail(storedEmail); // Auto-fill email
    }
  }, []);
  const [message, setMessage] = useState("");

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    console.log("🔹 Sending OTP Verification Request:", { email, otp });

    try {
      const response = await axios.post(`${import.meta.env.VITE_META_URI}/api/auth/verify-otp`, { email, otp });
      console.log("🔹 Server Response:", response.data);

      if (response.data.success) {
        // alert("OTP verified successfully!");
        setMessage("OTP Verified Successfully! Redirecting...");
        localStorage.removeItem("otpEmail"); // Clear stored email after successful login
        setTimeout(() => {
            navigate("/manager-dashboard");
        }, 2000);
      } else {
        // alert("Invalid OTP. Please try again.");
        setMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
        setMessage(error.response?.data?.message || "Error verifying OTP");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#c2c0c0]">
      <form className="bg-[#626669] p-6 rounded-lg shadow-md w-96 text-white" onSubmit={handleVerifyOtp}>
        <h2 className="text-xl font-bold mb-4 text-center text-white">Verify OTP</h2>

        <input
          type="email"
          name="email"
          value={email}
          disabled // Make it read-only
          className="w-full px-3 py-2 border rounded-lg mb-3 bg-[#6C757D] text-white placeholder-white"
        />

        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-3 bg-[#6C757D] text-white placeholder-white"
          required
        />

<button type="submit" className="w-full bg-[#343A40] text-white py-2 rounded-lg hover:bg-[#818181]">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OtpVerifyM;
