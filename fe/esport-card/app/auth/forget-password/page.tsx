"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/app/components/Button";
import InputField from "@/app/components/InputField";
import { sendPasswordOtp, verifyPasswordOtp } from "@/app/services/auth";

const ForgotPasswordPage = () => {
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    reset: resetEmail,
  } = useForm<{ email: string }>();
  const { register: registerOtp, handleSubmit: handleSubmitOtp } = useForm<{
    otp: string;
  }>();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  const handleEmailSubmit = async (data: { email: string }) => {
    try {
      await sendPasswordOtp(data);
      setEmail(data.email);
      setIsOtpSent(true);
      setOtpError(null);
      resetEmail();
    } catch (err) {
      console.error("Error sending OTP", err);
      setOtpError("Failed to send OTP. Please try again.");
    }
  };

  const handleOtpSubmit = async (data: { otp: string }) => {
    try {
      const res = await verifyPasswordOtp({ ...data, email: email! });
      if (res) {
        sessionStorage.setItem("reset-token", res.token);
        alert("OTP verified successfully! Redirecting to reset password...");
        window.location.href = "/auth/reset-password";
      }
    } catch (err) {
      console.error("Invalid OTP", err);
      setOtpError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="pt-20 px-5 md:px-16 lg:pt-36 lg:px-96">
      <h1 className="text-3xl font-bold mb-6 text-center">Forgot Password</h1>

      {!isOtpSent ? (
        <form
          onSubmit={handleSubmitEmail(handleEmailSubmit)}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Email</label>
            <InputField
              placeholder="Enter your email"
              name="email"
              register={registerEmail}
            />
          </div>
          <Button type="submit" className="hover:bg-teal-500">
            Send OTP
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmitOtp(handleOtpSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">OTP</label>
            <InputField
              placeholder="Enter the OTP sent to your email"
              name="otp"
              register={registerOtp}
            />
          </div>
          {otpError && <p className="text-red-500 text-center">{otpError}</p>}
          <Button type="submit" className="hover:bg-teal-500">
            Verify OTP
          </Button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
