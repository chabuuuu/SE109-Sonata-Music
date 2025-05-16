import { useState, useEffect } from "react";
import { Search, X, XCircle, Info } from "lucide-react";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import { ADMIN_TOKEN } from "@/constant/adminToken";
import { ArtistDetails, ApiArtistDetails } from "./artist.types";
import ArtistDetailModal from "./artist_detail_modal";

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
              Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN)}`,
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

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `https://api.sonata.io.vn/api/v1/artist/${id}`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN)}`,
          },
        }
      );

      setCurrentPage(1);
    } catch (err) {
      console.log("Can not delete the artist, please try again.", err);
      alert("Failed to delete artist. Please try again.");
    }
  };

  const handlePopup = (c: string) => {
    setIsPopup(true);
    setArtistDetailKey(c);
  };

  return (
    <div className="bg-white p-6 w-full mx-auto">
      {/* Main content area */}
      <div className="flex justify-between items-center mb-4">
        <div className="w-2/3">
          <h1 className="text-xl font-semibold text-black">
            List of active artists
          </h1>
          {/* Tabs */}
          <div className="flex border-b border-gray-300 mb-1">
            <div className="w-1/5 py-2 px-4 bg-gray-200 border-t border-l border-r border-gray-300 text-center text-black ">
              Approve Requests
            </div>
            <div className="w-1/5 py-2 px-4 bg-gray-200 border-t border-l border-r border-gray-300 text-center text-black ">
              Music Authorized
            </div>
            <div className="w-1/5 py-2 px-4 bg-gray-200 border-t border-l border-r border-gray-300 text-center text-black ">
              Administrators
            </div>
            <div className="w-1/5 py-2 px-4 bg-gray-200 border-t border-l border-r border-gray-300 text-center text-black ">
              Bands
            </div>
            <div className="w-1/5 py-2 px-4 bg-gray-200 border-t border-l border-r border-gray-300 text-center text-black ">
              Artists
            </div>
          </div>

          {/* Counters */}
          <div className="flex mb-8">
            <div className="w-1/5 py-2 px-4 text-center text-black ">233</div>
            <div className="w-1/5 py-2 px-4 text-center text-black ">11</div>
            <div className="w-1/5 py-2 px-4 text-center text-black ">8</div>
            <div className="w-1/5 py-2 px-4 text-center text-black ">1</div>
            <div className="w-1/5 py-2 px-4 text-center text-black ">15</div>
          </div>
        </div>

        <button className="bg-white text-blue-500 border border-blue-500 flex items-center px-4 py-1 rounded hover:bg-gray-300">
          <span>Export to Excel</span>
        </button>
      </div>

      <div className="flex">
        {/* Filter Section */}
        <div className="w-1/4 pr-4">
          <h2 className="text-lg font-medium mb-4 text-black">Filter</h2>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2 text-black">
              Musical Style
            </h3>
            <div className="flex items-center mb-2 text-black">
              <input type="checkbox" id="baroque" className="mr-2 h-4 w-4" />
              <label htmlFor="baroque">Baroque (111)</label>
            </div>
            <div className="flex items-center mb-2 text-black">
              <input type="checkbox" id="classical" className="mr-2 h-4 w-4" />
              <label htmlFor="classical">Classical (98)</label>
            </div>
            <div className="flex items-center text-black">
              <input type="checkbox" id="romantic" className="mr-2 h-4 w-4" />
              <label htmlFor="romantic">Romantic (45)</label>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2 text-black">Roles</h3>
            <div className="flex items-center mb-2 text-black">
              <input type="checkbox" id="composer" className="mr-2 h-4 w-4" />
              <label htmlFor="composer">Composer (111)</label>
            </div>
            <div className="flex items-center mb-2 text-black">
              <input type="checkbox" id="conductor" className="mr-2 h-4 w-4" />
              <label htmlFor="conductor">Conductor (12)</label>
            </div>
            <div className="flex items-center mb-2 text-black">
              <input type="checkbox" id="pianist" className="mr-2 h-4 w-4" />
              <label htmlFor="pianist">Pianist (5)</label>
            </div>
            <div className="flex items-center mb-2 text-black">
              <input type="checkbox" id="cellist" className="mr-2 h-4 w-4" />
              <label htmlFor="cellist">Cellist (3)</label>
            </div>
            <div className="flex items-center text-black">
              <input type="checkbox" id="violinist" className="mr-2 h-4 w-4" />
              <label htmlFor="violinist">Violinist (1)</label>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2 text-black">
              Awards and Honors
            </h3>
            <div className="flex items-center mb-2 text-black">
              <input type="checkbox" id="grammy" className="mr-2 h-4 w-4" />
              <label htmlFor="grammy">Grammy Award (43)</label>
            </div>
            <div className="flex items-center mb-2 text-black">
              <input type="checkbox" id="pulitzer" className="mr-2 h-4 w-4" />
              <label htmlFor="pulitzer">Pulitzer Prize for Music (10)</label>
            </div>
            <div className="flex items-center mb-2 text-black">
              <input type="checkbox" id="echo" className="mr-2 h-4 w-4" />
              <label htmlFor="echo">Echo Klassik Award (1)</label>
            </div>
            <div className="flex items-center mb-2 text-black">
              <input type="checkbox" id="orderArts" className="mr-2 h-4 w-4" />
              <label htmlFor="orderArts">Order of Arts and Letters (1)</label>
            </div>
            <div className="flex items-center text-black">
              <input
                type="checkbox"
                id="nationalMedal"
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="nationalMedal">National Medal of Arts (1)</label>
            </div>
          </div>

          <div className="text-center mb-2 text-sm text-gray-500">
            Show more
          </div>

          <button className="w-full border border-gray-300 rounded py-2 text-gray-600 rounded-full hover:bg-gray-300">
            Clear
          </button>
        </div>

        {/* Artists List Section */}
        <div className="w-3/4">
          <div className="flex justify-start items-center mb-4 gap-5">
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
            <button className="text-blue-500 hover:text-black">Cancel</button>
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
              <div className="px-2 font-medium">Action</div>
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
                    <button onClick={() => handleDelete(artist.id)}>
                      <XCircle size={20} className="text-red-500" />
                    </button>
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

            <button className="text-blue-500">Show all</button>

            <div className="flex items-center">
              <button className="border border-gray-300 rounded py-1 px-6 mr-2 text-black rounded-2xl hover:bg-gray-300">
                Edit
              </button>
              <button className="bg-gray-200 border border-gray-300 rounded py-1 px-4 text-black rounded-2xl hover:bg-white">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      {isPopup && (
        <ArtistDetailModal
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
