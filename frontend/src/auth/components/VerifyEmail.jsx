import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth.js";

import "../style/VerifyEmail.scss";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleEmail } = useAuth();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying security credentials...");

  const hasCalledAPI = useRef(false);

  useEffect(() => {
    if (hasCalledAPI.current) return;

    async function verifyEmail() {
      const token = searchParams.get("token");

      if (!token) {
        setMessage("Invalid verification link or token is missing.");
        setStatus("error");
        return;
      }

      try {
        hasCalledAPI.current = true;

        const data = await handleEmail(token);

        if (data?.success) {
          setMessage("Email status verified. Welcome back!");
          setStatus("success");

          setTimeout(() => {
            navigate("/");
          }, 1200);

          return;
        }

        setMessage("Email verification failed.");
        setStatus("error");
      } catch (err) {
        setMessage(
          err.response?.data?.message ||
            "Verification link expired or session invalid.",
        );
        setStatus("error");
      }
    }

    verifyEmail();
  }, [searchParams, handleEmail, navigate]);

  return (
    <div className="verify-container">
      <div className={`verify-card-premium status-${status}`}>
        <div className="brand-badge">
          <span className="badge-tag">Secure Auth</span>
        </div>

        <div className="status-graphic-container">
          {status === "loading" && (
            <div className="lexar-spinner">
              <div className="core-ring"></div>
              <div className="pulse-glow"></div>
            </div>
          )}

          {status === "success" && (
            <div className="lexar-success-checkmark">
              <div className="draw-check"></div>
            </div>
          )}

          {status === "error" && (
            <div className="lexar-error-cross">
              <span className="cross-line line-1"></span>
              <span className="cross-line line-2"></span>
            </div>
          )}
        </div>

        <h2 className="display-title">
          {status === "loading" && "Authenticating"}
          {status === "success" && "Access Granted"}
          {status === "error" && "Auth Rejected"}
        </h2>

        <p className="display-desc">{message}</p>

        {status === "success" && (
          <div className="fast-redirect-indicator">
            <span className="pulse-dot"></span>
            <p>Initializing dashboard redirect...</p>
          </div>
        )}

        {status === "error" && (
          <button
            className="lexar-action-btn"
            onClick={() => navigate("/register")}
          >
            Return to Registration
          </button>
        )}
      </div>
    </div>
  );
}
