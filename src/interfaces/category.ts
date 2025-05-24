export interface Category {
  id: string;
  name: string;
  picture: string;
  description: string | null;
  viewCount: number;
  totalMusics: number;
}

export interface CategoryResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: Category[];
  errors: null;
} 