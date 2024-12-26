"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { verifyOtp, registerUser } from "../../services/auth";
import axios from "axios";

const OtpVerificationPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [message, setMessage] = useState("");

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const onSubmit = async (data: any) => {
    try {
      // Get temporary user data from local storage
      const tempUserData = JSON.parse(
        localStorage.getItem("temp_user_data") || "{}"
      );
      console.log("Retrieved email:", tempUserData.email);

      axios.defaults.withCredentials = true;

      // Step 1: Verify OTP
      try {
        const { token } = await verifyOtp(tempUserData.email, data.otp);

        console.log("OTP verification successful. Token received:", token);

        await delay(5000);

        // Step 2: Register User
        try {
          await registerUser(
            tempUserData.first_name,
            tempUserData.last_name,
            tempUserData.email,
            tempUserData.username,
            tempUserData.password,
            tempUserData.phone_number,
            token
          );

          localStorage.removeItem("temp_user_data");
          setMessage("Registration successful! You can now log in.");
        } catch (error: any) {
          console.error("User registration error:", error.error);
          setMessage(
            `Registration failed: ${
              error.response?.data?.error || error.message
            }`
          );
        }
      } catch (error: any) {
        console.error("OTP verification error:", error.message);
        setMessage(
          `OTP verification failed: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    } catch (error: any) {
      console.error("General error:", error.message);
      setMessage(`Something went wrong: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          OTP Verification
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            placeholder="Enter OTP"
            name="otp"
            register={register}
            errors={errors.otp}
          />
          <Button type="submit">Verify OTP</Button>
        </form>
        {message && <p className="text-center text-red-500 mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default OtpVerificationPage;
