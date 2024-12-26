"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getUserProfile, updateUserProfile } from "../services/auth";
import Button from "../components/Button"; // Reusable Button component
import InputField from "../components/InputField"; // Reusable Input component
import Link from "next/link";

interface UserProfile {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

const SettingsPage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, setValue } = useForm<UserProfile>();

  // Check if profile data exists in sessionStorage
  const getCachedProfile = () => {
    const cachedProfile = sessionStorage.getItem("userProfile");
    return cachedProfile ? JSON.parse(cachedProfile) : null;
  };

  useEffect(() => {
    const cachedProfile = getCachedProfile();
    if (cachedProfile) {
      setProfile(cachedProfile);
      setValue("username", cachedProfile.username);
      setValue("email", cachedProfile.email);
      setValue("first_name", cachedProfile.first_name);
      setValue("last_name", cachedProfile.last_name);
      setValue("phone_number", cachedProfile.phone_number);
      setLoading(false);
    } else {
      const fetchProfile = async () => {
        const data = await getUserProfile();
        if (data) {
          setProfile(data);
          sessionStorage.setItem("userProfile", JSON.stringify(data));
          setValue("username", data.username);
          setValue("email", data.email);
          setValue("first_name", data.first_name);
          setValue("last_name", data.last_name);
          setValue("phone_number", data.phone_number);
        }
      };
      fetchProfile();
    }
  }, [setValue]);

  const onSubmit = async (data: UserProfile) => {
    const updatedData = await updateUserProfile(data);
    if (updatedData) {
      setProfile(updatedData);
      sessionStorage.setItem("userProfile", JSON.stringify(updatedData));
      alert("Profile updated successfully!");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="pt-20 px-5 md:px-16 lg:pt-36 lg:px-96">
      <h1 className="text-3xl font-bold mb-6 text-center">Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-5">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <InputField
            placeholder="Username"
            name="username"
            register={register}
            disabled={true}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <InputField
            placeholder="Email"
            name="email"
            register={register}
            disabled={true}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <InputField
            placeholder="First Name"
            name="first_name"
            register={register}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <InputField
            placeholder="Last Name"
            name="last_name"
            register={register}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <InputField
            placeholder="Phone Number"
            name="phone_number"
            register={register}
          />
        </div>

        <Button type="submit" className="hover:bg-teal-500">
          Update Profile
        </Button>
      </form>

      <Link
        href="/settings/change-password"
        className="text-md bg-blue-500 text-white py-2 rounded-md flex justify-center items-center hover:bg-red-400"
      >
        Change Password
      </Link>
    </div>
  );
};

export default SettingsPage;
