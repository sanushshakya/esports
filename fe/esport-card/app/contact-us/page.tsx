import React from "react";

const ContactUs = () => {
  return (
    <div className="pt-20 px-5 md:px-16 lg:pt-36 lg:px-96">
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>

      <div className="space-y-6 text-lg text-gray-700">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Our Office</h2>
          <p>EsportsCardNepal</p>
          <p>123 Main Street, Kathmandu, Nepal</p>
          <p>ZIP Code: 44600</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Phone Support</h2>
          <p>Customer Support: +977-9800000000</p>
          <p>Office: +977-1-4000000</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Email Support</h2>
          <p>General Queries: support@esportscardnepal.com</p>
          <p>Technical Support: tech@esportscardnepal.com</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Follow Us</h2>
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

        <div>
          <h2 className="text-2xl font-semibold mb-2">Working Hours</h2>
          <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
          <p>Saturday - Sunday: Closed</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
