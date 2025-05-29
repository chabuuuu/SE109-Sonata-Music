"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Settings, Search } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import Pagination from "@mui/material/Pagination";
import CustomImage from "@/components/CustomImage";
import * as QuizType from "./quiz-type-api";
import axios from "axios";
import { ADMIN_TOKEN } from "@/constant/adminToken";
import QuizEditModal from "./quiz-modal";

export default function QuizzesFeedbackAdmin() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [quizzes, setQuizzes] = useState<QuizType.QuizItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chosenQuiz, setChosenQuiz] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const QuizPerPage = 4;
  const totalPages = Math.ceil(totalCount / QuizPerPage);

  // Use useEffect to set initial data

  // call api search quizzes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `https://api.sonata.io.vn/api/v1/quiz/search?rpp=${QuizPerPage}&page=${currentPage}`,
          {
            sorts: [{ key: "id", type: "DESC" }],
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN)}`,
            },
          }
        );
        console.log("API Response:", response.data);

        if (response.data.success) {
          setQuizzes(response.data.data.items || []);
          setTotalCount(response.data.data.total || 0);
        }
      } catch (error) {
        console.error("Failed to get quizzes data", error);
        setQuizzes([]);
        setTotalCount(0);
      }
    };
    fetchData();
  }, [currentPage, searchTerm, refreshTrigger]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const handleClick = (quizId: string) => {
    setIsModalOpen(true);
    setChosenQuiz(quizId);
  };

  const handleDelete = async (quizId: string) => {
    try {
      await axios.delete(`https://api.sonata.io.vn/api/v1/quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN)}`,
        },
      });
      setRefreshTrigger((prev) => prev + 1);
      alert("Delete quiz successfully!");
    } catch (err) {
      alert("Failed to delete!");
      console.log("Failed to delete!", err);
    }
  };

  // Move QuizCard outside and make it a proper React component
  function QuizCard({ quiz }: { quiz: QuizType.QuizItem }) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                Q{quiz.id}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  Quiz ID: {quiz.id}
                </h3>
                <p className="text-sm text-gray-500">
                  Music ID: {quiz.musicId}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCollapsed((c) => !c)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                {isCollapsed ? "▼" : "▲"}
              </button>
            </div>
          </div>

          {/* Question */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Question:</h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
              {quiz.content}
            </p>
          </div>

          {/* Collapsible Content */}
          {!isCollapsed && (
            <div className="space-y-4 border-t border-gray-100 pt-4">
              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-gray-50 border border-red-200 rounded-md">
                  <span className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    A
                  </span>
                  <span className="text-gray-700">{quiz.answerA}</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <span className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    B
                  </span>
                  <span className="text-gray-700">{quiz.answerB}</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <span className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    C
                  </span>
                  <span className="text-gray-700">{quiz.answerC}</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <span className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    D
                  </span>
                  <span className="text-gray-700">{quiz.answerD}</span>
                </div>
                <div>
                  <span className="font-medium text-black text-xl">
                    Correct Answer:{" "}
                    <span className="text-blue-500">{quiz.correctAnswer}</span>
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex  gap-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(quiz.createAt).toLocaleDateString("en-CA")}
                </div>
                <div>
                  <span className="font-medium">Updated:</span>{" "}
                  {new Date(quiz.updateAt).toLocaleDateString("en-CA")}
                </div>
                <div>
                  <span className="font-medium">Created by ID:</span>{" "}
                  {quiz.createdById}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleClick(quiz.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Edit Quiz
                </button>
                <button
                  onClick={() => handleDelete(quiz.id)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Functions tab */}
        <div className="flex justify-between items-center mb-6">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium">
            Dashboard
          </button>
          <div className="flex gap-2">
            <button className="rounded-full p-2 border border-sky-900/70 bg-white">
              <Settings size={18} className="text-sky-900/70" />
            </button>
            <div className="relative">
              <button className="flex items-center gap-2 border border-sky-900/70 bg-white rounded-md px-3 py-1.5 text-sm text-sky-900/70">
                <p>Last 7 days</p>
                <ChevronDown size={16} />
              </button>
            </div>
            <button className="flex items-center gap-2 border border-sky-900/70 bg-white rounded-md px-3 py-1.5 text-sm text-sky-900/70">
              <CustomImage
                src="../../Download_icon.svg"
                alt="download icon"
                width={24}
                height={24}
              />
              Download as CSV
            </button>
          </div>
        </div>

        {/* The headers */}
        <div className="mb-6">
          <div className="flex gap-6 items-center">
            <h1 className="text-xl font-bold text-black">Quizzes</h1>

            <div className="flex items-center space-x-4 ">
              <span className="text-sm font-medium text-black w-1/5">
                Found: {totalCount}
              </span>
              <div className="relative w-full">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
                />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-8 pr-20 h-10 bg-gray-100 rounded-lg text-black placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 border border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-black"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* The quizzes sections */}
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <div className="space-y-4 p-4">
              {quizzes.map((q) => (
                <QuizCard key={q.id} quiz={q} />
              ))}
            </div>
          </div>

          <div className="py-3 px-4 flex items-center justify-center border-t border-gray-200">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              siblingCount={1}
            />
            <button className="text-blue-500 text-sm ml-5">Show all</button>
          </div>
        </div>
        {isModalOpen ? (
          <QuizEditModal onClose={handleCloseModal} quizId={chosenQuiz} />
        ) : null}
      </div>
    </AdminLayout>
  );
}
