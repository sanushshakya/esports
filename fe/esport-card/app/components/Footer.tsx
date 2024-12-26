import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div className="flex flex-col items-center lg:items-start mb-6 lg:mb-0 lg:w-[30%]">
            <img src="/logo.png" alt="Logo" className="w-32 h-auto mb-2" />
            <p className="text-center lg:text-left text-sm text-gray-400">
              The best platform for sports cards in Nepal. Collect, trade, and
              showcase your passion.
            </p>
          </div>

          <div className="flex space-x-8 mb-6 lg:mb-0">
            <a href="/" className="text-sm text-gray-400 hover:text-teal-500">
              Home
            </a>
            <a
              href="/about-us"
              className="text-sm text-gray-400 hover:text-teal-500"
            >
              About
            </a>
            <a
              href="/terms-and-conditions"
              className="text-sm text-gray-400 hover:text-teal-500"
            >
              Terms & Conditions
            </a>
            <a
              href="/privacy-policy"
              className="text-sm text-gray-400 hover:text-teal-500"
            >
              Privacy Policy
            </a>
            <a
              href="/contact-us"
              className="text-sm text-gray-400 hover:text-teal-500"
            >
              Contact Us
            </a>
          </div>

          <div className="flex space-x-6">
            <a
              href="https://www.facebook.com/esportscards?mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook text-2xl text-gray-400 hover:text-teal-500"></i>
            </a>
            <a
              href="https://www.instagram.com/theesportscards/?igshid=OGQ5ZDc2ODk2ZA%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram text-2xl text-gray-400 hover:text-teal-500"></i>
            </a>
            <a
              href="https://www.tiktok.com/@_deepak_tamang"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-tiktok text-2xl text-gray-400 hover:text-teal-500"></i>
            </a>
            <a
              href="https://wa.me/9827617730"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-whatsapp text-2xl text-gray-400 hover:text-teal-500"></i>
            </a>
          </div>
        </div>

        <div className="text-center text-sm text-gray-400 mt-6">
          <p>&copy; 2024 esportscardnepal.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
