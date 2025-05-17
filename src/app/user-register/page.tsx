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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F8F0E3] relative font-['Playfair_Display',serif] text-[#3A2A24]">
      {/* Top and Bottom decorative lines */}
      <div className="absolute top-0 left-0 w-full h-4 bg-[#C8A97E]" />
      <div className="absolute bottom-0 left-0 w-full h-4 bg-[#C8A97E]" />

      {/* Left: Image with vintage overlay */}
      <div className="hidden md:block relative">
        <img
          src="/violin-sheet.jpeg"
          alt="Violin with sheet music"
          className="h-full w-full object-cover grayscale-[20%] sepia-[10%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3A2A24]/30 to-transparent"></div>
      </div>

      {/* Right: Register form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md p-8 bg-[#F0E6D6] border border-[#D3B995] rounded-lg shadow-lg">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <h1 className="text-[#C8A97E] font-['Playfair_Display',serif] text-4xl tracking-wide">Sonata</h1>
              <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#C8A97E] to-transparent"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center tracking-wide">Register</h2>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#6D4C41] mb-1.5">Full name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full border border-[#D3B995] bg-[#F8F0E3] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C8A97E] text-[#3A2A24] placeholder-[#8D6C61]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6D4C41] mb-1.5">Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                className="w-full border border-[#D3B995] bg-[#F8F0E3] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C8A97E] text-[#3A2A24] placeholder-[#8D6C61]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6D4C41] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="w-full border border-[#D3B995] bg-[#F8F0E3] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C8A97E] text-[#3A2A24] placeholder-[#8D6C61]"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6D4C41] hover:text-[#3A2A24] transition-colors"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6D4C41] mb-1.5">Retype password</label>
              <div className="relative">
                <input
                  type={showRetypePassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full border border-[#D3B995] bg-[#F8F0E3] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C8A97E] text-[#3A2A24] placeholder-[#8D6C61]"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6D4C41] hover:text-[#3A2A24] transition-colors"
                  onClick={() => setShowRetypePassword((prev) => !prev)}
                >
                  {showRetypePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#C8A97E] hover:bg-[#A67C52] text-white py-3 rounded-md font-semibold transition-colors shadow-md mt-2"
            >
              REGISTER
            </button>
          </form>
          <p className="mt-6 text-sm text-center text-[#6D4C41]">
            Already have an account?
            <a href="/user-login" className="text-[#A67C52] hover:text-[#C8A97E] font-medium ml-1 transition-colors">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
