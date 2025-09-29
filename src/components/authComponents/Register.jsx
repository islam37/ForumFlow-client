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
      await signUp(data.email, data.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="card w-full max-w-md shadow-xl bg-white p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-pink-600">Register on ForumFlow</h2>
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
              {...register("password", { 
                required: "Password is required", 
                minLength: { value: 6, message: "Password must be at least 6 characters" } 
              })}
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

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword", { 
                required: "Confirm Password is required",
                validate: value => value === password || "Passwords do not match"
              })}
              className="input input-bordered w-full"
            />
            <span
              className="absolute right-3 top-2 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

          <button
            type="submit"
            className="btn btn-primary w-full mt-2"
            disabled={operationLoading}
          >
            {operationLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <br />

     <p className="text-black text-center"> OR</p>
        <LoginWithGoogle />

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
