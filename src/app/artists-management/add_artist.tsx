import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import SearchModal from "@/components/SearchModal";
import axios from "axios";
import { ADMIN_TOKEN } from "@/constant/adminToken";

// items selected type
interface Genre {
  createAt?: string; 
  updateAt?: string;
  deleteAt?: null | string;
  id: number;
  name: string;
  description: string;
  picture: string;
}
interface Orchestra {
  createAt?: string;
  updateAt?: string;
  deleteAt?: null | string;
  id: string;
  name: string;
  picture: string;
  description: string;
}
interface Period {
  createAt?: string;
  updateAt?: string;
  deleteAt?: null | string;
  id: number;
  name: string;
  description: string;
  picture: string;
}
interface Instrument {
  createAt?: string;
  updateAt?: string;
  deleteAt?: null | string;
  id: number;
  name: string;
  description: string;
  picture: string;
}
interface Student {
  id: number;
  name: string;
  description: string;
  picture: string;
}
type RoleItem = { id: number; name: string };
type SelectableItem =
  | Genre
  | Orchestra
  | Period
  | Instrument
  | Student
  | RoleItem;

const Add_artist = () => {
  // this is the function for handle the popup
  const [showModal, setShowModal] = useState(false);
  const [currentField, setCurrentField] = useState("");

  const [selectedPeriods, setSelectedPeriods] = useState<Period[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<RoleItem[]>([]);
  const [selectedOrchestras, setSelectedOrchestras] = useState<Orchestra[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>(
    []
  );
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
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
  const [description, setDescription] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  // it will set to show Modal then pass the field for api
  function handleShowModal(field: string) {
    setShowModal(true);
    setCurrentField(field);
  }
  // this will help to close the modal and set field to empty
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentField("");
  };

  const handleSelectedItems = (
    field: string,
    selectedItems: SelectableItem[]
  ) => {
    switch (field) {
      case "periods":
        setSelectedPeriods(selectedItems as Period[]);
        break;
      case "roles":
        setSelectedRoles(selectedItems as RoleItem[]);
        break;
      case "orchestras":
        setSelectedOrchestras(selectedItems as Orchestra[]);
        break;
      case "instruments":
        setSelectedInstruments(selectedItems as Instrument[]);
        break;
      case "genres":
        setSelectedGenres(selectedItems as Genre[]);
        break;
      case "students":
        setSelectedStudents(selectedItems as Student[]);
        break;
      default:
        console.log("Unknown field:", field);
    }
  };

  const handleClear = () => {
    // Clear multi-select hooks
    setSelectedPeriods([]);
    setSelectedRoles([]);
    setSelectedOrchestras([]);
    setSelectedInstruments([]);
    setSelectedGenres([]);
    setSelectedStudents([]);

    // Clear text input hooks
    setPerformances("");
    setTeachingAndAcademicContributions("");
    setNationality("");
    setAwardsAndHonors("");
    setDateOfBirth("");
    setName("");

    // Clear image URL
    setImageUrl("");
  };

  const handleAdd = async () => {
    const roles = selectedRoles.map((role) => role.name.toUpperCase());

    // Extract IDs for relationships
    const artistStudentIds = selectedStudents.map((student) => student.id);
    const periodIds = selectedPeriods.map((period) => period.id);
    const orchestraIds = selectedOrchestras.map((orchestra) => orchestra.id);
    const genreIds = selectedGenres.map((genre) => genre.id);
    const instrumentIds = selectedInstruments.map(
      (instrument) => instrument.id
    );

    const artistData = {
      name,
      description,
      picture: imageUrl,
      awardsAndHonors,
      nationality,
      teachingAndAcademicContributions,
      significantPerformences: performances,
      roles,
      dateOfBirth,
      dateOfDeath: dateOfDeath || null,
      artistStudentIds,
      periodIds,
      orchestraIds,
      genreIds,
      instrumentIds,
    };

    try {
      const response = await axios.post(
        "https://api.sonata.io.vn/api/v1/artist",
        artistData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN)}`,
            "Content-Type": "application/json", // optional if sending JSON
          },
        }
      );
      if (response.data.success) {
        alert(`Artist ${name} added successfully!`);
        handleClear();
      } else {
        alert(`Error: ${response.data.message || "Failed to add artist"})`);
      }
    } catch (err) {
      console.error("Error adding artist:", err);
    }
  };

  return (
    <div>
      <div className="w-full mx-auto p-2 md:p-4 bg-white">
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 text-black">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 bg-gray-100 rounded-md text-black"
                    placeholder="1920-05-15"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 text-black">
                    Date of Death
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 bg-gray-100 rounded-md text-black"
                    placeholder="1980-05-15"
                    value={dateOfDeath}
                    onChange={(e) => setDateOfDeath(e.target.value)}
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
                        {selectedPeriods.map((period) => (
                          <span
                            key={period.id}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            {period.name}
                          </span>
                        ))}
                      </div>

                      {/* Plus button positioned in the bottom-left corner */}
                      <button
                        onClick={() => handleShowModal("periods")}
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
                        {selectedRoles.map((role) => (
                          <span
                            key={role.id}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            {role.name}
                          </span>
                        ))}
                      </div>

                      {/* Plus button positioned in the bottom-left corner */}
                      <button
                        onClick={() => handleShowModal("roles")}
                        className="absolute left-[1px] bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300"
                      >
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
                        {selectedOrchestras.map((orchestra) => (
                          <span
                            key={orchestra.id}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            {orchestra.name}
                          </span>
                        ))}
                      </div>

                      {/* Plus button positioned in the bottom-left corner */}
                      <button
                        onClick={() => handleShowModal("orchestras")}
                        className="absolute left-[1px] bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300"
                      >
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
                        {selectedInstruments.map((instrument) => (
                          <span
                            key={instrument.id}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            {instrument.name}
                          </span>
                        ))}
                      </div>

                      {/* Plus button positioned in the bottom-left corner */}
                      <button
                        onClick={() => handleShowModal("instruments")}
                        className="absolute left-[1px] bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300"
                      >
                        <span className="text-lg leading-none">+</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1 text-black">
                    Awards & Honors
                  </label>
                  <textarea
                    value={awardsAndHonors}
                    onChange={(e) => setAwardsAndHonors(e.target.value)}
                    className="w-full p-2 bg-gray-100 rounded-md h-12 md:h-15 text-black"
                  />
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
                        {selectedGenres.map((genre) => (
                          <span
                            key={genre.id}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>

                      {/* Plus button positioned in the bottom-left corner */}
                      <button
                        onClick={() => handleShowModal("genres")}
                        className="absolute left-[1px] bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300"
                      >
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
                        {selectedStudents.map((student) => (
                          <span
                            key={student.id}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            {student.name}
                          </span>
                        ))}
                      </div>

                      {/* Plus button positioned in the bottom-left corner */}
                      <button
                        onClick={() => handleShowModal("students")}
                        className="absolute left-[1px] bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300"
                      >
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
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
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
                  <textarea
                    value={teachingAndAcademicContributions}
                    onChange={(e) =>
                      setTeachingAndAcademicContributions(e.target.value)
                    }
                    className="w-full p-2 bg-gray-100 rounded-md h-12 md:h-16 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 text-black">
                    Significant Performances
                  </label>
                  <textarea
                    value={performances}
                    onChange={(e) => setPerformances(e.target.value)}
                    className="w-full p-2 bg-gray-100 rounded-md h-12 md:h-16 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 text-black">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 bg-gray-100 rounded-md h-12 md:h-16 text-black"
                  />
                </div>
              </div>
            </div>

            {/* File Upload Area */}
            <div className="border bg-gray-100 border border-gray-300 rounded-lg p-4 md:p-8 mt-4 flex flex-col items-center justify-center">
              <p className="text-xs md:text-xl text-gray-500 mb-2">
                Paste the image URL here
              </p>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full border bg-white border-gray-300 rounded-md p-2 text-sm text-black"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center md:justify-end mt-4 space-x-2 mb-4 lg:mb-0">
            <button
              onClick={handleClear}
              className="border border-gray-500 text-black px-4 md:px-6 py-2 h-10 rounded-full hover:bg-gray-200 w-24 md:w-30"
            >
              Clear
            </button>
            <button
              onClick={handleAdd}
              className="bg-green-500 text-white px-4 md:px-6 py-2 h-10 rounded-full hover:bg-green-400 w-24 md:w-30"
            >
              Add
            </button>
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

export default Add_artist;
