export interface QuizItem {
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
  id: string;
  content: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: string;
  createdById: string;
  updatedById: string | null;
  musicId: number;
}

export interface QuizData {
  total: number;
  items: QuizItem[];
}

export interface QuizResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: QuizData;
  errors: unknown; // You can change this to a more specific type if needed
}

