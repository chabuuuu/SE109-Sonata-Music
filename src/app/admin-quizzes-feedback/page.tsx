"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Settings } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import feedbacks from "./feedbacks.json";
import Pagination from "@mui/material/Pagination";
import Image from "next/image";

export default function QuizzesFeedbackAdmin() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState([
    false,
    false,
    false,
    false,
    false,
  ]); //many hooks for many buttons
  const QuizPerPage = 10;
  const totalPages = Math.ceil(feedbacks.length / QuizPerPage);

  // for a more consistency and immutability for the function to work as a hooks function
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  function handleCollapseClick(index: number) {
    setIsCollapsed((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  }

  function renderCollapseIcon(index: number) {
    return isCollapsed[index] ? (
      <ChevronUp size={20} />
    ) : (
      <ChevronDown size={20} />
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
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
                {/* will be changed in the future */}
                <p>Last 7 days</p>
                <ChevronDown size={16} />
              </button>
            </div>
            <button className="flex items-center gap-2 border border-sky-900/70 bg-white rounded-md px-3 py-1.5 text-sm text-sky-900/70">
              <Image
                src="../../Download_icon.svg"
                alt="download icon"
                width={24}
                height={24}
              />
              Download as CSV
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-black">Quizzes Feedback</h1>
            <button
              className="text-blue-600"
              onClick={() => handleCollapseClick(0)}
            >
              {renderCollapseIcon(0)}
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                      <button
                        className="text-blue-600 ml-1"
                        onClick={() => handleCollapseClick(0)}
                      >
                        {renderCollapseIcon(0)}
                      </button>
                    </div>
                  </th>

                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Quiz</span>
                      <button
                        className="text-blue-600 ml-1"
                        onClick={() => handleCollapseClick(1)}
                      >
                        {renderCollapseIcon(1)}
                      </button>
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">
                    <div className="flex">
                      <p>Quiz ID</p>
                      <button
                        className="text-blue-600 ml-1"
                        onClick={() => handleCollapseClick(2)}
                      >
                        {renderCollapseIcon(2)}
                      </button>
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">
                    <div className="flex">
                      <p>Passes Date</p>
                      <button
                        className="text-blue-600 ml-1"
                        onClick={() => handleCollapseClick(3)}
                      >
                        {renderCollapseIcon(3)}
                      </button>
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">
                    <div className="flex">
                      <p>Comment</p>
                      <button
                        className="text-blue-600 ml-1"
                        onClick={() => handleCollapseClick(4)}
                      >
                        {renderCollapseIcon(4)}
                      </button>
                    </div>
                  </th>
                  <th className="py-3 px-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {feedbacks
                  //slice to know where it would start and end
                  .slice(
                    (currentPage - 1) * QuizPerPage,
                    currentPage * QuizPerPage
                  )
                  .map((feedback, index) => {
                    return (
                      <tr
                        key={feedback.id}
                        className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                      >
                        <td className="py-3 px-4 text-sm text-sky-900/70">
                          {feedback.date}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {feedback.quiz}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {feedback.quizId}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {feedback.passedDate}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {feedback.comment}
                        </td>
                        <td className="py-3 px-4">
                          <button className="flex items-center justify-center h-6 w-6 rounded-lg border border-blue-900 text-blue-600">
                            <span className="text-sm font-medium">i</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
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
      </div>
    </AdminLayout>
  );
}
