"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { register, RegisterRequest, activateEmail } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [formValues, setFormValues] = useState<RegisterRequest & { retypePassword: string }>({
    email: '',
    username: '',
    password: '',
    retypePassword: '',
    fullname: '',
    gender: 'MALE'
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    // Clear error when user types
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Form validation
    if (!formValues.email || !formValues.username || !formValues.password || !formValues.fullname) {
      setError('Please fill in all required fields');
      return;
    }

    if (formValues.password !== formValues.retypePassword) {
      setError('Passwords do not match');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formValues.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password validation (at least 8 characters, containing number and special char)
    if (formValues.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(formValues.password)) {
      setError('Password must contain at least one number and one special character');
      return;
    }

    try {
      setIsLoading(true);
      const requestData: RegisterRequest = {
        email: formValues.email,
        username: formValues.username,
        password: formValues.password,
        fullname: formValues.fullname,
        gender: formValues.gender as 'MALE' | 'FEMALE'
      };

      const response = await register(requestData);
      console.log('Registration successful:', response);
      
      // Show success message
      setSuccessMessage(response.message);
      
      // Save email for OTP verification
      setRegisteredEmail(formValues.email);
      
      // Show OTP form
      setShowOtpForm(true);
      
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!otp) {
      setError('Please enter the OTP sent to your email');
      return;
    }
    
    try {
      setIsActivating(true);
      
      const response = await activateEmail(otp, registeredEmail);
      console.log('Account activation successful:', response);
      
      // Update success message
      setSuccessMessage(response.message);
      
      // Hide OTP form and show success message
      setShowOtpForm(false);
      
      // Redirect to login page after a delay
      setTimeout(() => {
        router.push('/user-login');
      }, 3000);
      
    } catch (err: any) {
      console.error('Activation error:', err);
      setError(err.message || 'Account activation failed, please try again');
    } finally {
      setIsActivating(false);
    }
  };

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
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {successMessage && !showOtpForm && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md text-sm">
              {successMessage}
              <p className="mt-1 font-medium">Redirecting to login page...</p>
            </div>
          )}
          
          {showOtpForm ? (
            // OTP verification form
            <>
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-md text-sm">
                {successMessage || 'An OTP has been sent to your email. Please enter it to activate your account.'}
              </div>
              
              <form className="space-y-5" onSubmit={handleOtpSubmit}>
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-[#6D4C41] mb-1.5">
                    OTP Code
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder="Enter the OTP sent to your email"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border border-[#D3B995] bg-[#F8F0E3] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C8A97E] text-[#3A2A24] placeholder-[#8D6C61]"
                    disabled={isActivating}
                  />
                </div>
                
                <button
                  type="submit"
                  className={`w-full bg-[#C8A97E] hover:bg-[#A67C52] text-white py-3 rounded-md font-semibold transition-colors shadow-md mt-2 ${
                    isActivating ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={isActivating}
                >
                  {isActivating ? 'ACTIVATING...' : 'ACTIVATE ACCOUNT'}
                </button>
              </form>
              
              <p className="mt-5 text-sm text-center text-[#6D4C41]">
                Didn't receive the OTP?{' '}
                <button 
                  className="text-[#A67C52] hover:text-[#C8A97E] font-medium transition-colors"
                  onClick={() => {
                    // Implement resend OTP functionality if available
                    setError('OTP resend functionality is not available yet. Please check your email inbox or try registering again.');
                  }}
                >
                  Resend
                </button>
              </p>
            </>
          ) : (
            // Registration form
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-[#6D4C41] mb-1.5">Full name</label>
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  placeholder="Enter your full name"
                  value={formValues.fullname}
                  onChange={handleInputChange}
                  className="w-full border border-[#D3B995] bg-[#F8F0E3] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C8A97E] text-[#3A2A24] placeholder-[#8D6C61]"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#6D4C41] mb-1.5">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formValues.email}
                  onChange={handleInputChange}
                  className="w-full border border-[#D3B995] bg-[#F8F0E3] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C8A97E] text-[#3A2A24] placeholder-[#8D6C61]"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-[#6D4C41] mb-1.5">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formValues.username}
                  onChange={handleInputChange}
                  className="w-full border border-[#D3B995] bg-[#F8F0E3] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C8A97E] text-[#3A2A24] placeholder-[#8D6C61]"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#6D4C41] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formValues.password}
                    onChange={handleInputChange}
                    className="w-full border border-[#D3B995] bg-[#F8F0E3] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C8A97E] text-[#3A2A24] placeholder-[#8D6C61]"
                    disabled={isLoading}
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
                <label htmlFor="retypePassword" className="block text-sm font-medium text-[#6D4C41] mb-1.5">Retype password</label>
                <div className="relative">
                  <input
                    id="retypePassword"
                    name="retypePassword"
                    type={showRetypePassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formValues.retypePassword}
                    onChange={handleInputChange}
                    className="w-full border border-[#D3B995] bg-[#F8F0E3] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C8A97E] text-[#3A2A24] placeholder-[#8D6C61]"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6D4C41] hover:text-[#3A2A24] transition-colors"
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
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-[#6D4C41] mb-1.5">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formValues.gender}
                  onChange={handleInputChange}
                  className="w-full border border-[#D3B995] bg-[#F8F0E3] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C8A97E] text-[#3A2A24]"
                  disabled={isLoading}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
              <button
                type="submit"
                className={`w-full bg-[#C8A97E] hover:bg-[#A67C52] text-white py-3 rounded-md font-semibold transition-colors shadow-md mt-2 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'REGISTERING...' : 'REGISTER'}
              </button>
            </form>
          )}
          
          {!showOtpForm && (
            <p className="mt-6 text-sm text-center text-[#6D4C41]">
              Already have an account?
              <a href="/user-login" className="text-[#A67C52] hover:text-[#C8A97E] font-medium ml-1 transition-colors">
                Login
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
