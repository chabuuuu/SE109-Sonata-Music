"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  register,
  RegisterRequest,
  activateEmail,
} from "@/services/contributorAuthServices";
import { useRouter } from "next/navigation";
import CustomImage from "@/components/CustomImage";

export default function ContributorRegisterPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [formValues, setFormValues] = useState<
    RegisterRequest & { retypePassword: string }
  >({
    email: "",
    username: "",
    password: "",
    retypePassword: "",
    fullname: "",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    // Clear error when user types
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form validation
    if (
      !formValues.email ||
      !formValues.username ||
      !formValues.password ||
      !formValues.fullname
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (formValues.password !== formValues.retypePassword) {
      setError("Passwords do not match");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formValues.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Password validation (at least 8 characters, containing number and special char)
    if (formValues.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])/;
    if (!passwordRegex.test(formValues.password)) {
      setError(
        "Password must contain at least one number, one special character and one uppercase letter"
      );
      return;
    }

    try {
      setIsLoading(true);
      const requestData: RegisterRequest = {
        email: formValues.email,
        username: formValues.username,
        password: formValues.password,
        fullname: formValues.fullname,
      };

      const response = await register(requestData);
      console.log("Registration successful:", response);

      // Show success message
      setSuccessMessage(response.message);

      // Save email for OTP verification
      setRegisteredEmail(formValues.email);

      // Show OTP form
      setShowOtpForm(true);
    } catch (err: unknown) {
      console.error("Registration error:", err);
      setError("Username or email has been taken.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp) {
      setError("Please enter the OTP sent to your email");
      return;
    }

    try {
      setIsActivating(true);

      const response = await activateEmail(otp, registeredEmail);
      console.log("Account activation successful:", response);

      // Update success message
      setSuccessMessage(response.message);

      // Hide OTP form and show success message
      setShowOtpForm(false);

      // Redirect to login page after a delay
      setTimeout(() => {
        router.push("/contributor/login");
      }, 3000);
    } catch (err: unknown) {
      console.error("Activation error:", err);
      setError("Wrong OTP!");
    } finally {
      setIsActivating(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white relative">
      {/* Top and Bottom decorative lines */}
      <div className="absolute top-0 left-0 w-full h-4 bg-blue-900" />
      <div className="absolute bottom-0 left-0 w-full h-4 bg-blue-900" />

      {/* Left: Image */}
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

      {/* Right: Register form */}
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
            <h1 className="text-3xl text-black/60 font-bold mb-2">
              {showOtpForm ? "Verify Account" : "Contributor Register"}
            </h1>
            <p className="text-black/60 text-sm">
              {showOtpForm
                ? "Enter the OTP sent to your email."
                : "Join our community of contributors."}
            </p>
          </div>

          {error && (
            <div>
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            </div>
          )}

          {successMessage && !showOtpForm && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md text-sm text-center">
              {successMessage}
              <p className="mt-1 font-medium">Redirecting to login page...</p>
            </div>
          )}

          {showOtpForm ? (
            // OTP verification form
            <>
              {successMessage && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-md text-sm text-center">
                  {successMessage}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleOtpSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter the OTP sent to your email"
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                    disabled={isActivating}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-900 text-white py-2 rounded font-semibold hover:bg-blue-800"
                  disabled={isActivating}
                >
                  {isActivating ? "ACTIVATING..." : "ACTIVATE ACCOUNT"}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-700">
                  Didn&apos;t receive the OTP?
                </p>
                <button
                  className="inline-block mt-2 px-6 py-2 border border-gray-400 text-gray-800 rounded-full text-sm font-semibold hover:bg-gray-100"
                  onClick={() => {
                    // Implement resend OTP functionality if available
                    setError(
                      "OTP resend functionality is not available yet. Please check your email inbox or try registering again."
                    );
                  }}
                >
                  RESEND OTP
                </button>
              </div>
            </>
          ) : (
            // Registration form
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formValues.fullname}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formValues.username}
                  onChange={handleInputChange}
                  placeholder="Choose a username"
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                  disabled={isLoading}
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
                    name="password"
                    value={formValues.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                    disabled={isLoading}
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

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Retype Password
                </label>
                <div className="relative">
                  <input
                    type={showRetypePassword ? "text" : "password"}
                    name="retypePassword"
                    value={formValues.retypePassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowRetypePassword((prev) => !prev)}
                  >
                    {showRetypePassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-2 rounded font-semibold hover:bg-blue-800"
                disabled={isLoading}
              >
                {isLoading ? "REGISTERING..." : "REGISTER"}
              </button>
            </form>
          )}

          {!showOtpForm && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-700">Already have an account?</p>
              <a
                href="/contributor/login"
                className="inline-block mt-2 px-6 py-2 border border-gray-400 text-gray-800 rounded-full text-sm font-semibold hover:bg-gray-100"
              >
                LOGIN TO SONATA
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
