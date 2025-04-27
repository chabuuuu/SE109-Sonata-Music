import React from "react";

const Navbar = () => {
  return (
    // pb-24 để chừa khoảng cho BottomBanner cao hơn, nhích footer lên
    <aside className="w-48 h-screen pb-24 bg-gradient-to-b from-[#39639D] to-black flex flex-col justify-between">
      {/* TOP: Logo and Navigation */}
      <div>
        <div className="flex justify-center p-4">
          <img src="/sonata-logo.png" alt="logo of the website" />
        </div>
        <nav className="flex-1 pt-2">
          <ul>
            <li className="px-4 py-3 flex items-center gap-4 text-white font-bold hover:bg-slate-500 rounded-sm">
              <img src="/layout_imgs/Home_logo.png" alt="home logo" className="w-5 h-5" />
              <span className="text-base">Home</span>
            </li>
            <li className="px-4 py-3 flex items-center gap-4 text-gray-300 hover:bg-slate-500 rounded-sm">
              <img src="/layout_imgs/search_logo.png" alt="search logo" className="w-5 h-5" />
              <span className="text-base">Search</span>
            </li>
            <li className="px-4 py-3 flex items-center gap-4 text-gray-300 hover:bg-slate-500 rounded-sm">
              <img src="/layout_imgs/library_logo.png" alt="Library logo" className="w-5 h-5" />
              <span className="text-base">Your Library</span>
            </li>
            <li className="px-4 py-3 mt-8 flex items-center gap-4 text-gray-300 hover:bg-slate-500 rounded-sm">
              <img
                src="/layout_imgs/createPlaylist_logo.png"
                alt="create playlist logo"
                className="w-5 h-5"
              />
              <span className="text-base">Create Playlist</span>
            </li>
            <li className="px-4 py-3 flex items-center gap-4 text-gray-300 hover:bg-slate-500 rounded-sm">
              <img
                src="/layout_imgs/likeSong_logo.png"
                alt="liked songs logo"
                className="w-5 h-5"
              />
              <span className="text-base">Liked Songs</span>
            </li>
          </ul>
        </nav>
      </div>
      {/* BOTTOM: Footer Links with separator */}
      <div className="p-4 text-xs border-t border-gray-700">
        <div className="grid grid-cols-2 gap-2">
          <a href="#" className="text-gray-400 hover:text-white">Legal</a>
          <a href="#" className="text-gray-400 hover:text-white">Privacy Center</a>
          <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
          <a href="#" className="text-gray-400 hover:text-white">Cookies</a>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-gray-400">About Ads</span>
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" />
            <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="mt-4">
          <button className="border border-gray-700 rounded-full py-1 px-3 text-sm text-gray-300 flex items-center hover:bg-slate-700">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            English
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Navbar;
