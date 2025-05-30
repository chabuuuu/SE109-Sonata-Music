import React, { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";
import CustomImage from "@/components/CustomImage";
import { Music } from "lucide-react";
import { CONTRIBUTOR_TOKEN } from "@/constant/contributorToken";

interface UploadResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: {
    mediaUrl: string;
  };
  errors: null;
}

interface FileUploadSectionProps {
  title: string;
  acceptedFormats: string;
  acceptTypes: string;
  fileType: "music" | "cover";
  uploadedUrl: string;
  onUploadSuccess: (mediaUrl: string) => void;
  onUploadError: (error: string) => void;
}

const ContributorFileUploadSection: React.FC<FileUploadSectionProps> = ({
  title,
  acceptedFormats,
  acceptTypes,
  fileType,
  uploadedUrl,
  onUploadSuccess,
  onUploadError,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [mediaId, setMediaId] = useState("");

  useEffect(() => {
    // remember to create function
    const fetchMediaId = async () => {
      try {
        const response = await axios.get(
          `https://api.sonata.io.vn/media-service/api/v1/media/media-id`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(CONTRIBUTOR_TOKEN)}`,
            },
          }
        );
        setMediaId(response.data.data.mediaId);
        console.log("Successfully get media ID.", response.data.data.mediaId);
      } catch (err) {
        console.log("Failed to get media ID: ", err);
      }
    };

    fetchMediaId();
  }, []); //use only once to get mediaId

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      console.log("No files selected");
      onUploadError("No files selected");
      return;
    }

    const file = files[0];
    console.log("Uploading file:", file.name);

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadUrl =
        fileType === "music"
          ? `https://api.sonata.io.vn/media-service/api/v1/media/upload/music?mediaCategory=GENERAL&mediaId=${mediaId}`
          : "https://api.sonata.io.vn/media-service/api/v1/media/upload/image?mediaCategory=GENERAL";

      const response = await axios.post<UploadResponse>(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem(CONTRIBUTOR_TOKEN)}`,
        },
        maxBodyLength: Infinity,
      });

      if (response.data.success) {
        const mediaUrl = response.data.data.mediaUrl;
        console.log("Upload successful! Media URL:", mediaUrl);
        onUploadSuccess(mediaUrl);
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <h3 className="text-sm font-medium text-gray-800 mb-3">{title}</h3>
      <div className="border-2 border-dashed border-gray-300 rounded p-6 bg-gray-50">
        <label className="flex flex-col items-center justify-center cursor-pointer">
          <span className="text-sm text-gray-600 mb-2">
            {isUploading ? "Uploading..." : "Click to upload files"}
          </span>
          <input
            type="file"
            accept={acceptTypes}
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <div
            className={`px-4 py-2 bg-white border border-gray-300 rounded text-sm transition ${
              isUploading
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:bg-blue-50 cursor-pointer"
            }`}
          >
            {isUploading ? "Uploading..." : "Browse Files"}
          </div>
        </label>
        <p className="mt-2 ml-10 text-xs text-gray-400">{acceptedFormats}</p>

        {uploadedUrl && (
          <div className=" flex flex-col gap-5 mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-700 font-medium">
              Upload Successful!
            </p>
            <div className="mt-2 mb-3">
              {fileType === "cover" ? (
                <div className="relative w-16 h-16">
                  <CustomImage
                    src={uploadedUrl}
                    alt="Cover art preview"
                    width={64}
                    height={64}
                    className="rounded object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-blue-600">
                  <Music size={16} />
                  <span className="text-sm">Audio file uploaded</span>
                </div>
              )}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(uploadedUrl)}
              className="mt-2 px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Copy URL
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributorFileUploadSection;
