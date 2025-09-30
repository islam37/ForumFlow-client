import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../authComponents/AuthContext";
import LoginWithGoogle from "./LoginWithGoogle";

const Login = () => {
  const { login, operationLoading } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setError("");
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 py-8 px-4">
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-75"></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-150"></div>
      
      <div className="card w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/60 transform transition-all duration-300 hover:shadow-3xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl text-white font-bold">FF</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-600 mt-2">Sign in to continue your conversation</p>
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
              className="input input-bordered w-full transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {errors.email && (
              <p className="text-red-500 text-sm flex items-center gap-1 animate-fadeIn">
                <span>⚠</span> {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-purple-600 hover:text-indigo-600 transition-colors duration-200 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", { 
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" }
                })}
                className="input input-bordered w-full transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
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

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              className="checkbox checkbox-sm border-gray-300 checked:border-purple-500 checked:bg-purple-500"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn w-full mt-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 border-none text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={operationLoading}
          >
            {operationLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </span>
            ) : (
              "Sign In"
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

        {/* Registration Link */}
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link 
            to="/register" 
            className="text-purple-600 font-semibold hover:text-indigo-600 transition-colors duration-200 underline underline-offset-2 hover:underline-offset-4"
          >
            Create Account
          </Link>
        </p>

        {/* Demo Account Hint */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-sm text-blue-700">
            <strong>Demo Account:</strong> test@example.com / 123456
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;