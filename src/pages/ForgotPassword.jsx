import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();

  const checkEmail = async (data) => {
    try {
      const response = await axios.post("http://localhost:8000/api/check-email/", {
        email: data.email,
      });

      if (response.data.exists) {
        setEmail(data.email);
        setStep(2);
        toast.success("Email verified! Please set a new password");
      } else {
        toast.error("Email not found in our system");
      }
    } catch (error) {
      toast.error("An error occurred while checking email");
      console.error("Email check error:", error);
    }
  };

  const resetPassword = async (data) => {
    try {
      await axios.post("http://localhost:8000/api/forgot-password/", {
        email: email,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });

      toast.success("Password changed successfully!");
      reset();
      navigate("/login");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error || "Password reset failed");
      } else {
        toast.error("Network error. Please try again.");
      }
      console.error("Password reset error:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="frg-container">
      <Toaster position="top-center" />
      <div className="frg-card">
        <div className="frg-header">
          {step === 2 && (
            <button 
              onClick={() => setStep(1)}
              className="frg-back-button"
            >
              ← Back
            </button>
          )}
          <h1 className="frg-title">Forgot Password</h1>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSubmit(checkEmail)} className="frg-form">
            <div className="frg-form-group">
              <label htmlFor="email" className="frg-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={`frg-input ${errors.email ? "frg-input-error" : ""}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="frg-error">{errors.email.message}</span>
              )}
            </div>

            <button type="submit" className="frg-button frg-button-primary">
              Verify Email
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit(resetPassword)} className="frg-form">
            <div className="frg-form-group">
              <label htmlFor="new_password" className="frg-label">
                New Password
              </label>
              <div className="frg-password-input-container">
                <input
                  id="new_password"
                  type={showPassword ? "text" : "password"}
                  className={`frg-input ${
                    errors.new_password ? "frg-input-error" : ""
                  }`}
                  {...register("new_password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  className="frg-password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.new_password && (
                <span className="frg-error">{errors.new_password.message}</span>
              )}
            </div>

            <div className="frg-form-group">
              <label htmlFor="confirm_password" className="frg-label">
                Confirm Password
              </label>
              <div className="frg-password-input-container">
                <input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`frg-input ${
                    errors.confirm_password ? "frg-input-error" : ""
                  }`}
                  {...register("confirm_password", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("new_password") || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  className="frg-password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirm_password && (
                <span className="frg-error">
                  {errors.confirm_password.message}
                </span>
              )}
            </div>

            <button type="submit" className="frg-button frg-button-primary">
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;