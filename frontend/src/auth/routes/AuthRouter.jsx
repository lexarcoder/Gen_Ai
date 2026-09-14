import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const VerifyEmail = lazy(() => import("../components/VerifyEmail"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const VerifyOtp = lazy(() => import("../pages/VerifyOtp"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));

const AuthRouter = () => {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Suspense>
  );
};

export default AuthRouter;