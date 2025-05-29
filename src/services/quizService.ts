import axios from "axios";
import { getAuthHeaders } from "./authService";

// Interfaces cho Quiz APIs
export interface QuizQuestion {
  id: string;
  content: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
}

export interface UnansweredQuizzesResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: QuizQuestion[];
  errors: null | any;
}

export interface AnswerQuizRequest {
  answer: "A" | "B" | "C" | "D";
}

export interface AnswerQuizResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: {
    result: boolean;
    message: string;
  };
  errors: null | any;
}

/**
 * Lấy danh sách câu hỏi quiz chưa trả lời theo music ID
 * @param musicId ID của bài hát
 * @returns Danh sách quiz chưa trả lời
 */
export async function getUnansweredQuizzes(
  musicId: string | number
): Promise<QuizQuestion[]> {
  try {
    const response = await axios.get<UnansweredQuizzesResponse>(
      `https://api.sonata.io.vn/api/v1/quiz/unanswered/${musicId}`,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        timeout: 8000,
      }
    );

    if (response.data && response.data.success) {
      return Array.isArray(response.data.data) ? response.data.data : [];
    } else {
      throw new Error(response.data.message || "Không thể lấy danh sách quiz");
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message || error.response.statusText;
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server");
      }
    }
    throw new Error(error.message || "Đã xảy ra lỗi khi lấy quiz");
  }
}

/**
 * Trả lời câu hỏi quiz
 * @param quizId ID của câu hỏi quiz
 * @param answer Đáp án được chọn (A, B, C, hoặc D)
 * @returns Kết quả trả lời (đúng/sai) và thông báo
 */
export async function answerQuiz(
  quizId: string,
  answer: "A" | "B" | "C" | "D"
): Promise<{ result: boolean; message: string }> {
  try {
    const requestData: AnswerQuizRequest = { answer };

    const response = await axios.post<AnswerQuizResponse>(
      `https://api.sonata.io.vn/api/v1/quiz/answer/${quizId}`,
      requestData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        timeout: 8000,
      }
    );

    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Không thể submit câu trả lời");
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message || error.response.statusText;
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server");
      }
    }
    throw new Error(error.message || "Đã xảy ra lỗi khi submit câu trả lời");
  }
} 