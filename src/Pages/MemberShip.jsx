// pages/Membership.jsx
import React from "react";

const Membership = () => {
  const handlePayment = () => {
    // TODO: Integrate payment gateway
    alert("Payment feature coming soon!");
  };

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 bg-white shadow-lg rounded-lg text-center">
      <h1 className="text-3xl font-bold mb-4">Become a Member</h1>
      <p className="mb-6">
        Pay <span className="font-semibold">N Taka/USD</span> to become a member and unlock exclusive features!
      </p>
      <button
        onClick={handlePayment}
        className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded hover:bg-indigo-600 transition"
      >
        Pay Now
      </button>
    </div>
  );
};

export default Membership;
