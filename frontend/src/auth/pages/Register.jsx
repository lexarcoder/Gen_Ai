import React, { useState } from "react";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { UserPlus } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";

import "../style/AuthStyle.scss";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, handleRegister, handleGoogleLogin, handleGithubLogin } =
    useAuth();

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await handleRegister({
        username,
        email,
        password,
      });

      if (res) {
        navigate("/");
      }
    } catch (error) {
      console.log("Register error:", error);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card page">
        <h2>Register</h2>

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
              type="text"
              required
              minLength={3}
              maxLength={20}
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Username</label>
          </div>

          <div className="input-group">
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input
              type={showPass ? "text" : "password"}
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label>Password</label>

            <span onClick={() => setShowPass(!showPass)}>
              {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
            <UserPlus size={18} />
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
