import React from "react";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const ContactSupport = () => {
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Support</h2>
      <p className="text-gray-600 mb-6">
        If you have any questions or issues, feel free to reach out to us.
      </p>
      <div className="flex items-center mb-4">
        <FaPhoneAlt className="text-blue-500 mr-3" />
        <a href="tel:+8801568289690" className="text-gray-700 hover:text-blue-500">
          01568289690
        </a>
      </div>
      <div className="flex items-center">
        <FaEnvelope className="text-green-500 mr-3" />
        <a
          href="mailto:islamuddin3725@gmail.com"
          className="text-gray-700 hover:text-green-500"
        >
          islamuddin3725@gmail.com
        </a>
      </div>
    </div>
  );
};

export default ContactSupport;
