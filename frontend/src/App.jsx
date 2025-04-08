import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import EntryPage from "./components/pages/EntryPage";
import ManagerLogin from "./components/pages/ManagerLogin";
import EmployeeLogin from "./components/pages/EmployeeLogin";
import ManagerSignup from "./components/pages/ManagerSignup";
import EmployeeSignup from "./components/pages/EmployeeSignup";
import OtpLogin from "./components/pages/OtpLogin";
import OtpVerify from "./components/pages/OtpVerify";
import ForgotPassword from "./components/pages/ForgotPassword";
import ResetPassword from "./components/pages/ResetPassword";
import VerifyResetOtp from "./components/pages/VerifyResetOtp";
import ManagerDashboard from "./components/pages/ManagerDashboard";
import AddTask from "./components/pages/AddTask";
import ViewSchedule from "./components/pages/ViewSchedule";
import ViewLogs from "./components/pages/ViewLogs";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/manager-login" element={<ManagerLogin />} />
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/manager-signup" element={<ManagerSignup />} />
        <Route path="/employee-signup" element={<EmployeeSignup />} />
        <Route path="/otp-login" element={<OtpLogin />} />
        <Route path="/verify-otp" element={<OtpVerify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard/>}/>
        <Route path="/manager/add-task/:employeeId" element={<AddTask/>}/>
        <Route path="/manager/view-schedule/:employeeId" element={<ViewSchedule/>}/>
        <Route path="/view-logs" element={<ViewLogs/>}/>
      </Routes>
    </Router>
  );
}

export default App;
