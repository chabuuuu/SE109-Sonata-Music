// artist.types.ts
export interface Genre {
  id: number;
  name: string;
  description: string;
  picture: string;
  // Other fields omitted for brevity
}

export interface Student {
  id: number;
  name: string;
  description: string;
  picture: string;
}

export interface Orchestra {
  id: string;
  name: string;
  picture: string;
}

export interface Period {
  id: number;
  name: string;
  picture: string;
}

export interface Instrument {
  id: number;
  name: string;
  picture: string;
}

export interface Music {
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
  id: number;
  name: string;
  description: string;
  approved: boolean;
  approvedById: string;
  approvedAt: string;
  lyric: string;
  coverPhoto: string;
  resourceLink: string;
  uploadedById: string;
  listenCount: number;
  favoriteCount: number;
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
  musics: Music[];
}

export interface Album {
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
  id: string;
  name: string;
  coverPhoto: string;
  releaseDate: string;
  albumType: "SINGLE" | "ALBUM" | string; // you can extend this if needed
  description: string;
  viewCount: number;
}

export interface AlbumResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: Album;
  errors: any; // or you can define a more specific type for errors
}


// This interface represents what comes from the API
export interface ApiArtistDetails {
  id: number;
  name: string;
  description: string;
  picture: string;
  awardsAndHonors: string;
  nationality: string;
  roles: string[];
  dateOfBirth: string;
  // And other fields from the API
  genres: Genre[];
  orchestras: Orchestra[];
  periods: Period[];
  instruments: Instrument[];
}

// This interface represents what we want to display
export interface ArtistDetails {
  id: string;
  name: string;
  genres: string;
  instruments: string;
  nationality: string;
  role: string;
  awardsAndHonors: string;
}
