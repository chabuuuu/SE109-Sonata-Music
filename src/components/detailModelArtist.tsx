"use client";

import { useRef, useState, useEffect } from "react";
import { X, Edit } from "lucide-react";
import CustomImage from "@/components/CustomImage";
import { ADMIN_TOKEN } from "@/constant/adminToken";
import axios from "axios";

type DetailModalArtistProps = {
  onClose: () => void;
  data: {
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
    dateOfDeath: string | null;
    genres: Array<{
      id: number;
      name: string;
      description: string;
      picture: string;
    }>;
    orchestras: Array<{
      id: string;
      name: string;
      picture: string;
      description: string;
    }>;
    periods: Array<{
      id: number;
      name: string;
      description: string;
      picture: string;
    }>;
    musicsComposed: Array<{
      id: number;
      name: string;
      coverPhoto: string;
    }>;
    musics: Array<{
      id: number;
      name: string;
      coverPhoto: string;
    }>;
    instruments: Array<{
      id: number;
      name: string;
      description: string;
      picture: string;
    }>;
    artistStudents: Array<{
      id: number;
      student: {
        id: number;
        name: string;
        description: string;
        picture: string;
      };
    }>;
  };
};

const DetailModalArtist = ({ onClose, data }: DetailModalArtistProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: data.name,
    picture: data.picture,
    description: data.description,
  });

  useEffect(() => {
    setEditData({
      name: data.name,
      picture: data.picture,
      description: data.description,
    });
  }, [data]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSave = async () => {
    if (!editData.name || !editData.picture) {
      alert("Name and Picture URL are required.");
      return;
    }
    const token = localStorage.getItem(ADMIN_TOKEN);

    try {
      const response = await axios.put(
        `https://api.sonata.io.vn/api/v1/category/${data.id}`,
        editData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);
      setIsEditing(false);
      alert("Category updated successfully!");
    } catch (err) {
      console.error("Error updating category:", err);
      alert(
        `Failed to update category: ${
          err || "Unknown error"
        }. Please try again.`
      );
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 bg-opacity-70 backdrop-blur-sm"
    >
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-3/4 max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200"
      >
        {/* Image Header Section */}
        <div className="relative h-56 w-full overflow-hidden">
          <CustomImage
            src={data.picture}
            alt={data.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              className="p-2 bg-black/30 hover:bg-black/50 rounded-full transition-all duration-300 text-white"
              onClick={() => setIsEditing(true)}
            >
              <Edit size={18} />
            </button>
            <button
              className="p-2 bg-black/30 hover:bg-black/50 rounded-full transition-all duration-300 text-white"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>

          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-2xl font-bold text-white drop-shadow-md">
              {data.name || "Detail"}
            </h2>
          </div>
        </div>

        <div className="p-6">
          {/* Personal Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">
                  <strong>Born:</strong> {data.dateOfBirth}
                </p>
                <p className="text-gray-600">
                  <strong>Died:</strong> {data.dateOfDeath || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  <strong>Nationality:</strong> {data.nationality}
                </p>
                <p className="text-gray-600">
                  <strong>Roles:</strong> {data.roles.join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Description
            </h3>
            <p className="text-gray-600 whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
              {data.description}
            </p>
          </div>

          {/* Awards and Honors */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Awards and Honors
            </h3>
            <p className="text-gray-600">{data.awardsAndHonors}</p>
          </div>

          {/* Teaching and Academic Contributions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Teaching and Academic Contributions
            </h3>
            <p className="text-gray-600">
              {data.teachingAndAcademicContributions}
            </p>
          </div>

          {/* Significant Performances */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Significant Performances
            </h3>
            <p className="text-gray-600">{data.significantPerformences}</p>
          </div>

          {/* Genres */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Genres</h3>
            <ul className="list-disc list-inside text-gray-600">
              {data.genres.map((genre) => (
                <li key={genre.id}>{genre.name}</li>
              ))}
            </ul>
          </div>

          {/* Orchestras */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Orchestras
            </h3>
            <ul className="list-disc list-inside text-gray-600">
              {data.orchestras.map((orchestra) => (
                <li key={orchestra.id}>{orchestra.name}</li>
              ))}
            </ul>
          </div>

          {/* Periods */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Periods
            </h3>
            <ul className="list-disc list-inside text-gray-600">
              {data.periods.map((period) => (
                <li key={period.id}>{period.name}</li>
              ))}
            </ul>
          </div>

          {/* Musics Composed */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Musics Composed
            </h3>
            <ul className="list-disc list-inside text-gray-600">
              {data.musicsComposed.map((music) => (
                <li key={music.id}>{music.name}</li>
              ))}
            </ul>
          </div>

          {/* Musics */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Musics</h3>
            <ul className="list-disc list-inside text-gray-600">
              {data.musics.map((music) => (
                <li key={music.id}>{music.name}</li>
              ))}
            </ul>
          </div>

          {/* Instruments */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Instruments
            </h3>
            <ul className="list-disc list-inside text-gray-600">
              {data.instruments.map((instrument) => (
                <li key={instrument.id}>{instrument.name}</li>
              ))}
            </ul>
          </div>

          {/* Artist Students */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Artist Students
            </h3>
            <ul className="list-disc list-inside text-gray-600">
              {data.artistStudents.map((student) => (
                <li key={student.id}>{student.student.name}</li>
              ))}
            </ul>
          </div>

          {/* Edit Section */}
          {isEditing && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-black">
                Edit Category Information
              </h3>
              <form onSubmit={handleSave}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Picture URL
                  </label>
                  <input
                    type="text"
                    value={editData.picture}
                    onChange={(e) =>
                      setEditData({ ...editData, picture: e.target.value })
                    }
                    className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
          >
            <X size={18} className="mr-1" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModalArtist;
