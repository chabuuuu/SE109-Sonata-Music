"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { login, LoginRequest } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { setLoggedIn } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formValues, setFormValues] = useState<LoginRequest>({
    usernameOrEmail: '',
    password: ''
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    // Xóa thông báo lỗi khi người dùng nhập lại
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Kiểm tra form trước khi gửi
    if (!formValues.usernameOrEmail || !formValues.password) {
      setError('Please enter your username/email and password');
      return;
    }

    try {
      setIsLoading(true);
      const response = await login(formValues);
      console.log('Login successful:', response);
      
      // Cập nhật trạng thái đăng nhập trong context
      setLoggedIn(true);
      
      // Chuyển hướng đến trang chính sau khi đăng nhập
      router.push('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed, please try again');
    } finally {
      setIsLoading(false);
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

      {/* Right: Login form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md p-8 bg-[#F0E6D6] border border-[#D3B995] rounded-lg shadow-lg">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <h1 className="text-[#C8A97E] font-['Playfair_Display',serif] text-4xl tracking-wide">Sonata</h1>
              <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#C8A97E] to-transparent"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center tracking-wide">Login</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-[#6D4C41] mb-1.5">
                Username or Email
              </label>
              <input
                id="usernameOrEmail"
                name="usernameOrEmail"
                type="text"
                placeholder="Enter username or email"
                value={formValues.usernameOrEmail}
                onChange={handleInputChange}
                className="w-full border border-[#D3B995] bg-[#F8F0E3] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C8A97E] text-[#3A2A24] placeholder-[#8D6C61]"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#6D4C41] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
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
            <div className="flex items-center justify-between text-sm">
              <a href="#" className="text-[#A67C52] font-semibold hover:text-[#C8A97E] transition-colors">
                Forgot your password?
              </a>
              <label className="inline-flex items-center space-x-2">
                <input type="checkbox" className="accent-[#C8A97E] h-4 w-4" />
                <span className="text-[#6D4C41]">Remember me</span>
              </label>
            </div>
            <button
              type="submit"
              className={`w-full bg-[#C8A97E] hover:bg-[#A67C52] text-white py-3 rounded-md font-semibold transition-colors shadow-md ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
            <a href="/contributor/login" className="hover:text-white" > A contributor? Click here.</a>
          </form>
          <div className="mt-8 text-center">
            <p className="text-sm text-[#6D4C41]">Don't have an account?</p>
            <a
              href="/user-register"
              className="inline-block mt-3 px-6 py-2.5 border border-[#D3B995] bg-transparent hover:bg-[#F8F0E3] text-[#3A2A24] rounded-full text-sm font-semibold transition-colors"
            >
              SIGN UP FOR SONATA
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
