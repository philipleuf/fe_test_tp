import { CheckUsernameResponse, RegisterResponse } from "./interfaces";

const API_BASE_URL = "http://localhost:3000";
const errorMessage = "Unexpected error, try again";

const handleFetchResponse = async (response: Response) => {
  const data = await response.json();
  if (response.status !== 200) {
    const errorMsg = data.error || response.statusText || errorMessage;
    return errorMsg;
  }
  return data;
};

export const checkUsername = async (username: string): Promise<CheckUsernameResponse> => {
  const params = new URLSearchParams({ username });
  const response = await fetch(`${API_BASE_URL}/check-username?${params}`);
  return handleFetchResponse(response);
};

export const registerUser = async (username: string): Promise<RegisterResponse> => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });
  const data: RegisterResponse = await handleFetchResponse(response);

  return data;
};