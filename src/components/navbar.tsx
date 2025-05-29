'use client';

// import React, { useState } from "react";
import Link from "next/link";
import { Gift } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";

const ClassicalNavbar = () => {
  // const { logout } = useAuth();
  // const router = useRouter();
  // const [showUserMenu, setShowUserMenu] = useState(false);

  // const handleLogout = () => {
  //   logout();
  //   router.push('/user-login');
  // };

  // Tạo avatar từ fullname
  // const getInitials = (name: string) => {
  //   if (!name) return 'U';
  //   return name
  //     .split(' ')
  //     .map(part => part[0])
  //     .join('')
  //     .toUpperCase()
  //     .substring(0, 2);
  // };

  return (
    <aside className="w-48 h-screen pb-24 bg-gradient-to-b from-[#3A2A24] to-[#1A0F0D] flex flex-col justify-between border-r border-[#D3B995] shadow-lg">
      {/* TOP: Logo and Navigation */}
      <div>
        <div className="flex justify-center p-6">
          <div className="relative">
            <h1 className="text-[#C8A97E] font-['Playfair_Display',serif] text-3xl tracking-wide">Sonata</h1>
            <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#C8A97E] to-transparent"></div>
          </div>
        </div>
        <nav className="flex-1 pt-4">
          <ul className="space-y-1 px-2">
            <li className="overflow-hidden rounded-md">
              <Link 
                href="/" 
                className="flex items-center gap-4 text-[#C8A97E] w-full p-3 transition-all duration-300 hover:bg-[#48352F] rounded-md group"
              >
                <div className="w-6 h-6 flex items-center justify-center text-[#C8A97E] group-hover:text-[#F8F0E3]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="font-['Playfair_Display',serif] group-hover:text-[#F8F0E3]">Home</span>
              </Link>
            </li>
            <li className="overflow-hidden rounded-md">
              <Link 
                href="/user-categories" 
                className="flex items-center gap-4 text-[#C8A97E] w-full p-3 transition-all duration-300 hover:bg-[#48352F] rounded-md group"
              >
                <div className="w-6 h-6 flex items-center justify-center text-[#C8A97E] group-hover:text-[#F8F0E3]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="font-['Playfair_Display',serif] group-hover:text-[#F8F0E3]">Explore</span>
              </Link>
            </li>
            
            <li className="overflow-hidden rounded-md">
              <Link 
                href="/my-favorites" 
                className="flex items-center gap-4 text-[#C8A97E] w-full p-3 transition-all duration-300 hover:bg-[#48352F] rounded-md group"
              >
                <div className="w-6 h-6 flex items-center justify-center text-[#C8A97E] group-hover:text-[#F8F0E3]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="font-['Playfair_Display',serif] group-hover:text-[#F8F0E3]">My Favorite</span>
              </Link>
            </li>

            <li className="overflow-hidden rounded-md">
              <Link 
                href="/user-exchange-premium" 
                className="flex items-center gap-4 text-[#C8A97E] w-full p-3 transition-all duration-300 hover:bg-[#48352F] rounded-md group"
              >
                <div className="w-6 h-6 flex items-center justify-center text-[#C8A97E] group-hover:text-[#F8F0E3]">
                  <Gift />
                </div>
                <span className="font-['Playfair_Display',serif] group-hover:text-[#F8F0E3]">Exchange Premium</span>
              </Link>
            </li>

          </ul>
        </nav>
      </div>

      {/* BOTTOM: Footer Links with elegant styling */}
      <div className="p-4 border-t border-[#48352F]">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <a href="#" className="text-[#AB8876] hover:text-[#C8A97E] text-xs font-['Playfair_Display',serif]">Legal</a>
          <a href="#" className="text-[#AB8876] hover:text-[#C8A97E] text-xs font-['Playfair_Display',serif]">Privacy Center</a>
          <a href="#" className="text-[#AB8876] hover:text-[#C8A97E] text-xs font-['Playfair_Display',serif]">Privacy Policy</a>
          <a href="#" className="text-[#AB8876] hover:text-[#C8A97E] text-xs font-['Playfair_Display',serif]">Cookies</a>
        </div>
        
        {/* About Ads toggle switch - classical style */}
        <div className="flex items-center gap-3 my-3 px-1">
          <span className="text-[#AB8876] text-xs font-['Playfair_Display',serif]">About Ads</span>
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" />
            <div className="relative w-9 h-5 bg-[#48352F] rounded-full peer-focus:ring-2 peer-focus:ring-[#C8A97E] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#F8F0E3] after:border-[#C8A97E] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6D4C41]"></div>
          </label>
        </div>
        
        {/* Language selector with parchment style */}
        <div className="mt-4">
          <button className="border border-[#48352F] rounded-full py-1.5 px-3 text-sm text-[#C8A97E] flex items-center hover:bg-[#48352F] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span className="font-['Playfair_Display',serif]">English</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ClassicalNavbar;