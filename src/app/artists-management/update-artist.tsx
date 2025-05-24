import React, { useEffect, useState } from "react";
import { ChevronDown, CloudUpload } from "lucide-react";
import SearchModal from "@/components/SearchModal";
import axios from "axios";
import { ADMIN_TOKEN } from "@/constant/adminToken";

// API Response Types
interface ApiResponse<T> {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: T;
  errors: null | unknown;
}

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

interface Music {
  id: number;
  name: string;
  coverPhoto: string;
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

interface ArtistStudent {
  id: number;
  student: Student;
}

interface Artist {
  id: number;
  name: string;
  description: string;
  picture: string;
  awardsAndHonors: string;
  nationality: string;
  teachingAndAcademicContributions: string;
  significantPerformences: string;
  roles: string[];
  dateOfBirth: string;
  dateOfDeath: null | string;
  genres: Genre[];
  orchestras: Orchestra[];
  periods: Period[];
  musicsComposed: Music[];
  musics: Music[];
  instruments: Instrument[];
  artistStudents: ArtistStudent[];
}

// Type for items that can be selected
type RoleItem = { id: number; name: string };
type SelectableItem = Genre | Orchestra | Period | Instrument | Student | RoleItem;

type UpdateArtistProp = {
  onClose: () => void;
  id: number;
};

const UpdateArtist = ({ onClose, id }: UpdateArtistProp) => {
  // State for managing modal
  const [showModal, setShowModal] = useState(false);
  const [currentFieldType, setCurrentFieldType] = useState("");
  const [artist, setArtist] = useState<Artist | null>(null);
  const BASE_URL = "https://api.sonata.io.vn/api/v1";

  // Function to open modal with specific field type
  const handleOpenModal = (fieldType: string) => {
    setCurrentFieldType(fieldType);
    setShowModal(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentFieldType("");
  };

  // Handle selected items from the modal
  const handleSelectItems = (fieldType: string, selectedItems: SelectableItem[]) => {
    if (!artist) return;

    // Update the artist state with the selected items based on fieldType
    setArtist((prev) => {
      if (!prev) return null;

      switch (fieldType) {
        case "periods":
          return { ...prev, periods: selectedItems as Period[] };
        case "roles":
          return { ...prev, roles: (selectedItems as RoleItem[]).map((item) => item.name) };
        case "orchestras":
          return { ...prev, orchestras: selectedItems as Orchestra[] };
        case "instruments":
          return { ...prev, instruments: selectedItems as Instrument[] };
        case "genres":
          return { ...prev, genres: selectedItems as Genre[] };
        case "students":
          // Transform the selected students into artistStudents format
          const artistStudents = (selectedItems as Student[]).map((student) => ({
            id: Math.random(), // This would be handled properly on the backend
            student,
          }));
          return { ...prev, artistStudents };
        default:
          return prev;
      }
    });
  };

  // Get existing items for a field type
  const getExistingItems = (fieldType: string): SelectableItem[] => {
    if (!artist) return [];

    switch (fieldType) {
      case "periods":
        return artist.periods || [];
      case "roles":
        // Transform roles (which are strings) to objects with id and name
        return (artist.roles || []).map((role, index) => ({
          id: index,
          name: role,
        }));
      case "orchestras":
        return artist.orchestras || [];
      case "instruments":
        return artist.instruments || [];
      case "genres":
        return artist.genres || [];
      case "students":
        // Transform artistStudents to student objects
        return (artist.artistStudents || []).map(
          (artistStudent) => artistStudent.student
        );
      default:
        return [];
    }
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setArtist((prev) =>
      prev
        ? {
            ...prev,
            [name]: value,
          }
        : null
    );
  };

  // Fetch artist data
  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get<ApiResponse<Artist>>(
          `${BASE_URL}/artist/${id}`,
          {
            headers: {
              Authorization: `Bearer ${ADMIN_TOKEN}`,
            },
          }
        );
        setArtist(response.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchArtist();
  }, [id]);

  // Handle form submission
  const handleUpdate = async () => {
    if (!artist) return;

    try {
      // Create the properly formatted request body
      const updateData = {
        name: artist.name,
        description: artist.description,
        picture: artist.picture,
        awardsAndHonors: artist.awardsAndHonors,
        nationality: artist.nationality,
        teachingAndAcademicContributions:
          artist.teachingAndAcademicContributions,
        significantPerformences: artist.significantPerformences,
        roles: artist.roles,
        dateOfBirth: artist.dateOfBirth,
        dateOfDeath: artist.dateOfDeath,

        // Convert related objects to ID arrays
        artistStudentIds:
          artist.artistStudents?.map((as) => as.student.id) || [],
        periodIds: artist.periods?.map((period) => period.id) || [],
        orchestraIds: artist.orchestras?.map((orchestra) => orchestra.id) || [],
        genreIds: artist.genres?.map((genre) => genre.id) || [],
        instrumentIds:
          artist.instruments?.map((instrument) => instrument.id) || [],
      };

      console.log("Sending update data:", updateData);

      // Send the properly formatted data
      await axios.put(`${BASE_URL}/artist/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN)}`,
          "Content-Type": "application/json",
        },
      });

      alert("Artist updated successfully!");
      onClose(); // Close the modal on successful update
    } catch (err) {
      console.error("Error updating artist:", err);
      alert("Failed to update artist");
    }
  };

  // Render tag items
  const renderTags = (fieldType: string) => {
    const items = getExistingItems(fieldType);

    return (
      <div className="flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item: SelectableItem) => (
            <span
              key={typeof item.id === 'string' ? item.id : item.id.toString()}
              className="bg-white text-blue-500 border border-blue-500 rounded-full px-3 py-1 text-xs"
            >
              {item.name}
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-xs">No items selected</span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto w-[90%] max-w-5xl">
      <div className="w-full mx-auto p-2 md:p-4 bg-white">
        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row lg:justify-around lg:items-end gap-3 md:gap-5">
          {/* Form Container */}
          <div className="w-full lg:w-5/6">
            <h2 className="font-bold text-black text-xl md:text-2xl mb-3 md:mb-4">
              Update Artist
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {/* Left Column */}
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-sm text-black mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full p-2 bg-gray-100 rounded-md text-black"
                    placeholder="Artist Name"
                    value={artist?.name || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 text-black">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    name="dateOfBirth"
                    className="w-full p-2 bg-gray-100 rounded-md text-black"
                    placeholder="MM/DD/YYYY"
                    value={artist?.dateOfBirth || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm mb-1 text-black">
                      Musical Period
                    </label>
                    <div className="bg-gray-100 w-full p-3 md:p-4 rounded-lg relative min-h-12">
                      {renderTags("periods")}
                      <button
                        onClick={() => handleOpenModal("periods")}
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
                      {renderTags("roles")}
                      <button
                        onClick={() => handleOpenModal("roles")}
                        className="absolute left-[1px] bg-blue-500 text-white rounded-full w-6 h-6 hover:bg-blue-300"
                      >
                        <span className="text-lg leading-none">+</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1 text-black">
                      Orchestras Collaborated
                    </label>
                    <div className="bg-gray-100 w-full p-3 md:p-4 rounded-lg relative min-h-12">
                      {renderTags("orchestras")}
                      <button
                        onClick={() => handleOpenModal("orchestras")}
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
                      {renderTags("instruments")}
                      <button
                        onClick={() => handleOpenModal("instruments")}
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
                    name="awardsAndHonors"
                    className="w-full p-2 bg-gray-100 rounded-md h-12 md:h-15 text-black"
                    value={artist?.awardsAndHonors || ""}
                    onChange={handleChange}
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
                      {renderTags("genres")}
                      <button
                        onClick={() => handleOpenModal("genres")}
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
                      {renderTags("students")}
                      <button
                        onClick={() => handleOpenModal("students")}
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
                      name="nationality"
                      className="w-full p-2 bg-gray-100 rounded-md text-black"
                      placeholder="Nationality"
                      value={artist?.nationality || ""}
                      onChange={handleChange}
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
                    name="teachingAndAcademicContributions"
                    className="w-full p-2 bg-gray-100 rounded-md h-12 md:h-16 text-black"
                    value={artist?.teachingAndAcademicContributions || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 text-black">
                    Significant Performances
                  </label>
                  <textarea
                    name="significantPerformences"
                    className="w-full p-2 bg-gray-100 rounded-md h-12 md:h-16 text-black"
                    value={artist?.significantPerformences || ""}
                    onChange={handleChange}
                  />
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
            <button
              onClick={onClose}
              className="border border-gray-500 text-black px-4 md:px-6 py-2 h-10 rounded-full hover:bg-gray-200 w-24 md:w-30"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-4 md:px-6 py-2 h-10 rounded-full hover:bg-green-400 w-24 md:w-30"
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Render SearchModal conditionally */}
      {showModal && (
        <SearchModal
          onClose={handleCloseModal}
          fieldType={currentFieldType}
          onSelect={(selectedItems) =>
            handleSelectItems(currentFieldType, selectedItems as SelectableItem[])
          }
          existingItems={getExistingItems(currentFieldType)}
        />
      )}
    </div>
  );
};

export default UpdateArtist;