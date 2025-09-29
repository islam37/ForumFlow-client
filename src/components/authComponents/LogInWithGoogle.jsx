import React, { useContext, useState } from "react";
import { AuthContext } from "../authComponents/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginWithGoogle = () => {
  const { loginWithGoogle } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <button
        onClick={handleGoogleLogin}
        className="btn btn-error w-full mt-2"
        disabled={loading}
      >
        {loading ? "Processing..." : "Login with Google"}
      </button>
    </div>
  );
};

export default LoginWithGoogle;
