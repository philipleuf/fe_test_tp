import React, { useState, useEffect, useCallback } from "react";
import { checkUsername, registerUser } from "./callApi";
import { CheckUsernameResponse, RegisterResponse } from "./interfaces";
import Spinner from "./Spinner";
import { errorAlert, successAlert } from "./swalAlerts";
import { USERNAMESTATUS } from "./constants";

const App: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [validating, setValidating] = useState<boolean>(false);
  const [showRegisterButton, setShowRegisterButton] = useState<boolean>(false);

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

  // Clear validation and reset relevant state
  const clearValidation = useCallback(() => {
    setValidating(false);
    setShowRegisterButton(false);
    setApiMessage(null);
  }, []);

  // Handle username validation response
  const handleCheckUsernameResponse = (response: CheckUsernameResponse) => {
    if (typeof response?.available === "boolean") {
      if (response.available) {
        setApiMessage(USERNAMESTATUS.AVAILABLE);
        setShowRegisterButton(true);
      } else {
        setApiMessage(USERNAMESTATUS.NOT_AVAILABLE);
      }

    } else {

      setApiMessage(response.toString());
      setShowRegisterButton(false);
    }
  };

  // Handle user registration response
  const handleRegisterResponse = (response: RegisterResponse) => {
    if (response?.success) {
      successAlert(response.message || "Successfully registered!");
      clearValidation();
      setUsername(""); // Clear username after registration
    } else {
      errorAlert(response.message || "Error registering user");
    }
  };

  const validateUsername = async () => {
    setValidating(true);
    const response = await checkUsername(username);
    setValidating(false);
    handleCheckUsernameResponse(response);
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
          {showRegisterButton && (
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
