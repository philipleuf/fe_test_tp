import React, { useState } from "react";
import "./App.css";
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
    <div className="container">
      <h1>TetraPak</h1>
      <h2>Frontend Code Test</h2>
      <main>🧙‍♂️ Wizardry 🧙‍♂️</main>
      <div>
        <h1>Find your uniqueness</h1>
        <input
          type="text"
          value={username}
          onChange={handleChange}
          placeholder="Enter desired username"
        />
        <button onClick={() => validateUsername(username)}>Check uniqueness</button>
        {availability && (
          <p className={availability === "Available" ? "available" : "not-available"}>
            {availability}
          </p>
        )}
        {availability === "Available" && (
          <button onClick={() => registerUsername(username)}>Register</button>
        )}
      </div>
    </div>
  );
};

export default App;
