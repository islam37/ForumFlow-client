import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Errorpage = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-tr from-purple-700 via-pink-600 to-red-500 overflow-hidden">
      
      {/* Floating particle circles */}
      <motion.div 
        className="absolute w-72 h-72 bg-white/10 rounded-full top-20 left-10"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />
      <motion.div 
        className="absolute w-60 h-60 bg-white/10 rounded-full bottom-20 right-10"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      />

      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 text-center bg-white/20 backdrop-blur-lg p-12 rounded-3xl shadow-2xl max-w-md mx-4"
      >
        {/* Glitch effect for 404 */}
        <motion.h1
          className="text-9xl font-extrabold text-white mb-6 relative"
          animate={{ x: [0, -5, 5, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          404
        </motion.h1>

        <p className="text-xl md:text-2xl font-semibold text-white mb-4">
          Oops! Page Not Found
        </p>
        <p className="text-white/90 mb-8">
          The page you're looking for might be removed, had its name changed, or is temporarily unavailable.
        </p>

        <Link 
          to="/" 
          className="btn btn-primary btn-lg transition-transform hover:scale-105"
        >
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
};

export default Errorpage;
