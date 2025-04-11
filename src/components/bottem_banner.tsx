import React from "react";

const BottomBanner = () => {
  return (
    <div>
      <div className="fixed bottom-0 w-full bg-gradient-to-r from-blue-900 to-blue-600 text-white py-2 px-4 flex justify-between items-center">
        <div>
          <p className="uppercase text-xs font-bold mb-1">PREVIEW OF SPOTIFY</p>
          <p className="text-sm">
            Sign up to get unlimited songs and podcasts with occasional ads. No
            credit card needed.
          </p>
        </div>
        <button className="bg-white text-blue-900 font-medium rounded-full px-4 py-1 hover:bg-slate-300">
          Sign up free
        </button>
      </div>
    </div>
  );
};

export default BottomBanner;
