"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/app/components/Button"; // Reusable Button component
import InputField from "@/app/components/InputField"; // Reusable InputField component
import { resetPassword } from "@/app/services/auth"; // API call to reset password

const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ new_password: string; confirm_password: string }>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const sessionToken = sessionStorage.getItem("reset-token");
    setToken(sessionToken);
  }, []);

  const handlePasswordSubmit = async (data: {
    new_password: string;
    confirm_password: string;
  }) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (data.new_password !== data.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    if (!strongPasswordRegex.test(data.new_password)) {
      setError(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      reset();

      setSuccess(null);
      return;
    }
    if (!token) {
      setError("Invalid or expired session. Please try again.");
      reset();
      return;
    }

    const res = await resetPassword({ ...data, token });
    if (res) {
      setError(null);
      setSuccess("Password reset successfully!");
      reset();
      sessionStorage.removeItem("reset-token");
    }
  };

  return (
    <div className="pt-20 px-5 md:px-16 lg:pt-36 lg:px-96">
      <h1 className="text-3xl font-bold mb-6 text-center">Reset Password</h1>

      <form onSubmit={handleSubmit(handlePasswordSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">New Password</label>
          <InputField
            placeholder="Enter your new password"
            name="new_password"
            type="password"
            register={register}
          />
          {errors.new_password && (
            <p className="text-red-500 text-sm">
              {errors.new_password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">
            Confirm New Password
          </label>
          <InputField
            placeholder="Confirm your new password"
            name="confirm_password"
            type="password"
            register={register}
          />
          {errors.confirm_password && (
            <p className="text-red-500 text-sm">
              {errors.confirm_password.message}
            </p>
          )}
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <Button type="submit" className="hover:bg-teal-500">
          Reset Password
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
