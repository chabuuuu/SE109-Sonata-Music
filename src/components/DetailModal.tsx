"use client";

import { useRef, useState, useEffect } from "react";
import { X, Clock, Eye, User, Music, Edit } from "lucide-react";
import CustomImage from "@/components/CustomImage";
import { ADMIN_TOKEN } from "@/constant/adminToken";
import axios from "axios";
import FileUploadSection from "@/components/upload-file";

type DetailModalProps = {
  onClose: () => void;
  data: {
    id: string;
    title: string;
    description: string;
    createAt?: string;
    views: string;
    createdBy: string;
    picture: string;
    songsCount: string;
  };
};

const DetailModal = ({ onClose, data }: DetailModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: data.title,
    picture: data.picture,
    description: data.description,
  });
  const [coverArtUrl, setCoverArtUrl] = useState(data.picture);

  // update Edit data when coverArtUrl change

  useEffect(() => {
    setEditData((prev) => ({
      ...prev,
      picture: coverArtUrl || data.picture, // Use coverArtUrl if available, else data.picture
    }));
  }, [coverArtUrl, data.picture]);

  useEffect(() => {
    setEditData({
      name: data.title,
      picture: coverArtUrl,
      description: data.description,
    });
    setCoverArtUrl(data.picture);
  }, [data]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSave = async () => {
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

  const handleUploadError = (error: string) => {
    console.error("Upload failed:", error);
    alert(`Upload failed: ${error}`);
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
            alt={data.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          {/* Buttons */}
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

          {/* Title on image */}
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-2xl font-bold text-white drop-shadow-md">
              {data.title || "Detail"}
            </h2>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Stats Row */}
          <div className="flex items-center justify-between mb-6 px-2 py-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center space-x-1 text-gray-700">
              <Clock size={16} className="text-indigo-500" />
              <span className="text-sm">{data.createAt || "Recent"}</span>
            </div>

            <div className="flex items-center space-x-1 text-gray-700">
              <Eye size={16} className="text-indigo-500" />
              <span className="text-sm">{data.views} views</span>
            </div>

            <div className="flex items-center space-x-1 text-gray-700">
              <User size={16} className="text-indigo-500" />
              <span className="text-sm">{data.createdBy}</span>
            </div>

            <div className="flex items-center space-x-1 text-gray-700">
              <Music size={16} className="text-indigo-500" />
              <span className="text-sm">{data.songsCount} songs</span>
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
                  <div>
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

        {/* Footer Buttons */}
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

export default DetailModal;
