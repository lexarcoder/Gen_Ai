import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { KeyRound, LockKeyhole, CheckCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import "../style/AuthStyle.scss";

export default function ResetPassword() {
  const [showPass, setShowPass] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const { loading, handleResetPassword } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  // Original email backend ko jayega
  const email = location.state?.email || "";

  // Email ko UI me mask karna
  function maskEmail(email) {
    if (!email) return "";

    const [username, domain] = email.split("@");

    if (!username || !domain) return "";

    if (username.length <= 2) {
      return `${username[0]}***@${domain}`;
    }

    return `${username.slice(0, 2)}***@${domain}`;
  }

  const maskedEmail = maskEmail(email);

  async function handelSubmit(e) {
    e.preventDefault();

    setError("");

    if (!email) {
      setError("Reset session expired. Please restart the process.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }


    try {
      const data = await handleResetPassword({
        email,
        newPassword,
      });

      if (data?.success) {
        alert("Password reset successfully! Please login again.");

        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password. Please try again.",
      );
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card page">
        {/* Header */}
        <div className="reset-header">
          <div className="reset-icon">
            <KeyRound size={28} />
          </div>

          <h2>Reset Password</h2>

          <p className="auth-subtitle">
            Create a new password for
            <br />
            <strong>{maskedEmail}</strong>
          </p>
        </div>

        {/* Error */}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handelSubmit}>
          {/* New Password */}
          <div className="input-group">
            <input
              type={showPass ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <label>New Password</label>

            <span onClick={() => setShowPass(!showPass)}>
              {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          {/* Password Requirement */}
          <div className="password-rules">
            <div>
              <CheckCircle
                size={15}
                className={newPassword.length >= 6 ? "valid" : ""}
              />

              <span>At least 6 characters</span>
            </div>
          </div>

          {/* Submit */}
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? (
              "Updating Password..."
            ) : (
              <>
                Update Password
                <LockKeyhole size={18} />
              </>
            )}
          </button>
        </form>

        {/* Login */}
        <p className="auth-switch">
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
