import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import "../style/AuthStyle.scss";
import { useAuth } from "../../hooks/useAuth.js";





export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const { loading, handleForgotPassword } = useAuth();

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await handleForgotPassword(email);

      console.log("Forgot Password Response:", data);

      // OTP page par email bhi bhej denge
      navigate("/verify-otp", {
        state: {
          email,
        },
      });
    } catch (error) {
      console.log(
        "Forgot Password Error:",
        error.response?.data || error.message,
      );
    }
  }

  return (
    <div className="auth-wrapper ">
      <div className="auth-card page ">
        
        <h2>Forgot Password</h2>

        <p>Enter your registered email to receive a password reset OTP.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Email</label>
          </div>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}

            <Mail size={18} />
          </button>
        </form>

        <p className="auth-switch">
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
