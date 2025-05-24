"use client";

import React, { useState } from "react";
import { SongData } from "../../../types/song";
import * as ArtistType from "../../../types/artist.types";
import SearchModal from "@/components/SearchModal";

const AddSongsPage = () => {
  const [selectedTags, setSelectedTags] = useState<{ [key: string]: string[] }>(
    {
      categoryName: [],
      albumName: [],
      artistsName: [],
      composer: [],
      genre: [],
      musicalPeriod: [],
      instrumentPlayed: [],
    }
  );

  const [releaseDate, setReleaseDate] = useState("");
  const [description, setDescription] = useState("");
  const [songName, setSongName] = useState("");
  const [lyric, setLyric] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [selectedPeriods, setSelectedPeriods] = useState<ArtistType.Period[]>(
    []
  );
  const [selectedOrchestras, setSelectedOrchestras] = useState<
    ArtistType.Orchestra[]
  >([]);
  const [selectedInstruments, setSelectedInstruments] = useState<
    ArtistType.Instrument[]
  >([]);
  const [selectedGenres, setSelectedGenres] = useState<ArtistType.Genre[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<
    ArtistType.Student[]
  >([]);
  // single hook
  const [performances, setPerformances] = useState("");
  const [
    teachingAndAcademicContributions,
    setTeachingAndAcademicContributions,
  ] = useState("");
  const [nationality, setNationality] = useState("");
  const [awardsAndHonors, setAwardsAndHonors] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dateOfDeath, setDateOfDeath] = useState("");
  const [name, setName] = useState("");
  const [quizzesData, setQuizzesData] = useState({
    content: "",
    answerA: "",
    answerB: "",
    answerC: "",
    answerD: "",
    correctAnswer: "A",
  });

  const toggleTag = (category: string, tag: string) => {
    setSelectedTags((prev) => ({
      ...prev,
      [category]: prev[category].includes(tag)
        ? prev[category].filter((t) => t !== tag)
        : [...prev[category], tag],
    }));
  };

  const handleShowModal = (field: string) => {
    setShowModal(true);
    setCurrentField(field);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentField("");
  };

  const renderTagSection = (
    title: string,
    category: string,
    showIcon: boolean = true
  ) => (
    <div className="mb-6 ">
      <h3 className="text-sm font-medium text-gray-800 mb-3">{title}</h3>
      <div className="relative min-h-12 bg-gray-100 rounded-xl">
        <div className="flex flex-wrap gap-2 ">
          {selectedTags[category]?.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs "
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Plus button positioned in the bottom-left corner */}
        {showIcon && (
          <button
            onClick={(value) => {
              /* handleShowModal logic here */
              handleShowModal(category);
            }}
            className="absolute top-7 bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300"
          >
            <span className="text-lg leading-none">+</span>
          </button>
        )}
      </div>
    </div>
  );

  const renderTextArea = (
    title: string,
    value: string,
    onChange: (value: string) => void
  ) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-medium text-gray-800">{title}</h3>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-20 p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        placeholder=""
      />
    </div>
  );

  const renderUploadSection = (title: string, acceptedFormats: string) => (
    <div>
      <h3 className="text-sm font-medium text-gray-800 mb-3">{title}</h3>
      <div className="border-2 border-dashed border-gray-300 rounded p-6 bg-gray-50">
        <div className="flex items-center space-x-2">
          <input
            type="url"
            // value={link}
            // onChange={(e) => setLink(e.target.value)}
            placeholder="Paste link here"
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
          />
        </div>
        <p className="mt-2 text-xs text-gray-400">{acceptedFormats}</p>
      </div>
    </div>
  );

  type RoleItem = { id: number; name: string };
  type SelectableItem =
    | ArtistType.Genre
    | ArtistType.Orchestra
    | ArtistType.Period
    | ArtistType.Instrument
    | ArtistType.Student;

  const handleSelectedItems = (
    field: string,
    selectedItems: SelectableItem[]
  ) => {
    switch (field) {
      case "periods":
        setSelectedPeriods(selectedItems as ArtistType.Period[]);
        break;
      case "orchestras":
        setSelectedOrchestras(selectedItems as ArtistType.Orchestra[]);
        break;
      case "instruments":
        setSelectedInstruments(selectedItems as ArtistType.Instrument[]);
        break;
      case "genres":
        setSelectedGenres(selectedItems as ArtistType.Genre[]);
        break;
      case "students":
        setSelectedStudents(selectedItems as ArtistType.Student[]);
        break;
      default:
        console.log("Unknown field:", field);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button className="bg-blue-500 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium text-sm">
              <span className="text-lg">+</span>
              Add Songs
            </button>
            <button className="bg-white text-gray-600 px-4 py-2.5 rounded-lg flex items-center gap-2 border border-gray-300 shadow-sm text-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Add Albums
            </button>
            <button className="bg-white text-gray-600 px-4 py-2.5 rounded-lg flex items-center gap-2 border border-gray-300 shadow-sm text-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              All
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            <select className="px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-600">
              <option>Last 7 days</option>
            </select>
            <button className="px-3 py-2 border border-gray-300 rounded text-sm bg-white flex items-center gap-2 text-gray-600">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download as CSV
            </button>
          </div>
        </div>

        <div className="flex justify-between gap-5 ">
          <div>
            {/* Filter Title */}
            <h2 className="text-lg font-medium text-gray-900 mb-6">Filter</h2>

            {/* Filter Grid - 3 columns, 3 rows */}
            <div className="grid grid-cols-4 gap-12 mb-8">
              {/* Row 1 */}
              <div>{renderTagSection("Category Name", "categoryName")}</div>
              <div>{renderTagSection("Album Name", "albumName")}</div>
              <div>{renderTagSection("Artists Name", "artistsName")}</div>
              <div className="text-black">
                {renderTextArea("Song name", songName, setSongName)}
              </div>

              {/* Row 2 */}
              <div>{renderTagSection("Composer", "composer")}</div>
              <div>{renderTagSection("Genre", "genre")}</div>
              <div className="col-span-2 text-black">
                {renderTextArea("Description", description, setDescription)}
              </div>

              {/* Row 3 */}
              <div>{renderTagSection("Musical Period", "musicalPeriod")}</div>
              <div>
                {renderTagSection("Instrument Played", "instrumentPlayed")}
              </div>
              <div className="col-span-2 text-black">
                {renderTextArea("Lyric", lyric, setLyric)}
              </div>
            </div>

            {/* Upload Sections - 2 columns */}
            <div className="grid grid-cols-2 gap-12">
              <div>
                {renderUploadSection(
                  "Upload Song",
                  "JPG, PNG or PDF, file size no more than 10MB"
                )}
              </div>
              <div>
                {renderUploadSection(
                  "Upload Cover Art",
                  "JPG, PNG or PDF, file size no more than 10MB"
                )}
              </div>
            </div>
          </div>

          {/* second sections */}
          <div className="flex flex-col items-end gap-4 justify-between mt-15 ">

            {/* quizzes form section */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Quiz Questions</h3>
              <form className="space-y-4 w-80 text-black">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Question
                  </label>
                  <input
                    name="content"
                    value={quizzesData.content}
                    onChange={(e) => setQuizzesData({
                      ...quizzesData,
                      content:e.target.value,
                    })}
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
                      // onChange={handleChange}
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
                      // onChange={handleChange}
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
                      // onChange={handleChange}
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
                      // onChange={handleChange}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  >
                    <option value="A">Answer A</option>
                    <option value="B">Answer B</option>
                    <option value="C">Answer C</option>
                    <option value="D">Answer D</option>
                  </select>
                </div>
              </form>
            </div>

            {/* buttons section */}
            <div>
              <button className="px-6 w-40 h-10 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors bg-white">
                Clear
              </button>
              <button className="px-6 w-40 h-10 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal ? (
        <SearchModal
          onClose={handleCloseModal}
          fieldType={currentField}
          onSelect={(selectedItems) => {
            handleSelectedItems(
              currentField,
              selectedItems as SelectableItem[]
            );
          }}
        />
      ) : null}
    </div>
  );
};

export default AddSongsPage;