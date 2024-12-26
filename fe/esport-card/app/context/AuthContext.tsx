"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { setCookie, getCookie, removeCookie } from "../utils/cookies";
import { loginUser } from "../services/auth";

interface AuthContextProps {
  user: { email: string; user_id: number } | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ email: string; user_id: number } | null>(
    null
  );
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  useEffect(() => {
    const token = getCookie("access_token") || null; // Ensures that undefined is replaced by null
    const refresh_tok = getCookie("refresh_token") || null; // Ensures that undefined is replaced by null
    const userData = getCookie("user_data") || null; // Ensures that undefined is replaced by null

    if (token && userData) {
      setUser(JSON.parse(userData));
      setAccessToken(token);
      setRefreshToken(refresh_tok);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginUser(email, password);
    const {
      access_token,
      refresh_token,
      message,
      email: userEmail,
      user_id,
    } = response;

    if (message === "User logged in successfully.") {
      // Store tokens in cookies
      setCookie("access_token", access_token, 3600);
      setCookie("refresh_token", refresh_token, 3600 * 24);
      setCookie(
        "user_data",
        JSON.stringify({ email: userEmail, user_id }),
        3600
      );

      // Update state
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      setUser({ email: userEmail, user_id });
      alert(message);
    } else {
      throw new Error(message);
    }
  };

  const logout = () => {
    removeCookie("access_token");
    removeCookie("refresh_token");
    removeCookie("user_data");

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, refreshToken, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
