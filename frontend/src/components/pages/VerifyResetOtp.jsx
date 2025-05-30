import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Bgimg from "../images/background2.jpeg";
import Logoimg from "../images/trackmate.png";
import { FiArrowLeft } from "react-icons/fi";

const VerifyResetOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail"); // Get stored email

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_META_URI}/api/auth/verify-reset-otp`, { email, otp });
      setMessage(response.data.message);
      navigate("/reset-password"); // Redirect to reset password page
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div
                    className="w-full min-h-screen bg-[#c2c0c0] flex flex-col relative"
                    style={{
                    backgroundImage: `url(${Bgimg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                    backgroundRepeat: "no-repeat",
                    opacity: 80, // Increased for better visibility
                                    // filter: "blur(2px)", // Subtle blur to make content pop
                    }}
                    >
                    {/* Gradient Overlay */}
                   <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-transparent z-0"></div>
                  {/* Navbar */}
                                                  <nav className="w-full flex  items-center px-8 py-5 bg-[#343A40]/50 backdrop-blur-md shadow-md h-20 relative z-10">
                                                  <FiArrowLeft
                                                      className="ml-4 text-white cursor-pointer z-50"
                                                      size={25}
                                                     onClick={() => navigate("/forgot-password")}
                                                      />
                                                    <div className="flex items-center flex-1 justify-center absolute left-0 right-0">
                                                      <img src={Logoimg} alt="TrackMate Logo" className="h-12 w-12 object-contain" />
                                                      <h1 className="text-3xl font-bold text-white drop-shadow-md">TrackMate</h1>
                                                    </div>
                                                  </nav>
                                                  <div className="flex items-center justify-center min-h-screen">
                                                  <form
                                            className="bg-black/40 backdrop-blur-md border border-white/30 hover:bg-white/10 text-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center cursor-pointer hover:-translate-y-2 transition-transform duration-300"
                                            onSubmit={handleVerifyOtp}
                                          >
        
        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Verify OTP</h2>
        <p className="text-center text-sm mb-4 text-white">An OTP has been sent to your email.</p>

        <p className="text-center text-sm mb-2 text-white font-semibold">{email}</p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg mb-3 bg-[#6C757D] text-white placeholder-white"
        />

<button type="submit" className="w-full bg-[#343A40] text-white py-2 rounded-lg hover:bg-[#818181]">
          Verify OTP
        </button>

        {message && <p className="text-center text-sm mt-4 text-green-300">{message}</p>}
      </form>
    </div>
    </div>
  );
};
export default VerifyResetOtp;
