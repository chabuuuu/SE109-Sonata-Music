// types/song.ts
export interface Quiz {
  content: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: string;
}

export interface SongData {
  name: string;
  description: string;
  lyric: string;
  coverPhoto: string;
  resourceLink: string;
  albumIds: number[];
  quizzes: Quiz[];
  genreIds: number[];
  instrumentIds: number[];
  periodIds: number[];
  categoryIds: number[];
  artistIds: number[];
  composerIds: number[];
}