import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="pt-20 px-5 md:px-16 lg:pt-36 lg:px-96">
      {/* Title Section */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        Terms and Conditions
      </h1>

      {/* Terms Section */}
      <div className="space-y-4 text-lg text-gray-700">
        <p>
          Welcome to EsportsCardNepal. By using our platform, you agree to abide
          by the following terms and conditions. Please read them carefully to
          ensure a seamless and secure experience.
        </p>

        <h2 className="text-2xl font-semibold mt-6">1. General Usage</h2>
        <p>
          EsportsCardNepal is designed to connect users for esports card trading
          and showcasing. Users must ensure that any information provided is
          accurate and up to date. Misuse of the platform for fraudulent or
          illegal activities is strictly prohibited.
        </p>

        <h2 className="text-2xl font-semibold mt-6">2. Account and Security</h2>
        <p>
          Users are responsible for maintaining the confidentiality of their
          account credentials. Any unauthorized access must be reported
          immediately. Our platform uses JWT tokens for secure authentication
          and user interaction.
        </p>

        <h2 className="text-2xl font-semibold mt-6">
          3. Wallet and Transactions
        </h2>
        <p>
          EsportsCardNepal includes a built-in wallet functionality. Users can
          store and recharge their balance after administrative approval. Any
          requests for recharge must meet a minimum amount threshold of 500
          units. Fraudulent recharge requests or misuse of wallet functionality
          will result in account suspension.
        </p>

        <h2 className="text-2xl font-semibold mt-6">4. Password Management</h2>
        <p>
          Users must maintain strong and secure passwords. In case of a
          forgotten password, users can use the "Forget Password" feature to
          reset it securely using OTP-based verification. EsportsCardNepal does
          not take responsibility for data breaches caused by user negligence.
        </p>

        <h2 className="text-2xl font-semibold mt-6">
          5. Privacy and Data Collection
        </h2>
        <p>
          EsportsCardNepal values your privacy and ensures that data is used
          solely for improving user experience and platform functionality. By
          using our services, you agree to allow us to store session-based data
          for enhanced performance.
        </p>

        <h2 className="text-2xl font-semibold mt-6">
          6. Content and Intellectual Property
        </h2>
        <p>
          All content on the platform, including banners, images, and code, is
          the property of EsportsCardNepal. Unauthorized reproduction or
          distribution is strictly prohibited.
        </p>

        <h2 className="text-2xl font-semibold mt-6">
          7. Changes to Terms and Conditions
        </h2>
        <p>
          EsportsCardNepal reserves the right to modify these terms at any time
          without prior notice. Continued use of the platform signifies
          acceptance of the revised terms.
        </p>

        <h2 className="text-2xl font-semibold mt-6">8. Contact Information</h2>
        <p>
          For any inquiries or support, users can reach out to us through the
          "Contact Us" section on the website.
        </p>

        <p className="font-semibold mt-8">
          Thank you for being a part of the EsportsCardNepal community.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
