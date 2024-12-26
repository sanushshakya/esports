"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login, accessToken } = useAuth();

  useEffect(() => {
    if (accessToken) {
      window.location.href = "/";
    }
  }, [accessToken]);

  const onSubmit = async (data: any) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    await login(data.email, data.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            placeholder="Email"
            name="email"
            register={register}
            errors={errors.email}
          />

          <InputField
            placeholder="Password"
            type="password"
            name="password"
            register={register}
            errors={errors.password}
          />

          <Button type="submit" className="hover:bg-teal-500">
            Login
          </Button>
        </form>
        <div className="text-right my-5">
          <Link
            className="text-md font-light text-teal-500 hover:text-red-400 text-center cursor-pointer"
            href={"/auth/forget-password"}
          >
            Forget Password ?
          </Link>
        </div>
        <h3 className="text-center mb-2">Don`&apos;`t have an account ?</h3>
        <h3 className="text-center">
          Create a new account.
          <Link
            className="hover:text-teal-500 text-blue-500 cursor-pointer text-xl font-semibold"
            href={"/auth/register"}
          >
            Sign Up
          </Link>
        </h3>
      </div>
    </div>
  );
};

export default LoginPage;
