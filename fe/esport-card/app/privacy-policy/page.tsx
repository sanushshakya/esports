import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="pt-20 px-5 md:px-16 lg:pt-36 lg:px-96">
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>

      <div className="space-y-4 text-lg text-gray-700">
        <p>
          At EsportsCardNepal, we are committed to protecting your privacy and
          ensuring your personal data is handled responsibly. This Privacy
          Policy outlines how we collect, use, and safeguard your information.
        </p>

        <h2 className="text-2xl font-semibold mt-6">
          1. Information We Collect
        </h2>
        <p>
          We collect personal information such as your name, email address,
          phone number, and other relevant details during registration and
          transactions. Additional data, like wallet balance and recharge
          history, is collected to facilitate financial operations.
        </p>
        <p>
          Non-personal information, such as browser type, IP address, and
          cookies, is also collected to enhance user experience and monitor
          platform performance.
        </p>

        <h2 className="text-2xl font-semibold mt-6">
          2. How We Use Your Information
        </h2>
        <p>Your personal information is used to:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Provide access to our platform and its features.</li>
          <li>Facilitate wallet recharge and balance inquiries.</li>
          <li>
            Enhance security through OTP-based authentication and session
            management.
          </li>
          <li>
            Send important notifications, such as password resets or recharge
            approvals.
          </li>
          <li>Improve platform performance and resolve technical issues.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">
          3. Data Storage and Security
        </h2>
        <p>
          Your data is stored securely in our servers, protected by
          industry-standard encryption. We use JWT tokens for user
          authentication and session storage for caching non-sensitive data like
          banners and user preferences.
        </p>
        <p>
          Passwords are hashed using secure algorithms and are never stored in
          plain text. Only authorized personnel have access to user data for
          legitimate purposes.
        </p>

        <h2 className="text-2xl font-semibold mt-6">
          4. Sharing of Information
        </h2>
        <p>
          We do not sell, rent, or trade your personal information to third
          parties. Information may be shared with trusted service providers for
          operational purposes, such as sending OTP emails. These providers are
          bound by confidentiality agreements.
        </p>

        <h2 className="text-2xl font-semibold mt-6">
          5. Cookies and Tracking Technologies
        </h2>
        <p>
          Our platform uses cookies to enhance your browsing experience. Cookies
          help us remember your preferences, track your activities, and deliver
          a personalized experience. You can control cookie settings through
          your browser.
        </p>

        <h2 className="text-2xl font-semibold mt-6">6. User Rights</h2>
        <p>
          You have the right to access, update, or delete your personal
          information. To exercise these rights, please contact us through the
          "Contact Us" section. Users also have the option to deactivate their
          account permanently using our account deletion API.
        </p>

        <h2 className="text-2xl font-semibold mt-6">
          7. Changes to the Privacy Policy
        </h2>
        <p>
          We may update this Privacy Policy periodically to reflect changes in
          our practices or legal requirements. Users will be notified of
          significant updates through the platform.
        </p>

        <h2 className="text-2xl font-semibold mt-6">8. Contact Information</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy,
          please reach out to us through the "Contact Us" section on our
          website.
        </p>

        <p className="font-semibold mt-8">
          Thank you for trusting EsportsCardNepal with your information. Your
          privacy is our priority.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
