"use client";

import React, { useState } from "react";
import {
  FolderPlus,
  UserIcon,
  Music,
  FileText,
  GalleryVertical,
  Plus,
  X,
} from "lucide-react";
import * as Types from "../../../types/Types";
import SearchModal from "@/components/SearchModal";
import axios from "axios";
import FileUploadSection from "../../components/upload-file"; // Adjust path as needed
import { ADMIN_TOKEN } from "@/constant/adminToken";

const AddSongsPage = () => {
  const [description, setDescription] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [albumType, setAlbumType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<Types.Genre[]>([]);
  const [selectedMusic, setSelectedMusics] = useState<Types.Music[]>([]);
  const [releaseDate, setReleaseDate] = useState("");
  const [isValidDate, setIsValidDate] = useState(true);

  const [coverArtUrl, setCoverArtUrl] = useState("");

  const handleShowModal = (field: string) => {
    setShowModal(true);
    setCurrentField(field);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentField("");
  };

  const handleUploadError = (error: string) => {
    console.error("Upload failed:", error);
    alert(`Upload failed: ${error}`);
  };

  type SelectableItem = Types.Genre | Types.Music;

  // get selected Items
  const handleSelectedItems = (
    field: string,
    selectedItems: SelectableItem[]
  ) => {
    switch (field) {
      case "genre":
        setSelectedGenres(selectedItems as Types.Genre[]);
        break;
      case "music":
        setSelectedMusics(selectedItems as Types.Music[]);
        break;
      default:
        console.log("Unknown field:", field);
    }
  };

  // get the Item when Modal gave back
  const getExistingItems = (fieldType: string): SelectableItem[] => {
    switch (fieldType) {
      case "periods":
        return selectedGenres;
      case "music":
        return selectedMusic;
      default:
        return [];
    }
  };

  const handleAdd = async () => {
    const musicIds = selectedMusic.map((music) => music.id);
    const genreIds = selectedGenres.map((genre) => genre.id);

    const albumData = {
      name: albumName,
      coverPhoto: coverArtUrl,
      releaseDate,
      albumType,
      description,
      genreIds,
      musicIds,
    };

    try {
      const response = await axios.post(
        "https://api.sonata.io.vn/api/v1/album",
        albumData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN)}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert(`Song ${albumName} added successfully!`);
        handleClear();
      } else {
        alert(`Error: ${response.data.message || "Failed to add artist"})`);
      }
    } catch (err) {
      console.error("Error adding artist:", err);
    }
  };

  const handleClear = () => {
    setDescription("");
    setAlbumName("");
    setSelectedGenres([]);
    setCoverArtUrl("");
    setAlbumType("");
    setReleaseDate("");
    setSelectedMusics([]);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Album Management
          </h1>
          <p className="text-gray-600">
            Add and organize your music collection
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm border">
          <a href="../admin-add-song" className="bg-white hover:bg-gray-50 text-gray-600 px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-all">
            <Music className="w-4 h-4" />
            Add Songs
          </a>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-sm text-sm font-medium transition-all hover:bg-blue-600">
            <FolderPlus className="w-4 h-4" />
            Add Albums
          </button>
          <a href="../admin-view-all" className="bg-white hover:bg-gray-50 text-gray-600 px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-all">
            <UserIcon className="w-4 h-4" />
            View All
          </a>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-blue-600" />
                </div>
                <div className=" flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Basic Information
                  </h2>
                  <h3 className="text-black">
                    All fields marked with * must be filled in..
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Album Name *
                  </label>
                  <input
                    type="text"
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                    className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter album name"
                  />
                </div>

              {/* set Release Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Release Date *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={releaseDate}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Album Type *
                  </label>
                  <input
                    type="text"
                    value={albumType}
                    onChange={(e) => setAlbumType(e.target.value)}
                    className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter album name"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 text-black py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Describe your song..."
                />
              </div>
            </div>

            {/* Categories & Tags Card */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Categories & Tags
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Genre
                  </label>
                  <div className="relative">
                    <div className="min-h-[60px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-3 hover:border-blue-400 transition-colors">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedGenres.map((genre) => (
                          <span
                            key={genre.id}
                            className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {genre.name}
                            <X className="w-3 h-3 cursor-pointer hover:text-blue-600" />
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleShowModal("genre")}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Genre
                      </button>
                    </div>
                  </div>
                </div>

                {/* Song */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Songs
                  </label>
                  <div className="relative">
                    <div className="min-h-[60px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-3 hover:border-blue-400 transition-colors">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedMusic.map((music) => (
                          <span
                            key={music.id}
                            className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {music.name}
                            <X className="w-3 h-3 cursor-pointer hover:text-green-600" />
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleShowModal("music")}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Songs
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* File Upload Card */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <GalleryVertical className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Media Files
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FileUploadSection
                  title="Upload Cover Art *"
                  acceptedFormats="JPG, PNG files, max 10MB each"
                  acceptTypes="image/*,.jpg,.jpeg,.png"
                  fileType="cover"
                  uploadedUrl={coverArtUrl}
                  onUploadSuccess={(mediaUrl) => setCoverArtUrl(mediaUrl)}
                  onUploadError={handleUploadError}
                />
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Actions
              </h3>

              {/* Quick Stats */}
              <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Genres:</span>
                  <span className="font-medium text-black">
                    {selectedGenres.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Albums:</span>
                  <span className="font-medium text-black">
                    {selectedMusic.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cover Art:</span>
                  <span className="font-medium text-black">
                    {coverArtUrl ? "Uploaded" : "Not uploaded"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAdd}
                  disabled={!albumName}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                >
                  Add Album
                </button>

                <button
                  onClick={handleClear}
                  className="w-full py-3 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  Clear Form
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Fill in the song name and description to
                  get started. You can add genres and albums to better organize
                  your music.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <SearchModal
          onClose={handleCloseModal}
          fieldType={currentField}
          onSelect={(selectedItems) =>
            handleSelectedItems(currentField, selectedItems as SelectableItem[])
          }
          existingItems={getExistingItems(currentField)}
        />
      )}
    </div>
  );
};

export default AddSongsPage;
