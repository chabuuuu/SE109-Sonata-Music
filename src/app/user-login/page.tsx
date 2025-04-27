'use client';

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [isClient, setIsClient] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white relative">
      {/* Top and Bottom blue lines */}
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

      {/* Right: Login form */}
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
            <div className="flex items-center justify-between text-sm">
              <a href="#" className="text-blue-700 font-semibold hover:underline">
                Forgot your password?
              </a>
              <label className="inline-flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox accent-blue-700" />
                <span className="text-gray-700">Remember me</span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 rounded font-semibold hover:bg-blue-800"
            >
              LOG IN
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-700">Don’t have an account?</p>
            <a
              href="/register"
              className="inline-block mt-2 px-6 py-2 border border-gray-400 text-gray-800 rounded-full text-sm font-semibold hover:bg-gray-100"
            >
              SIGN UP FOR SONATA
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
