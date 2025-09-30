import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../authComponents/AuthContext";
import LoginWithGoogle from "./LoginWithGoogle";

const Register = () => {
  const { signUp, operationLoading } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password", "");

  const onSubmit = async (data) => {
    setError("");
    try {
      await signUp(data.email, data.password, data.displayName);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8 px-4">
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-75"></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-150"></div>
      
      <div className="card w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/60 transform transition-all duration-300 hover:shadow-3xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl text-white font-bold">FF</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Join ForumFlow
          </h2>
          <p className="text-gray-600 mt-2">Create your account and start the conversation</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-6 flex items-center gap-2 animate-shake">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Display Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Display Name</label>
            <input
              type="text"
              placeholder="Enter your display name"
              {...register("displayName", { 
                required: "Display name is required",
                minLength: { value: 2, message: "Display name must be at least 2 characters" }
              })}
              className="input input-bordered w-full transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            {errors.displayName && (
              <p className="text-red-500 text-sm flex items-center gap-1 animate-fadeIn">
                <span>⚠</span> {errors.displayName.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Please enter a valid email address"
                }
              })}
              className="input input-bordered w-full transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            {errors.email && (
              <p className="text-red-500 text-sm flex items-center gap-1 animate-fadeIn">
                <span>⚠</span> {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                {...register("password", { 
                  required: "Password is required", 
                  minLength: { value: 6, message: "Password must be at least 6 characters" } 
                })}
                className="input input-bordered w-full transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <span className="text-lg">🙈</span>
                ) : (
                  <span className="text-lg">👁️</span>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm flex items-center gap-1 animate-fadeIn">
                <span>⚠</span> {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("confirmPassword", { 
                  required: "Confirm Password is required",
                  validate: value => value === password || "Passwords do not match"
                })}
                className="input input-bordered w-full transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <span className="text-lg">🙈</span>
                ) : (
                  <span className="text-lg">👁️</span>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm flex items-center gap-1 animate-fadeIn">
                <span>⚠</span> {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-none text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={operationLoading}
          >
            {operationLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Login */}
        <LoginWithGoogle />

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link 
            to="/login" 
            className="text-pink-600 font-semibold hover:text-purple-600 transition-colors duration-200 underline underline-offset-2 hover:underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;