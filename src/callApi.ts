import { CheckUsernameResponse, RegisterResponse } from "./types";
import { successAlert, errorAlert } from "./swalAlerts";
import { responseMessages } from "./constants";

const errorMessage = "Unexpected error, try again";

export const checkUsername = async (username: string) => {
  const params = new URLSearchParams({ username });
  const response = await fetch(
    `http://localhost:3000/check-username?${params}`,
  );
  const data: CheckUsernameResponse = await response.json();

  if (response.status !== 200) {
    const errorMsg = data.error || response.statusText || errorMessage;
    errorAlert(errorMsg);
    throw new Error(errorMsg);
  }
  return data;
};

export const registerUser = async (username: string) => {
  const response = await fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });
  const data: RegisterResponse = await response.json();
  if (response.status !== 200) {
    errorAlert(data?.error || "Unexpected error");
    throw new Error(data.error || "Unexpected error");
  }
  successAlert(responseMessages.registerUserSuccess);
  return data;
};
