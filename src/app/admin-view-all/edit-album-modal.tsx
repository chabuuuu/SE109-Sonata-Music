"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import FileUploadSection from "@/components/upload-file";
import * as AlbumType from "./album-api-type";
import axios from "axios";
import { ADMIN_TOKEN } from "@/constant/adminToken";
import CustomImage from "@/components/CustomImage";

interface SearchModalProps {
  onClose: () => void;
  albumId: string;
}

const AddAlbumsModal = ({ onClose, albumId }: SearchModalProps) => {
  const [description, setDescription] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [albumType, setAlbumType] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [coverArtUrl, setCoverArtUrl] = useState("");
  const [isValidDate, setIsValidDate] = useState(true);

  const handleUploadError = (error: string) => {
    console.error("Upload failed:", error);
    alert(`Upload failed: ${error}`);
  };

  const handleClear = () => {
    setDescription("");
    setAlbumName("");
    setAlbumType("");
    setReleaseDate("");
    setCoverArtUrl("");
  };

  const handleResponseGetData = (ResponseData: AlbumType.Album) => {
    setDescription(ResponseData.description || "");
    setAlbumName(ResponseData.name || "");
    setAlbumType(ResponseData.albumType || "");
    setReleaseDate(ResponseData.createAt || "");
    setCoverArtUrl(ResponseData.coverPhoto || "");
  };

  const fetchData = React.useCallback(async () => {
    if (!albumId) return;

    try {
      const response = await axios.get(
        `https://api.sonata.io.vn/api/v1/album/${albumId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN)}`,
          },
        }
      );
      console.log(response.data);
      handleResponseGetData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch music data:", error);
      alert("Failed to load music data. Please try again.");
    }
  }, [albumId]); // only remakes when albumId changes

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // call update
  const handleAdd = async () => {
    const albumData = {
      name: albumName,
      description,
      coverPhoto: coverArtUrl,
      releaseDate,
      albumType,
    };

    try {
      const response = await axios.put(
        `https://api.sonata.io.vn/api/v1/album/${albumId}`,
        albumData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN)}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert(`Song ${albumName} updated successfully!`);
        handleClear();
      } else {
        alert(`Error: ${response.data.message || "Failed to add artist"})`);
      }
    } catch (err) {
      console.error("Error adding artist:", err);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setReleaseDate(input);

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(input)) {
      setIsValidDate(false);
      return;
    }

    const [year, month, day] = input.split("-").map(Number);
    const dateObj = new Date(input);
    const isValid =
      dateObj.getFullYear() === year &&
      dateObj.getMonth() === month - 1 &&
      dateObj.getDate() === day;

    setIsValidDate(isValid);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">🎵</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Album</h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex gap-8">
            {/* Form Section */}
            <div className="flex-1 space-y-8">
              {/* Basic Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">ℹ</span>
                  </span>
                  Album Information
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  {/* Album Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Album Name
                    </label>
                    <input
                      type="text"
                      value={albumName}
                      onChange={(e) => setAlbumName(e.target.value)}
                      className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter album name..."
                    />
                  </div>

                  {/* Album Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Album Type
                    </label>
                    <select
                      value={albumType}
                      onChange={(e) => setAlbumType(e.target.value)}
                      className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
                    >
                      <option value="">Select album type...</option>
                      <option value="SINGLE">Single</option>
                      <option value="EP">EP</option>
                      <option value="ALBUM">Album</option>
                      <option value="COMPILATION">Compilation</option>
                    </select>
                  </div>

                  {/* Release Date */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Release Date
                    </label>
                    <input
                      type="text"
                      value={releaseDate.split("T")[0]}
                      onChange={handleDateChange}
                      placeholder="YYYY-MM-DD"
                      className={`w-full px-4 py-3 text-black border rounded-lg focus:outline-none transition-all ${
                        isValidDate
                          ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          : "border-red-500"
                      }`}
                    />
                    {!isValidDate && (
                      <p className="text-sm text-red-600 mt-1">
                        Please enter a valid date in YYYY-MM-DD format.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✎</span>
                  </span>
                  Description
                </h2>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  placeholder="Tell us about this album..."
                />
              </div>

              {/* Cover Art Upload */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🖼</span>
                  </span>
                  Cover Art
                </h2>
                <FileUploadSection
                  title="Upload Cover Art"
                  acceptedFormats="JPG, PNG files, max 10MB each"
                  acceptTypes="image/*,.jpg,.jpeg,.png"
                  fileType="cover"
                  uploadedUrl={coverArtUrl}
                  onUploadSuccess={(mediaUrl) => setCoverArtUrl(mediaUrl)}
                  onUploadError={handleUploadError}
                />
              </div>
            </div>

            {/* Action Buttons Sidebar */}
            <div className="w-48 flex flex-col gap-4">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={handleClear}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleAdd}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-300 transform hover:scale-105"
                  >
                    Update Album
                  </button>
                </div>
              </div>

              {/* Preview Card */}
              {(albumName || coverArtUrl) && (
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <h4 className="text-sm font-medium text-gray-600 mb-3">
                    Preview
                  </h4>
                  {coverArtUrl && (
                    <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                      <CustomImage
                        src={coverArtUrl}
                        alt="Cover preview"
                        width={200}
                        height={10}
                        className="object-cover"
                      />
                    </div>
                  )}
                  {albumName && (
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {albumName}
                    </p>
                  )}
                  {albumType && (
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {albumType}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAlbumsModal;
