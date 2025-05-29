"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import CustomImage from "@/components/CustomImage";
import { CONTRIBUTOR_TOKEN } from "@/constant/contributorToken";

export default function LoginPage() {
  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.sonata.io.vn/api/v1/contributor/login",
        {
          usernameOrEmail: username.trim(),
          password: password,
        }
      );

      const token = response.data.data.accessToken;
      if (token) {
        localStorage.setItem(CONTRIBUTOR_TOKEN, token);

        router.push("/contributor-view-all");
      } else {
        setError("Không nhận được token từ server.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // err.response?.data.message nếu backend có gửi lỗi rõ ràng
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white relative">
      <div className="absolute top-0 left-0 w-full h-4 bg-blue-900" />
      <div className="absolute bottom-0 left-0 w-full h-4 bg-blue-900" />

      <div className="hidden md:block">
        <div className="relative h-full w-full">
          <CustomImage
            src="/violin-sheet.jpeg"
            alt="Violin with sheet music"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <div className="flex justify-center mb-6">
            <CustomImage
              src="/sonata-logo.png"
              alt="Sonata Logo"
              height={80}
              width={150}
              className="object-contain"
            />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl text-black/60 font-bold mb-2 ">
              Contributor Login
            </h1>
            <p className="text-black/60 text-sm">
              Thank you for your hardwork.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                  required
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
              <a
                href="#"
                className="text-blue-700 font-semibold hover:underline"
              >
                Forgot your password?
              </a>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox accent-blue-700"
                />
                <span className="text-gray-700">Remember me</span>
              </label>
            </div>

            <a href="/user-login" className="text-black hover:text-yello-300" > A listener of Sonata? Click here.</a>


            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 rounded font-semibold hover:bg-blue-800"
              disabled={loading}
            >
              {loading ? "Logging in..." : "LOG IN"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-700">Don't have an account?</p>
            <a
              href="/contributor-register"
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
