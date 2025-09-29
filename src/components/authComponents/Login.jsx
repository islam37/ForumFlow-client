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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="card w-full max-w-md shadow-xl bg-white p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">Login to ForumFlow</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="input input-bordered w-full"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="input input-bordered w-full"
            />
            <span
              className="absolute right-3 top-2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <button
            type="submit"
            className="btn btn-primary w-full mt-2"
            disabled={operationLoading}
          >
            {operationLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Reusable Google Login */}
        <LoginWithGoogle />

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-purple-700 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
