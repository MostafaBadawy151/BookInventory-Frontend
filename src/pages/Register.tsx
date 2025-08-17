import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Register: React.FC = () => {
  const { register } = useAuth();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  const validateForm = () => {
    if (!userName.trim() || !email.trim() || !fullName.trim() || !password.trim()) {
      setError("All fields are required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({ userName, email, password, fullName });
      nav("/books");
    } catch (ex: any) {
      setError(ex?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-gradient p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white shadow-lg rounded-4 p-4 p-md-5 w-100"
        style={{ maxWidth: "420px", animation: "fadeIn 0.5s ease-in-out" }}
      >
        <h2 className="text-center fw-bold text-primary mb-4">
          <i className="bi bi-person-plus-fill me-2"></i>Create an Account
        </h2>

        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
            ></button>
          </div>
        )}

        {/* Username */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Username</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-person"></i>
            </span>
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="form-control"
              placeholder="Enter username"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-envelope"></i>
            </span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter email"
              type="email"
            />
          </div>
        </div>

        {/* Full Name */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Full Name</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-card-text"></i>
            </span>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-control"
              placeholder="Enter full name"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Password</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-lock"></i>
            </span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`btn w-100 py-2 fw-semibold text-white ${
            loading ? "btn-secondary" : "btn-primary"
          }`}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Registering...
            </>
          ) : (
            <>
              <i className="bi bi-person-plus-fill me-2"></i>Register
            </>
          )}
        </button>

        {/* Login Link */}
        <p className="text-center text-muted mt-3 mb-0">
          Already have an account?{" "}
          <a href="/login" className="text-primary fw-semibold">
            Login here
          </a>
        </p>
      </form>

      {/* Inline CSS for fade animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .bg-gradient {
            background: linear-gradient(135deg, #667eea, #764ba2);
          }
        `}
      </style>
    </div>
  );
};

export default Register;
