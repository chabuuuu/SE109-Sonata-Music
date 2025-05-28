import { useState, useEffect } from "react";
import { Search, X, Info } from "lucide-react";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import { CONTRIBUTOR_TOKEN } from "@/constant/contributorToken";
import { ArtistDetails, ApiArtistDetails } from "../../../types/Types";
import ContributorArtistDetailModal from "./artist_detail_modal_contributor";

export default function All_artists() {
  const [artists, setArtists] = useState<ArtistDetails[]>([]);
  const [totalFound, setToTalFound] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPopup, setIsPopup] = useState(false);
  const [artistDetailKey, setArtistDetailKey] = useState("");
  const artistPerPage = 10;
  const totalPages = Math.ceil(totalFound / artistPerPage);

  function handlePageChange(event: React.ChangeEvent<unknown>, value: number) {
    setCurrentPage(value);
  }

  const handleSearchClear = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Updated useEffect with proper type handling
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const filters = searchTerm
          ? [
              {
                operator: "like",
                key: "name",
                value: searchTerm,
              },
            ]
          : [];
        const response = await axios.post(
          `https://api.sonata.io.vn/api/v1/artist/search?page=${currentPage}&rpp=${artistPerPage}`,
          { filters, sorts: [{ key: "id", type: "DESC" }] },
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${localStorage.getItem(
                CONTRIBUTOR_TOKEN
              )}`,
            },
          }
        );

        // destructuring for easier use
        const { total, items: artists } = response.data.data;

        // Map API response to our display format
        const LstArtists: ArtistDetails[] = artists.map(
          (artist: ApiArtistDetails) => ({
            id: artist.id || "N/A",
            name: artist.name || "Unknown",
            genres:
              artist.genres?.length > 0
                ? artist.genres.map((g) => g.name).join(", ")
                : "None",
            instruments:
              artist.instruments?.length > 0
                ? artist.instruments.map((i) => i.name).join(", ")
                : "None",
            nationality: artist.nationality || "Unknown",
            role:
              artist.roles?.length > 0 ? artist.roles.join(", ") : "Unknown",
            awardsAndHonors: artist.awardsAndHonors || "None",
          })
        );

        setArtists(LstArtists);
        setToTalFound(total);
      } catch (err) {
        console.log("Can't find the artist!", err);
      }
    };
    fetchArtists();
  }, [searchTerm, currentPage, artistPerPage]);

  const handlePopup = (c: string) => {
    setIsPopup(true);
    setArtistDetailKey(c);
  };

  return (
    <div className="bg-white p-6 w-full mx-auto">

      <div className="flex">
        {/* Artists List Section */}
        <div className="">
          <div className="flex justify-between items-center mb-4 gap-5">
            <div className="flex gap-4">
              <div className="text-xl text-gray-600">Found: {totalFound}</div>
              <div className="relative text-black">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-8 pr-8 py-1 border rounded"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-2 top-2 text-gray-400">
                  <Search size={16} />
                </div>
                {searchTerm && (
                  <button
                    className="absolute right-2 top-2 text-gray-400"
                    onClick={handleSearchClear}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            <div>
              <button className="bg-white text-blue-500 border border-blue-500 flex items-center px-4 py-1 rounded hover:bg-gray-300">
                <span>Export to Excel</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="mb-4">
            <div className="grid grid-cols-8 bg-gray-400/40 py-2 border-t border-b border-gray-300 text-black">
              <div className="px-2 font-medium">Full name</div>
              <div className="px-2 font-medium">Nationality</div>
              <div className="px-2 font-medium">Role</div>
              <div className="px-2 font-medium">Genre</div>
              <div className="px-2 font-medium">Instrument Played</div>
              <div className="px-2 font-medium">Awards</div>
              <div className="px-2 font-medium">ID</div>
            </div>

            {artists
              .slice(
                (currentPage - 1) * artistPerPage,
                currentPage * artistPerPage
              )
              .map((artist, index) => (
                <div
                  key={artist.id}
                  className={`grid grid-cols-8 py-2 border-b border-gray-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-100"
                  }`}
                >
                  <div className="px-2 text-black">{artist.name}</div>
                  <div className="px-2 text-black">{artist.nationality}</div>
                  <div className="px-2 text-black">{artist.role}</div>
                  <div className="px-2 text-black">{artist.genres}</div>
                  <div className="px-2 text-black">{artist.instruments}</div>
                  <div className="px-2 text-black">
                    {artist.awardsAndHonors}
                  </div>
                  <div className="px-2 text-black">{artist.id}</div>
                  <div className="flex gap-1 ml-2">
                    <button onClick={() => handlePopup(artist.id)}>
                      <Info size={20} className="text-blue-600" />
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                siblingCount={1}
              />
            </div>
          </div>
        </div>
      </div>
      {isPopup && (
        <ContributorArtistDetailModal
          id={artistDetailKey}
          onClose={() => {
            setIsPopup(false);
            setArtistDetailKey("");
          }}
        />
      )}
    </div>
  );
}
