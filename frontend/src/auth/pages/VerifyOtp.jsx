import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { KeyRound, ArrowLeft, RotateCw } from "lucide-react";
import "../style/AuthStyle.scss";
import { useAuth } from "../../hooks/useAuth";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(80);
  const [canResend, setCanResend] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { loading, handleVerifyResetOTP, handleForgotPassword } = useAuth();

  const email = location.state?.email || "";

  // ==================== Redirect If Email Missing ====================

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  // ==================== Email Mask ====================

  const maskEmail = (userEmail) => {
    if (!userEmail) return "your registered email";

    const [name, domain] = userEmail.split("@");

    if (!domain) return userEmail;

    if (name.length <= 2) {
      return `${name[0]}***@${domain}`;
    }

    const maskedName = `${name.slice(0, 2)}***${name.slice(-1)}`;

    return `${maskedName}@${domain}`;
  };

  // ==================== Timer Format ====================

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  // ==================== OTP Timer ====================

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ==================== Resend OTP ====================

  const handleResendOtp = async () => {
    if (!canResend || !email || loading) return;

    try {
      await handleForgotPassword(email);

      setTimer(80);
      setCanResend(false);
      setOtp("");
    } catch (error) {
      console.log("Resend OTP Error:", error.response?.data || error.message);
    }
  };

  // ==================== Verify OTP ====================

 const handleSubmit = async (e) => {
   e.preventDefault();

   if (otp.length !== 6) {
     console.log("Please enter a valid 6-digit OTP");
     return;
   }

   if (!email) {
     console.log("Email is missing");
     return;
   }

   console.log("VERIFY OTP REQUEST:", {
     email,
     otp,
   });

   try {
     const data = await handleVerifyResetOTP({
       email,
       otp,
     });

     console.log("OTP Verification Response:", data);

     navigate("/reset-password", {
       state: {
         email,
         otp,
       },
     });
   } catch (error) {
     console.log("OTP Verification Error:", error);
     console.log("Backend Error:", error.response?.data || error.message);
   }
 };

  // ==================== UI ====================

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Verify OTP</h2>

        <p>
          Enter the 6-digit OTP sent to <strong>{maskEmail(email)}</strong>.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);

                setOtp(value);
              }}
            />

            <label>Enter OTP</label>
          </div>

          <button
            className="primary-btn"
            type="submit"
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Verify OTP"}

            <KeyRound size={18} />
          </button>
        </form>

        <div className="auth-switch">
          {canResend ? (
            <button
              type="button"
              onClick={handleResendOtp}
              className="changeBtn"
              disabled={loading}
            >
              <RotateCw size={14} />

              {loading ? "Sending..." : "Resend OTP"}
            </button>
          ) : (
            <span>
              Resend code in <strong>{formatTime(timer)}</strong>
            </span>
          )}
        </div>

        <p className="auth-switch">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="changeBtn"
          >
            <ArrowLeft size={15} />
            Change Email
          </button>
        </p>
      </div>
    </div>
  );
}
