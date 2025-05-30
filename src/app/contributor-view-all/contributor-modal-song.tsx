"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import ContributorFileUploadSection from "./upload-file-contributor";
import * as Types from "./api-type";
import axios from "axios";
import { CONTRIBUTOR_TOKEN } from "@/constant/contributorToken";
import SearchModal from "@/components/SearchModal-Contributor";

interface SearchModalProps {
  onClose: () => void;
  musicId: number;
}

const ContributorViewSongsModal = ({ onClose, musicId }: SearchModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [description, setDescription] = useState("");
  const [songName, setSongName] = useState("");
  const [lyric, setLyric] = useState("");
  const [selectedPeriods, setSelectedPeriods] = useState<Types.Period[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<
    Types.Instrument[]
  >([]);
  const [selectedGenres, setSelectedGenres] = useState<Types.Genre[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<
    Types.Category[]
  >([]);
  const [selectedArtists, setSelectedArtists] = useState<Types.Artist[]>([]);
  const [selectedAlbums, setSelectedAlbums] = useState<Types.Album[]>([]);
  const [musicFileUrl, setMusicFileUrl] = useState("");
  const [coverArtUrl, setCoverArtUrl] = useState("");
  const [quizzesData, setQuizzesData] = useState({
    content: "",
    answerA: "",
    answerB: "",
    answerC: "",
    answerD: "",
    correctAnswer: "A",
  });

  const handleQuizChange = (field: string, value: string) => {
    setQuizzesData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUploadError = (error: string) => {
    console.error("Upload failed:", error);
    alert(`Upload failed: ${error}`);
  };

  const handleClear = () => {
    setDescription("");
    setSongName("");
    setLyric("");
    setSelectedPeriods([]);
    setSelectedInstruments([]);
    setSelectedGenres([]);
    setSelectedCategories([]);
    setSelectedArtists([]);
    setSelectedAlbums([]);
    setMusicFileUrl("");
    setCoverArtUrl("");
    setQuizzesData({
      content: "",
      answerA: "",
      answerB: "",
      answerC: "",
      answerD: "",
      correctAnswer: "A",
    });
  };

  type SelectableItem =
    | Types.Genre
    | Types.Period
    | Types.Instrument
    | Types.Artist
    | Types.Album;

  const handleResponseGetData = (ResponseData: Types.MusicData) => {
    setDescription(ResponseData.description || "");
    setSongName(ResponseData.name || "");
    setLyric(ResponseData.lyric || "");
    setSelectedPeriods(ResponseData.periods || []);
    setSelectedInstruments(ResponseData.instruments || []);
    setSelectedGenres(ResponseData.genres || []);
    setSelectedCategories(ResponseData.categories || []);
    setSelectedArtists(ResponseData.artists || []);
    setSelectedAlbums(ResponseData.albums || []);
    // Fix: Corrected the mapping based on variable names
    setMusicFileUrl(ResponseData.resourceLink || ""); // Music file URL
    setCoverArtUrl(ResponseData.coverPhoto || ""); // Cover art URL

    // Fix: Added safety checks for quiz data
    const quiz = ResponseData.quizzes?.[0];
    setQuizzesData({
      content: quiz?.content || "",
      answerA: quiz?.answerA || "",
      answerB: quiz?.answerB || "",
      answerC: quiz?.answerC || "",
      answerD: quiz?.answerD || "",
      correctAnswer: "A",
    });
  };



  const fetchData = React.useCallback(async () => {
    if (!musicId) return;

    try {
      const response = await axios.get(
        `https://api.sonata.io.vn/api/v1/music/${musicId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(CONTRIBUTOR_TOKEN)}`,
          },
        }
      );
      console.log(response.data);
      handleResponseGetData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch music data:", error);
      alert("Failed to load music data. Please try again.");
    }
  }, [musicId]); // only remakes when musicId changes

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentField("");
  };

  // get selected Items
  const handleSelectedItems = (
    field: string,
    selectedItems: SelectableItem[]
  ) => {
    switch (field) {
      case "periods":
        setSelectedPeriods(selectedItems as Types.Period[]);
        break;
      case "instruments":
        setSelectedInstruments(selectedItems as Types.Instrument[]);
        break;
      case "genre":
        setSelectedGenres(selectedItems as Types.Genre[]);
        break;
      case "category":
        setSelectedCategories(selectedItems as Types.Category[]);
        break;
      case "artist":
      case "composer":
        setSelectedArtists(selectedItems as Types.Artist[]);
        break;
      case "album":
        setSelectedAlbums(selectedItems as Types.Album[]);
        break;
      default:
        console.log("Unknown field:", field);
    }
  };

  const getExistingItems = (fieldType: string): SelectableItem[] => {
    switch (fieldType) {
      case "periods":
        return selectedPeriods;
      case "instruments":
        return selectedInstruments;
      case "genre":
        return selectedGenres;
      case "category":
        return selectedCategories;
      case "artist":
      case "composer":
        return selectedArtists;
      case "album":
        return selectedAlbums;
      default:
        return [];
    }
  };

  const handleShowModal = (field: string) => {
    setShowModal(true);
    setCurrentField(field);
  };

  // call update
  const handleAdd = async () => {
    const albumIds = selectedAlbums.map((album) => album.id);
    const genreIds = selectedGenres.map((genre) => genre.id);
    const instrumentIds = selectedInstruments.map(
      (instrument) => instrument.id
    );
    const periodIds = selectedPeriods.map((period) => period.id);
    const categoryIds = selectedCategories.map((category) => category.id);
    const artistIds = selectedArtists.map((artist) => artist.id);
    const composerIds = artistIds;

    const songData = {
      name: songName,
      description,
      lyric,
      coverPhoto: coverArtUrl,
      resourceLink: musicFileUrl,
      albumIds,
      quizzes: [quizzesData],
      genreIds,
      instrumentIds,
      periodIds,
      categoryIds,
      artistIds,
      composerIds,
    };

    try {
      const response = await axios.put(
        `https://api.sonata.io.vn/api/v1/music/${musicId}`,
        songData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(CONTRIBUTOR_TOKEN)}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert(`Song ${songName} updated successfully!`);
        handleClear();
      } else {
        alert(`Error: ${response.data.message || "Failed to add artist"})`);
      }
    } catch (err) {
      console.error("Error adding artist:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div></div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Main sections */}
          <div className="flex justify-between gap-5">
            <div className="flex-1">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Filter</h2>
              <div className="grid grid-cols-4 gap-12 mb-8">
                {/* Category Name */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-800 mb-3">
                      Category Name
                    </h3>
                    <div className="relative min-h-12 bg-gray-100 rounded-xl">
                      <div className="flex flex-wrap gap-2 p-2">
                        {selectedCategories.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleShowModal("category")}
                        className="absolute top-7 bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300"
                      >
                        <span className="text-lg leading-none">+</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Artists Name */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-800 mb-3">
                      Artists Name
                    </h3>
                    <div className="relative min-h-12 bg-gray-100 rounded-xl">
                      <div className="flex flex-wrap gap-2 p-2">
                        {selectedArtists.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleShowModal("artist")}
                        className="absolute top-7 bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300"
                      >
                        <span className="text-lg leading-none">+</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Composer */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-800 mb-3">
                      Composer
                    </h3>
                    <div className="relative min-h-12 bg-gray-100 rounded-xl">
                      <div className="flex flex-wrap gap-2 p-2">
                        {selectedArtists.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleShowModal("composer")}
                        className="absolute top-7 bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300"
                      >
                        <span className="text-lg leading-none">+</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Song Name */}
                <div className="text-black">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-sm font-medium text-gray-800">
                        Song name
                      </h3>
                    </div>
                    <textarea
                      value={songName}
                      onChange={(e) => setSongName(e.target.value)}
                      className="w-full h-20 p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* Genre */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-800 mb-3">
                      Genre
                    </h3>
                    <div className="relative min-h-12 bg-gray-100 rounded-xl">
                      <div className="flex flex-wrap gap-2 p-2">
                        {selectedGenres.map((genre, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleShowModal("genre")}
                        className="absolute top-7 bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300"
                      >
                        <span className="text-lg leading-none">+</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Musical Period */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-800 mb-3">
                      Musical Period
                    </h3>
                    <div className="relative min-h-12 bg-gray-100 rounded-xl">
                      <div className="flex flex-wrap gap-2 p-2">
                        {selectedPeriods.map((period, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            {period.name}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleShowModal("periods")}
                        className="absolute top-7 bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300"
                      >
                        <span className="text-lg leading-none">+</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instrument Played */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-800 mb-3">
                      Instrument
                    </h3>
                    <div className="relative min-h-12 bg-gray-100 rounded-xl">
                      <div className="flex flex-wrap gap-2 p-2">
                        {selectedInstruments.map((instrument, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            {instrument.name}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleShowModal("instruments")}
                        className="absolute top-7 bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300"
                      >
                        <span className="text-lg leading-none">+</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Albums */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-800 mb-3">
                      Album
                    </h3>
                    <div className="relative min-h-12 bg-gray-100 rounded-xl">
                      <div className="flex flex-wrap gap-2 p-2">
                        {selectedAlbums.map((album, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            {album.name}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleShowModal("album")}
                        className="absolute top-7 bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300"
                      >
                        <span className="text-lg leading-none">+</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="col-span-2 text-black">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-sm font-medium text-gray-800">
                        Description
                      </h3>
                    </div>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full h-20 p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* Lyric */}
                <div className="col-span-2 text-black">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-sm font-medium text-gray-800">
                        Lyric
                      </h3>
                    </div>
                    <textarea
                      value={lyric}
                      onChange={(e) => setLyric(e.target.value)}
                      className="w-full h-20 p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              {/* File Upload Sections */}
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <ContributorFileUploadSection
                    title="Upload Music File"
                    acceptedFormats="Accepted formats: MP3, WAV, FLAC"
                    acceptTypes=".mp3,.wav,.flac"
                    fileType="music"
                    uploadedUrl={musicFileUrl}
                    onUploadSuccess={(mediaUrl) => setMusicFileUrl(mediaUrl)}
                    onUploadError={handleUploadError}
                  />
                </div>
                <div>
                  <ContributorFileUploadSection
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
            </div>

            {/* Quiz Section */}
            <div className="flex flex-col items-end gap-4 justify-between mt-15">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  Quiz Questions
                </h3>
                <div className="space-y-4 w-80 text-black">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Question
                    </label>
                    <input
                      name="content"
                      value={quizzesData.content}
                      onChange={(e) =>
                        handleQuizChange("content", e.target.value)
                      }
                      placeholder="Enter your question"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Answer A
                      </label>
                      <input
                        name="answerA"
                        value={quizzesData.answerA}
                        onChange={(e) =>
                          handleQuizChange("answerA", e.target.value)
                        }
                        placeholder="Option A"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Answer B
                      </label>
                      <input
                        name="answerB"
                        value={quizzesData.answerB}
                        onChange={(e) =>
                          handleQuizChange("answerB", e.target.value)
                        }
                        placeholder="Option B"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Answer C
                      </label>
                      <input
                        name="answerC"
                        value={quizzesData.answerC}
                        onChange={(e) =>
                          handleQuizChange("answerC", e.target.value)
                        }
                        placeholder="Option C"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Answer D
                      </label>
                      <input
                        name="answerD"
                        value={quizzesData.answerD}
                        onChange={(e) =>
                          handleQuizChange("answerD", e.target.value)
                        }
                        placeholder="Option D"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Correct Answer
                    </label>
                    <select
                      name="correctAnswer"
                      value={quizzesData.correctAnswer}
                      onChange={(e) =>
                        handleQuizChange("correctAnswer", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                      <option value="A">Answer A</option>
                      <option value="B">Answer B</option>
                      <option value="C">Answer C</option>
                      <option value="D">Answer D</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-5">
                <button
                  onClick={handleClear}
                  className="px-6 w-40 h-10 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors bg-white"
                >
                  Clear
                </button>
                <button
                  onClick={handleAdd}
                  className="px-6 w-40 h-10 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal ? (
        <SearchModal
          onClose={handleCloseModal}
          fieldType={currentField}
          onSelect={(selectedItems) =>
            handleSelectedItems(currentField, selectedItems as SelectableItem[])
          }
          existingItems={getExistingItems(currentField)}
        />
      ) : null}
    </div>
  );
};

export default ContributorViewSongsModal;
