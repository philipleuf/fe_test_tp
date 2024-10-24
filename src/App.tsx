import React, { useState, useEffect, useCallback } from "react";
import { checkUsername, registerUser } from "./callApi";
import { CheckUsernameResponse, RegisterResponse } from "./interfaces";
import Spinner from "./Spinner";
import { swalAlert } from "./swalAlert";
import { USERNAMESTATUS } from "./constants";

const App: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [validating, setValidating] = useState<boolean>(false);

  /** Real time search and validation of username with debounce */
  useEffect(() => {
    if (!username) {
      clearValidation();
      return;
    }
    const debouncer = setTimeout(() => {
      validateUsername();
    }, 500);

    return () => clearTimeout(debouncer);
  }, [username]);

  const validateUsername = async () => {
    setValidating(true);
    const response = await checkUsername(username);
    setValidating(false);
    handleCheckUsernameResponse(response);
  };

  // Clear validation and reset relevant state
  const clearValidation = useCallback(() => {
    setValidating(false);
    setApiMessage(null);
  }, []);

  // Handle username validation response
  const handleCheckUsernameResponse = (response: CheckUsernameResponse) => {
    if (response.error) {
      setApiMessage(response.error);
    }
    if (typeof response.available === "boolean") {
      const usernameAvailable = response.available === true;
      setApiMessage(usernameAvailable ? USERNAMESTATUS.AVAILABLE : USERNAMESTATUS.NOT_AVAILABLE);
    }
  };

  // Handle user registration response
  const handleRegisterResponse = (response: RegisterResponse) => {
    if (response.error) {
      swalAlert(false, response.error);
    }
    if (typeof response.success === "boolean") {
      const registerSuccess = response.success === true;
      if (registerSuccess) swalAlert(registerSuccess, response.message);
      clearValidation();
      setUsername(""); // Clear username after registration
    }
  };

  const registerUsername = async () => {
    const response = await registerUser(username);
    handleRegisterResponse(response);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setValidating(true);
    setApiMessage(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">TetraPak</h1>
        <h2 className="text-lg text-gray-600 text-center mb-6">Frontend Code Test</h2>
        <main className="text-center text-blue-600 font-bold text-xl mb-6">🧙‍♂️ Wizardry 🧙‍♂️</main>
        <div>
          <h1 className="text-2xl font-semibold text-gray-700 text-center mb-4">Find your uniqueness</h1>
          <input
            type="text"
            value={username}
            onChange={handleChange}
            placeholder="Enter desired username"
            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          {apiMessage && (
            <p className={`text-lg font-bold mb-4 text-center ${apiMessage === USERNAMESTATUS.AVAILABLE ? "text-green-600" : "text-red-600"}`}>
              {apiMessage}
            </p>
          )}
          {validating && <Spinner />}
          {apiMessage === USERNAMESTATUS.AVAILABLE && (
            <button
              onClick={registerUsername}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md transition duration-300 ease-in-out"
            >
              Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
