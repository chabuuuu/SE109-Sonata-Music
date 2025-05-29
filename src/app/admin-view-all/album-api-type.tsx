export interface AlbumResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: Album;
  errors: unknown; // or `null` if you prefer `errors: null | SomeErrorType`
}

export interface Album {
  createAt: string; // ISO date string
  updateAt: string; // ISO date string
  deleteAt: string | null;
  id: string;
  name: string;
  coverPhoto: string;
  releaseDate: string; // ISO date string
  albumType: 'SINGLE' | 'ALBUM' | 'EP' | string; // Optional: restrict to known values
  description: string;
  viewCount: number;
}
