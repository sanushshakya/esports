"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/app/components/Button";
import InputField from "@/app/components/InputField";
import { updateUserProfile } from "@/app/services/auth";

interface ChangePasswordForm {
  new_password: string;
  confirm_password: string;
}

const ChangePasswordPage = () => {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<ChangePasswordForm>();

  const onSubmit = async (data: ChangePasswordForm) => {
    const { new_password, confirm_password } = data;
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (new_password !== confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    if (!strongPasswordRegex.test(new_password)) {
      setError(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      reset();
      return;
    }

    const res = await updateUserProfile({ password: new_password });
    if (res) {
      alert("Password updated successfully!");
      reset();
      window.location.href = "/settings";
    }
  };

  return (
    <div className="pt-20 px-5 md:px-16 lg:pt-36 lg:px-96">
      <h1 className="text-3xl font-bold mb-6 text-center">Change Password</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">New Password</label>
          <InputField
            type="password"
            placeholder="Enter new password"
            name="new_password"
            register={register}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <InputField
            type="password"
            placeholder="Re-enter new password"
            name="confirm_password"
            register={register}
          />
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <Button type="submit" className="hover:bg-teal-500">
          Change Password
        </Button>
      </form>
    </div>
  );
};
export default ChangePasswordPage;
