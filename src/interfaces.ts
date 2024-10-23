export interface CheckUsernameResponse {
  available: boolean;
  error: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  error: string;
}
