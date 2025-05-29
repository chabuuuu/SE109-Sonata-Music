"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { ADMIN_TOKEN } from "@/constant/adminToken";
import * as TypeQuiz from "./quiz-type-api";

interface QuizModalProp {
  onClose: () => void;
  quizId: string;
}

const QuizEditModal = ({ onClose, quizId }: QuizModalProp) => {
  // Initial state matching QuizItem interface with safe defaults
  const [quizData, setQuizData] = useState<TypeQuiz.QuizItem>({
    id: "",
    musicId: 0,
    content: "",
    answerA: "",
    answerB: "",
    answerC: "",
    answerD: "",
    correctAnswer: "A",
    createdById: "",
    updatedById: null,
    createAt: new Date().toISOString(),
    updateAt: new Date().toISOString(),
    deleteAt: null,
  });
  const [isLoading, setIsLoading] = useState(true); // Add loading state

//   extends keyof something => make K be any key of Something
  const handleInputChange = <K extends keyof TypeQuiz.QuizItem>(
    field: K,
    value: TypeQuiz.QuizItem[K]
  ) => {
    setQuizData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const updateQuizData = {
      content: quizData.content,
      answerA: quizData.answerA,
      answerB: quizData.answerB,
      answerC: quizData.answerC,
      answerD: quizData.answerD,
      correctAnswer: quizData.correctAnswer,
    };

    try {
      console.log("Sending PUT payload:", updateQuizData);
      await axios.put(
        `https://api.sonata.io.vn/api/v1/quiz/${quizId}`,
        updateQuizData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN)}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Quiz updated:", quizData);
      onClose();
    } catch (err) {
      console.error("Error updating quiz:", err);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://api.sonata.io.vn/api/v1/quiz/${quizId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN)}`,
            },
          }
        );
        const fetchedData = response.data.data;
        console.log("Fetched quiz data:", fetchedData);
        setQuizData(fetchedData);
      } catch (err) {
        console.error("Error fetching quiz data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        Loading...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
              Q{quizData.id}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Edit Quiz</h2>
              <p className="text-sm text-gray-500">Quiz ID: {quizData.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz ID
              </label>
              <input
                type="text"
                value={quizData.id}
                onChange={(e) => handleInputChange("id", e.target.value)}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readOnly // ID should not be editable
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Music ID
              </label>
              <input
                type="number"
                value={quizData.musicId}
                onChange={(e) =>
                  handleInputChange("musicId", parseInt(e.target.value) || 0)
                }
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question
            </label>
            <textarea
              value={quizData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              rows={3}
              className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              placeholder="Enter your quiz question here..."
            />
          </div>

          {/* Answer Options */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Answer Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Option A
                </label>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    A
                  </span>
                  <input
                    type="text"
                    value={quizData.answerA}
                    onChange={(e) =>
                      handleInputChange("answerA", e.target.value)
                    }
                    className="flex-1 text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Option B
                </label>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    B
                  </span>
                  <input
                    type="text"
                    value={quizData.answerB}
                    onChange={(e) =>
                      handleInputChange("answerB", e.target.value)
                    }
                    className="flex-1 text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Option C
                </label>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    C
                  </span>
                  <input
                    type="text"
                    value={quizData.answerC}
                    onChange={(e) =>
                      handleInputChange("answerC", e.target.value)
                    }
                    className="flex-1 text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Option D
                </label>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    D
                  </span>
                  <input
                    type="text"
                    value={quizData.answerD}
                    onChange={(e) =>
                      handleInputChange("answerD", e.target.value)
                    }
                    className="flex-1 text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Correct Answer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Answer
            </label>
            <select
              value={quizData.correctAnswer}
              onChange={(e) =>
                handleInputChange("correctAnswer", e.target.value)
              }
              className="w-full text-black md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {/* Optional placeholder */}
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          {/* Metadata Display (Read-only) */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-gray-900 mb-2">Metadata</h4>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Created:</span>{" "}
                {quizData.createAt
                  ? new Date(quizData.createAt).toLocaleDateString("en-CA")
                  : "N/A"}
              </div>
              <div>
                <span className="font-medium">Updated:</span>{" "}
                {quizData.updateAt
                  ? new Date(quizData.updateAt).toLocaleDateString("en-CA")
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizEditModal;
