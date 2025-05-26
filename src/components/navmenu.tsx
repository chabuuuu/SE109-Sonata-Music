import React from "react";
import Button from "./button";

const NavMenu = () => {
  return (
    <div className="bg-[#163259] p-4 flex items-center justify-between">
      {/* Navigation Controls */}
      <div className="flex space-x-4 ">
        <button className="bg-black bg-opacity-60 rounded-full p-2 hover:bg-stone-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <button className="bg-black bg-opacity-60 rounded-full p-2 hover:bg-stone-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10.59 7.41L12 6l6 6-6 6-1.41-1.41L15.17 12z" />
          </svg>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative flex-grow max-w-xl mx-4">
        <input
          type="text"
          placeholder="Bạn muốn nghe gì?"
          className="w-full bg-white text-gray-900 rounded-full py-2 px-10"
        />
        <svg
          className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Auth Buttons */}
      <div className="flex space-x-2">
        <a>
          <Button data="Đăng xuất" />
        </a>
      </div>
    </div>
  );
};

export default NavMenu;
