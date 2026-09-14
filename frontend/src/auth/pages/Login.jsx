import React, { useState } from "react";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

import "../style/AuthStyle.scss";
import { useAuth } from "../../hooks/useAuth.js";

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, handleLogin, handleGoogleLogin, handleGithubLogin } =
    useAuth();

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const success = await handleLogin({
        email,
        password,
      });

      if (success) {
        navigate("/");
      }
    } catch (error) {
      console.log("Login failed:", error);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card page">
        <h2>Login</h2>

        <div className="social-login">
          <button type="button" onClick={handleGoogleLogin}>
            <FcGoogle size={18} />
            Google
          </button>

          <button type="button" onClick={handleGithubLogin}>
            <FaGithub size={18} />
            GitHub
          </button>
        </div>

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

          <div className="input-group">
            <input
              type={showPass ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label>Password</label>

            <span onClick={() => setShowPass(!showPass)}>
              {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
            <LogIn size={18} />
          </button>
        </form>

        <p className="auth-switch">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
