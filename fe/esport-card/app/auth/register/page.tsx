"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { sendOtp } from "../../services/auth";
import Link from "next/link";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isOtpSent, setIsOtpSent] = useState(false);

  const onSubmit = async (data: any) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!strongPasswordRegex.test(data.password)) {
      alert(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }
    const res = await sendOtp(data.email);

    if (res) {
      localStorage.setItem("temp_user_data", JSON.stringify(data));
      setIsOtpSent(true);
      alert("OTP has been sent successfully.");
    }
  };

  if (isOtpSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">OTP Sent</h2>
          <p className="text-center text-gray-600 mb-4">
            Please check your email for the OTP and proceed to the verification
            page.
          </p>
          <Button onClick={() => (window.location.href = "/verify-user")}>
            Proceed to OTP Verification
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            placeholder="First Name"
            name="first_name"
            register={register}
            errors={errors.first_name}
          />
          <InputField
            placeholder="Last Name"
            name="last_name"
            register={register}
            errors={errors.last_name}
          />
          <InputField
            placeholder="Email"
            name="email"
            register={register}
            errors={errors.email}
          />
          <InputField
            placeholder="Username"
            name="username"
            register={register}
            errors={errors.username}
          />
          <InputField
            type="password"
            placeholder="Password"
            name="password"
            register={register}
            errors={errors.password}
          />
          <InputField
            placeholder="Phone Number"
            name="phone_number"
            register={register}
            errors={errors.phone_number}
          />
          <Button type="submit">Send OTP</Button>
        </form>
        <h3 className="text-center my-6">Already have an account ?</h3>
        <div className="text-center">
          <Link
            className="hover:text-teal-500 text-blue-500 cursor-pointer text-xl font-semibold"
            href={"/auth/login"}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
