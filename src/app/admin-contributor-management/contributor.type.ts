export interface Contributor {
  createAt: string;
  updateAt: string;
  id: string;
  email: string;
  username: string;
  fullname: string;
}

export interface ContributorsResponse {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data: {
    total: number;
    items: Contributor[];
  };
  errors: unknown; // or `null` if you prefer strict typing
}
