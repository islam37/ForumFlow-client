import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-0">
          
          {/* Logo / Brand */}
          <div className="text-white text-2xl font-bold">
            ForumFlow
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div>
              <h4 className="font-semibold mb-2">Company</h4>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Support</h4>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white"><FaFacebookF /></a>
            <a href="#" className="hover:text-white"><FaTwitter /></a>
            <a href="#" className="hover:text-white"><FaInstagram /></a>
            <a href="#" className="hover:text-white"><FaLinkedinIn /></a>
          </div>

        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
          &copy; {new Date().getFullYear()} ForumFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
