"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCategory } from "../context/CategoryContext";
import { formattedTitle } from "../utils/formatTitle";
import { useAuth } from "../context/AuthContext";
import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { categories, loading, error } = useCategory();
  const { user, logout } = useAuth();
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserDropdown = () => setIsOpen((prev) => !prev);

  const pathname = usePathname();

  return (
    <nav className="fixed w-full bg-white shadow-md z-50 opacity-[90%]">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between ">
        <div className="text-2xl font-bold">
          <img src="/logo.png" alt="Logo" className="w-16 h-auto mb-2" />
        </div>

        <div className="hidden md:flex md:items-center md:gap-6">
          <Link href="/" className="hover:text-gray-600">
            Home
          </Link>

          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="px-4 py-2 hover:text-gray-600"
            >
              Categories
            </button>

            {isDropdownOpen && (
              <div className="absolute mt-2 rounded-md shadow-lg bg-white overflow-hidden">
                {loading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${encodeURIComponent(
                        formattedTitle(category.name)
                      )}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="hidden md:flex items-center">
            <SearchBar />
          </div>
        </div>
        {user ? (
          <>
            <button
              onClick={toggleUserDropdown}
              className="hidden md:flex items-center space-x-2 px-4 py-2"
            >
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white text-xl">
                <span className="before:content-['\1F464']"> </span>
              </div>
            </button>

            {isOpen && (
              <div className="absolute right-16 top-16 mt-1 w-48 bg-white rounded-lg shadow-lg border">
                <div className="flex items-center px-4 py-2 space-x-2 cursor-pointer hover:bg-blue-400 hover:text-white">
                  <Link
                    href="/settings"
                    className="text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>
                </div>
                <div className="flex items-center px-4 py-2 space-x-2 cursor-pointer hover:bg-blue-400 hover:text-white">
                  <Link
                    href="/wallet"
                    className="text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Wallet
                  </Link>
                </div>
                <div className="border-t">
                  <div
                    className="flex items-center px-4 py-2 space-x-2 text-red-400 cursor-pointer hover:bg-red-400 hover:text-white "
                    onClick={logout}
                  >
                    <span>Logout</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <Link
            href={pathname === "/auth/login" ? "/auth/register" : "/auth/login"}
            className="hidden md:flex px-7 py-4 rounded-2xl text-white cursor-pointer hover:bg-teal-600 bg-blue-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {pathname === "/auth/login" ? "Register" : "Login"}
          </Link>
        )}
        <div className="md:hidden">
          <SearchBar />
        </div>
        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex items-center"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke="currentColor"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded mt-2 flex flex-col gap-3 px-7">
          <Link
            href="/"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <button
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-200"
          >
            Categories
          </button>
          {isDropdownOpen && (
            <div className="ml-4">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${encodeURIComponent(
                      formattedTitle(category.name)
                    )}`}
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))
              )}
            </div>
          )}

          {user ? (
            <>
              <Link
                href="/settings"
                className="block px-4 py-2 text-white hover:bg-gray-200 bg-teal-500 rounded-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Settings
              </Link>
              <Link
                href="/wallet"
                className="block px-4 py-2 text-white hover:bg-gray-200 bg-teal-500 rounded-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Wallet
              </Link>
              <Link
                href={"/"}
                className="block px-4 py-2 text-white bg-red-400 rounded-xl"
                onClick={logout}
              >
                Logout
              </Link>
            </>
          ) : (
            <Link
              href={
                pathname === "/auth/login" ? "/auth/register" : "/auth/login"
              }
              className="block px-4 py-2 text-white bg-blue-500 rounded-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {pathname === "/auth/login" ? "Register" : "Login"}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
