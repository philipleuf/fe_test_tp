import React, { useState } from "react";
import { checkUsername, registerUser } from "./callApi";
import { CheckUsernameResponse, RegisterResponse } from "./types";

const App: React.FC = () => {
  const [username, setUsername] = useState("");
  const [availability, setAvailability] = useState<string | null>(null);

  const validateUsername = async (username: string) => {
    setAvailability(null); // reset on every click
    const response: CheckUsernameResponse | undefined = await checkUsername(username);
    setAvailability(response?.available ? "Available" : "Not available");
  };

  const registerUsername = async (username: string) => {
    const response: RegisterResponse | undefined = await registerUser(username);
    if (response?.success) {
      setAvailability(null);
      setUsername("");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setAvailability(null);
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
          <button
            onClick={() => validateUsername(username)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition duration-300 ease-in-out mb-4"
          >
            Check uniqueness
          </button>
          {availability && (
            <p
              className={`text-lg font-bold mb-4 text-center ${availability === "Available" ? "text-green-600" : "text-red-600"
                }`}
            >
              {availability}
            </p>
          )}
          {availability === "Available" && (
            <button
              onClick={() => registerUsername(username)}
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
