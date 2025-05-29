import { useState, useEffect, useCallback } from "react";
import {
  X,
  Music,
  Award,
  Calendar,
  User,
  Users,
  Mic,
  School,
  BookOpen,
} from "lucide-react";
import CustomImage from "@/components/CustomImage";
import axios from "axios";
import { CONTRIBUTOR_TOKEN } from "@/constant/contributorToken";

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

type ArtistDetailProp = {
  onClose: () => void;
  id: string;
};

const ContributorArtistDetailModal = ({ onClose, id }: ArtistDetailProp) => {
  const BASE_URL = "https://api.sonata.io.vn/api/v1";
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // get artist
  const fetchArtist = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse<Artist>>(
        `${BASE_URL}/artist/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(CONTRIBUTOR_TOKEN)}`,
          },
        }
      );
      setArtist(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load artist data");
      setLoading(false);
    }
  }, [id, BASE_URL]);

  // Get artist data when component mounts or when refreshKey changes
  useEffect(() => {
    fetchArtist();
  }, [id, fetchArtist]);

  //   loading section
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <p className="text-lg text-black">Loading artist information...</p>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <p className="text-lg text-red-600">
            {error || "Failed to load artist data"}
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    // Wrapper div containing both modals
    <div className="fixed inset-0 flex items-center justify-center z-40">
      {/* Artist Detail Modal */}
      <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl max-h-screen flex flex-col">
          {/* Modal Header with Close Button */}
          <div className="flex justify-between items-center p-4 border-b bg-blue-600 text-white">
            <h2 className="text-2xl font-bold">{artist.name}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-blue-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="overflow-y-auto p-0 flex-grow">
            <div className="flex flex-col md:flex-row">
              {/* Left Column - Image */}
              <div className="md:w-1/3 p-4">
                <div className=" aspect-square overflow-hidden rounded-lg shadow-md mb-4">
                  <div className="relative w-full h-full">
                    <CustomImage
                      src={artist.picture}
                      alt={artist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User size={18} className="text-blue-600" />
                    <span className="font-medium text-black">
                      Nationality: {artist.nationality}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar size={18} className="text-blue-600" />
                    <span className="font-medium text-black">
                      Born: {artist.dateOfBirth}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Users size={18} className="text-blue-600" />
                    <span className="font-medium text-black">
                      Roles: {artist.roles?.join(", ") || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="md:w-2/3 p-4">
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-blue-700">
                      About
                    </h3>
                    <p className="text-gray-700">
                      {artist.description || "No description available"}
                    </p>
                  </div>

                  {/* Awards */}
                  {artist.awardsAndHonors && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-blue-700 flex items-center">
                        <Award size={20} className="mr-2" />
                        Awards and Honors
                      </h3>
                      <p className="text-gray-700">{artist.awardsAndHonors}</p>
                    </div>
                  )}

                  {/* Performances */}
                  {artist.significantPerformences && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-blue-700 flex items-center">
                        <Mic size={20} className="mr-2" />
                        Significant Performances
                      </h3>
                      <p className="text-gray-700">
                        {artist.significantPerformences}
                      </p>
                    </div>
                  )}

                  {/* Teaching */}
                  {artist.teachingAndAcademicContributions && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-blue-700 flex items-center">
                        <School size={20} className="mr-2" />
                        Teaching Contributions
                      </h3>
                      <p className="text-gray-700">
                        {artist.teachingAndAcademicContributions}
                      </p>
                    </div>
                  )}

                  {/* Orchestras */}
                  {artist.orchestras && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-blue-700 flex items-center">
                        <Music size={20} className="mr-2" />
                        Orchestras
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {artist.orchestras.map((orchestra) => (
                          <div
                            key={orchestra.id}
                            className="bg-gray-100 p-3 rounded-lg flex items-center"
                          >
                            <div className="w-10 h-10 rounded overflow-hidden mr-2">
                              <div className=" w-full h-full relative">
                                <CustomImage
                                  src={orchestra.picture}
                                  alt={orchestra.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <span className="font-medium text-black">
                              {orchestra.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Genres */}
                  {artist.genres && artist.genres.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-blue-700 flex items-center">
                        <Music size={20} className="mr-2" />
                        Genres
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {artist.genres.map((genre) => (
                          <div
                            key={genre.id}
                            className="bg-gray-100 p-3 rounded-lg flex items-center"
                          >
                            <div className="w-10 h-10 rounded overflow-hidden mr-2">
                              <div className=" w-full h-full relative">
                                <CustomImage
                                  src={genre.picture}
                                  alt={genre.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <span className="font-medium text-black">
                              {genre.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Musics */}
                  {artist.musics && artist.musics.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-blue-700 flex items-center ">
                        <Music size={20} className="mr-2" />
                        Songs
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-black">
                        {artist.musics.map((music) => (
                          <div
                            key={music.id}
                            className="bg-gray-100 p-3 rounded-lg flex items-center"
                          >
                            <div className="w-10 h-10 rounded overflow-hidden mr-2">
                              <div className="relative w-full h-full">
                                <CustomImage
                                  src={music.coverPhoto}
                                  alt={music.name}
                                  fill
                                  className="object-cover"
                                />{" "}
                              </div>
                            </div>
                            <span className="font-medium">{music.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Students */}
                  {artist.artistStudents &&
                    artist.artistStudents.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-blue-700 flex items-center">
                          <BookOpen size={20} className="mr-2" />
                          Students
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          {artist.artistStudents.map((studentRel) => (
                            <div
                              key={studentRel.id}
                              className="bg-gray-100 p-3 rounded-lg flex items-center"
                            >
                              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                                <div className="w-full h-full relative">
                                  <CustomImage
                                    src={studentRel.student.picture}
                                    alt={studentRel.student.name}
                                    fill
                                    className=" object-cover"
                                  />{" "}
                                </div>
                              </div>
                              <div>
                                <div className="font-bold text-black">
                                  {studentRel.student.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {studentRel.student.description}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t p-4 bg-gray-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributorArtistDetailModal;
