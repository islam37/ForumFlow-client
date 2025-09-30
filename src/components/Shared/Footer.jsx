import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaArrowRight, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div>
            <div className="text-white text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              ForumFlow
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Connect, share, and grow with a community of passionate individuals. 
              Your voice matters in every discussion.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-gray-800 hover:bg-blue-600 p-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <FaFacebookF className="text-sm" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-400 p-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <FaTwitter className="text-sm" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-pink-600 p-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <FaInstagram className="text-sm" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-700 p-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <FaLinkedinIn className="text-sm" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-blue-500"></span>
            </h4>
            <ul className="space-y-3">
              {["Popular Discussions", "Latest Topics", "Community Guidelines", "Events & Meetups"].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-white flex items-center gap-2 transition-all duration-300 group">
                    <FaArrowRight className="text-blue-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg relative inline-block">
              Support
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-green-500"></span>
            </h4>
            <ul className="space-y-3">
              {["Help Center", "Contact Support", "Report Issue", "FAQs"].map((item, idx) => (
                <li key={idx}>
                  <a href="contact-support" className="hover:text-white flex items-center gap-2 transition-all duration-300 group">
                    <FaArrowRight className="text-green-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} ForumFlow. All rights reserved.
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Cookie Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Sitemap</a>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              Made with <FaHeart className="text-red-500 animate-pulse" /> by the ForumFlow team
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
