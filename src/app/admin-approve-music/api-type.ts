export interface MusicResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: MusicData;
  errors: null;
}

export interface MusicData {
  createAt: string;
  updateAt: string;
  id: number;
  name: string;
  description: string;
  approved: boolean;
  lyric: string;
  coverPhoto: string;
  resourceLink: string;
  listenCount: number;
  favoriteCount: number;
  approvedBy: UserShort;
  uploadedBy: UserFull;
  albums: Album[];
  quizzes: Quiz[];
  genres: Genre[];
  instruments: Instrument[];
  periods: Period[];
  categories: Category[];
  artists: Artist[];
  composers: Composer[];
}

export interface UserShort {
  id: string;
  name: string;
}

export interface UserFull {
  id: string;
  fullname: string;
}

export interface Album {
  id: string;
  name: string;
}

export interface Quiz {
  id: string;
  content: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
}

export interface Genre {
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
  id: number;
  name: string;
  description: string;
  picture: string;
}

export interface Instrument {
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
  id: number;
  name: string;
  description: string;
  picture: string;
}

export interface Period {
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
  id: number;
  name: string;
  description: string;
  picture: string;
}

export interface Category {
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
  id: string;
  name: string;
  picture: string;
  description: string | null;
  viewCount: number;
}

export interface Artist {
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
  id: number;
  name: string;
  description: string;
  picture: string;
  awardsAndHonors: string;
  nationality: string;
  teachingAndAcademicContributions: string;
  significantPerformences: string;
  roles: string[];
  dateOfBirth: string;
  dateOfDeath: string | null;
  viewCount: number;
  followers: number;
}

export type Composer = Artist;
