"use client";

import React, { useState } from "react";
import {
  Plus,
  Users,
  ChevronDown,
  Download,
  Settings,
  CloudUpload,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import SearchModal from "@/components/SearchModal";

export default function ArtistsManagement() {
  // this is the function for handle the popup
  const [showModal, setShowModal] = useState(false);

  function handleShowModal (){
    setShowModal(!showModal);
  };

  return (
    <AdminLayout>
      <div className="w-full mx-auto p-2 md:p-4 bg-white">
        {/* Top Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-2 m-2 md:m-6">
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <div className="bg-blue-500 text-white p-3 md:p-4 rounded-lg flex flex-col items-center w-12 md:w-24 h-24 hover:bg-blue-700/20 font-semibold">
              <Plus size={20} className="md:size-24" />
              <div className="text-xs mt-1">Add Artist</div>
            </div>

            <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200 flex flex-col items-center shadow-md text-black w-12 md:w-24 h-24 hover:bg-gray-700/20 font-semibold">
              <Users size={20} className="md:size-24 text-gray-500" />
              <div className="text-xs mt-1">All Artists</div>
            </div>
          </div>

          {/* Utility Buttons */}
          <div className="flex md:ml-auto items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
            <button className="border border-gray-500 rounded-md p-2 flex-shrink-0">
              <Settings size={16} className="text-gray-500" />
            </button>

            <div className="border border-gray-500 rounded-md px-2 md:px-3 py-2 flex items-center flex-shrink-0">
              <span className="text-xs md:text-sm mr-1 md:mr-2 text-gray-500">
                Last 7 days
              </span>
              <ChevronDown size={16} className="text-gray-500" />
            </div>

            <button className="border border-gray-500 rounded-md px-2 md:px-3 py-2 flex items-center flex-shrink-0">
              <Download size={16} className="text-gray-500 mr-1 md:mr-2" />
              <span className="text-xs md:text-sm text-gray-500">
                Download as CSV
              </span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row lg:justify-around lg:items-end gap-3 md:gap-5">
          {/* Form Container */}
          <div className="w-full lg:w-5/6">
            <h2 className="font-bold text-black text-xl md:text-2xl mb-3 md:mb-4">
              Filter
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {/* Left Column */}
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-sm text-black mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full p-2 bg-gray-100 rounded-md text-black"
                    placeholder="Andrew Salgado"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 text-black">
                    Date of Birth - Date of Death
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 bg-gray-100 rounded-md text-black"
                    placeholder="01/01/1914 - 01/01/1965"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm mb-1 text-black">
                      Musical Period
                    </label>
                    <div className="bg-gray-100 w-full p-3 md:p-4 rounded-lg relative min-h-12">
                      {/* Container for the tags */}
                      <div className="flex flex-wrap gap-2">
                        {/* Example tags - you can make these dynamic */}
                        <span className="bg-white text-blue-500 border border-blue-500 rounded-full px-3 py-1 text-xs">
                          BAROQUE
                        </span>
                      </div>

                      {/* Plus button positioned in the bottom-left corner */}
                      <button
                        onClick={handleShowModal}
                        className="absolute left-[1px] bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300"
                      >
                        <span className="text-lg leading-none">+</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1 text-black">
                      Role
                    </label>
                    <div className="bg-gray-100 w-full p-3 md:p-4 rounded-lg relative min-h-12">
                      {/* Container for the tags */}
                      <div className="flex flex-wrap gap-2">
                        {/* Example tags - you can make these dynamic */}
                        <span className="bg-white text-blue-500 border border-blue-500 rounded-full px-3 py-1 text-xs">
                          BAROQUE
                        </span>
                      </div>

                      {/* Plus button positioned in the bottom-left corner */}
                      <button onClick={handleShowModal} className="absolute left-[1px] bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300">
                        <span className="text-lg leading-none">+</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1 text-black">
                      Orchestras Collaborated With
                    </label>
                    <div className="bg-gray-100 w-full p-3 md:p-4 rounded-lg relative min-h-12">
                      {/* Container for the tags */}
                      <div className="flex flex-wrap gap-2">
                        {/* Example tags - you can make these dynamic */}
                        <span className="bg-white text-blue-500 border border-blue-500 rounded-full px-3 py-1 text-xs">
                          BAROQUE
                        </span>
                      </div>

                      {/* Plus button positioned in the bottom-left corner */}
                      <button onClick={handleShowModal} className="absolute left-[1px] bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300">
                        <span className="text-lg leading-none">+</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1 text-black">
                      Instrument Played
                    </label>
                    <div className="bg-gray-100 w-full p-3 md:p-4 rounded-lg relative min-h-12">
                      {/* Container for the tags */}
                      <div className="flex flex-wrap gap-2">
                        {/* Example tags - you can make these dynamic */}
                        <span className="bg-white text-blue-500 border border-blue-500 rounded-full px-3 py-1 text-xs">
                          BAROQUE
                        </span>
                      </div>

                      {/* Plus button positioned in the bottom-left corner */}
                      <button onClick={handleShowModal} className="absolute left-[1px] bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300">
                        <span className="text-lg leading-none">+</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1 text-black">
                    Awards & Honors
                  </label>
                  <textarea className="w-full p-2 bg-gray-100 rounded-md h-12 md:h-15 text-black" />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm mb-1 text-black">
                      Genre
                    </label>
                    <div className="bg-gray-100 w-full p-3 md:p-4 rounded-lg relative min-h-12">
                      {/* Container for the tags */}
                      <div className="flex flex-wrap gap-2">
                        {/* Example tags - you can make these dynamic */}
                        <span className="bg-white text-blue-500 border border-blue-500 rounded-full px-3 py-1 text-xs">
                          BAROQUE
                        </span>
                      </div>

                      {/* Plus button positioned in the bottom-left corner */}
                      <button onClick={handleShowModal} className="absolute left-[1px] bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300">
                        <span className="text-lg leading-none">+</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1 text-black">
                      Notable Students
                    </label>
                    <div className="bg-gray-100 w-full p-3 md:p-4 rounded-lg relative min-h-12">
                      {/* Container for the tags */}
                      <div className="flex flex-wrap gap-2">
                        {/* Example tags - you can make these dynamic */}
                        <span className="bg-white text-blue-500 border border-blue-500 rounded-full px-3 py-1 text-xs">
                          BAROQUE
                        </span>
                      </div>

                      {/* Plus button positioned in the bottom-left corner */}
                      <button onClick={handleShowModal} className="absolute left-[1px] bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300">
                        <span className="text-lg leading-none">+</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1 text-black">
                    Nationality
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full p-2 bg-gray-100 rounded-md text-black"
                      placeholder="VietNam"
                    />
                    <ChevronDown
                      size={16}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1 text-black">
                    Teaching & Academic Contributions
                  </label>
                  <textarea className="w-full p-2 bg-gray-100 rounded-md h-12 md:h-16 text-black" />
                </div>

                <div>
                  <label className="block text-sm mb-1 text-black">
                    Significant Performances
                  </label>
                  <textarea className="w-full p-2 bg-gray-100 rounded-md h-12 md:h-16 text-black" />
                </div>
              </div>
            </div>

            {/* File Upload Area */}
            <div className="border border-dashed border-gray-300 rounded-lg p-4 md:p-8 mt-4 flex flex-col items-center justify-center">
              <div className="p-2 mb-2">
                <CloudUpload size={20} className="md:size-24 text-gray-400" />
              </div>
              <p className="text-xs md:text-sm text-gray-500 mb-1">
                Select a file or drag and drop here
              </p>
              <p className="text-xs text-gray-400 mb-2 md:mb-4">
                JPG, PNG or PDF file size no more than 10MB
              </p>
              <button className="border hover:bg-gray-200 border-blue-500 text-blue-500 rounded-md px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm">
                SELECT FILE
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center md:justify-end mt-4 space-x-2 mb-4 lg:mb-0">
            <button className="border border-gray-500 text-black px-4 md:px-6 py-2 h-10 rounded-full hover:bg-gray-200 w-24 md:w-30">
              Clear
            </button>
            <button className="bg-green-500 text-white px-4 md:px-6 py-2 h-10 rounded-full hover:bg-green-400 w-24 md:w-30">
              Add
            </button>
          </div>
        </div>
      </div>
      {showModal ? <SearchModal onClose={() => setShowModal(false)} /> : null}
    </AdminLayout>
  );
}
