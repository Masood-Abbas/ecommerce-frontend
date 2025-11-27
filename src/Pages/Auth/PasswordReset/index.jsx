import React from "react";
import { Route, Routes } from "react-router-dom";
import ForgetPassword from "./ForgetPassword";
import VerifyOTP from "./VerifyOtp";
import ResetPassword from "./ResetPassword";

const PasswordReset = () => {
  return (
    <Routes>
      <Route path="forget-Password" element={<ForgetPassword />} />
      <Route path="verify-otp" element={<VerifyOTP />} />
      <Route path="new-password" element={<ResetPassword />} />
    </Routes>
  );
};

export default PasswordReset;
