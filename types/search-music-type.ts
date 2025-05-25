export interface MusicResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: {
    total: number;
    items: Music[];
  };
  errors: any;
}

export interface Music {
  createAt: string;
  updateAt: string;
  id: number;
  name: string;
  description: string;
  approved: boolean;
  coverPhoto: string;
  resourceLink: string;
  listenCount: number;
  favoriteCount: number;
  albums: Album[];
  genres: Genre[];
  instruments: Instrument[];
  periods: Period[];
  categories: Category[];
  artists: Artist[];
  composers: Artist[];
}

export interface Album {
  id: string;
  name: string;
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
  genres: Genre[];
}
