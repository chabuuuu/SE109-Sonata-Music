'use client';

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [isClient, setIsClient] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white relative">
      {/* Top and Bottom blue lines (thicker) */}
      <div className="absolute top-0 left-0 w-full h-4 bg-blue-900" />
      <div className="absolute bottom-0 left-0 w-full h-4 bg-blue-900" />

      {/* Left: Image */}
      <div className="hidden md:block">
        <img
          src="/violin-sheet.jpeg"
          alt="Violin with sheet music"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right: Register form */}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <div className="flex justify-center mb-6">
            <img
              src="/sonata-logo.png"
              alt="Sonata Logo"
              className="h-20"
            />
          </div>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full name</label>
              <input
                type="text"
                placeholder="Full name"
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                placeholder="Username"
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Retype password</label>
              <div className="relative">
                <input
                  type={showRetypePassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowRetypePassword((prev) => !prev)}
                >
                  {showRetypePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 rounded font-semibold hover:bg-blue-800"
            >
              REGISTER
            </button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-700">
            Already have an account?
            <a href="/login" className="text-blue-600 font-medium ml-1">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
