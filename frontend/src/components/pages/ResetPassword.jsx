import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail"); // Get stored email

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_META_URI}/api/auth/reset-password`, { email, newPassword });
      setMessage(response.data.message);
    //   setSuccess(true); 
      localStorage.removeItem("resetEmail"); // Clear stored email/
    //   navigate("/");
      setTimeout(() => {
        navigate("/"); // Redirect to login page
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#c2c0c0]">
      <form className="bg-[#626669] p-8 rounded-lg shadow-md w-96  flex flex-col justify-center text-white" onSubmit={handleResetPassword}>
        
        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Reset Password</h2>
        <p className="text-center text-sm mb-4 text-white font-semibold">{email}</p>

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg mb-3 bg-[#6C757D] text-white placeholder-white"
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg mb-3 bg-[#6C757D] text-white placeholder-white"
        />

<button type="submit" className="w-full bg-[#343A40] text-white py-2 rounded-lg hover:bg-[#818181]">
          Reset Password
        </button>

        {message && <p className="text-center text-sm mt-4 text-green-300">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
