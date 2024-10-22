# Frontend Coding Test

## Username Availability Checker

### Overview

You are tasked with creating a responsive React application using TypeScript that allows users to input a desired username, checks its availability in real-time, and allows users to register with an available username. The application will interface with a provided API to determine if the username is available and to handle user registration. The API is intentionally unstable and fails 60% of the time, returning an error. Your goal is to handle these failures gracefully and provide a smooth user experience.

---

### Table of Contents

- [Provided Resources](#provided-resources)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Project Structure](#project-structure)
- [Instructions](#instructions)
- [Deliverables](#deliverables)
- [Time Estimate](#time-estimate)
- [Qualities Assessed](#qualities-assessed)
- [Notes](#notes)
- [Submission](#submission)

---

## Provided Resources

- **Starting Project:**

  - A basic project structure is provided with the necessary dependencies in `package.json`.
  - This project uses React, TypeScript, Vite, and Express.

- **API Endpoints:**

  We have provided a mock API that simulates username availability checking and registration.

  - **Check Username Availability:**

    ```
    GET http://localhost:3000/check-username?username={username}
    ```

    - **Success Response (HTTP 200):**

      ```json
      { "available": true }
      ```

      or

      ```json
      { "available": false }
      ```

    - **Error Response (HTTP 503 or service unavailable):**

      - The API may fail 60% of the time, simulating a server error.

  - **Register Username:**

    ```
    POST http://localhost:3000/register
    Content-Type: application/json

    { "username": "desiredUsername" }
    ```

    - **Success Response (HTTP 200):**

      ```json
      {
        "success": true,
        "message": "User registered successfully"
      }
      ```

    - **Error Responses:**

      - **Username Taken (HTTP 400):**

        ```json
        { "error": "Username is taken" }
        ```

      - **Server Error (HTTP 503 or service unavailable):**

        - The API may fail 60% of the time, simulating a server error.

---

## Getting Started

### Prerequisites

- **Node.js**: You need Node.js installed (version 14 or higher is recommended).

### Installation

```bash
npm install
```

### Running the Application

The project includes both a frontend and a backend (mock API server). To run both concurrently, use:

```bash
npm run dev
```

This will start:

- **Frontend**: Vite development server running at `http://localhost:5173`
- **Backend API**: Express server running at `http://localhost:3000`

Open your browser and navigate to `http://localhost:5173` to see the application.

### Project Structure

- `src/`: This is where you'll add your React components and other frontend code.
- `backend.js`: Mock API server code (no need to modify).
- `package.json`: Contains scripts and dependencies.

---

## Instructions

- Implement your solution in the `src/` directory.
- Use React functional components and hooks (`useState`, `useEffect`, etc.).
- Make sure to handle asynchronous API calls properly.
- Ensure the application is responsive and user-friendly.
- Apply appropriate styling to enhance the user experience.
- Use TypeScript for type safety and define interfaces/types as needed.
- Write clean and maintainable code, following best practices.

---

## Deliverables

- A Git repository (zip file or link to a Git hosting service) containing your code.

---

## Time Estimate

- Approximately **2 hours**.

---

## Qualities Assessed

This assignment is designed to evaluate the following key competencies and qualities:

1. **Error Handling and Robustness**

2. **React Proficiency**

3. **TypeScript Expertise**

4. **Asynchronous Programming**

5. **User Experience Considerations**

6. **Code Quality and Best Practices**

7. **Problem-Solving Skills**

8. **Time Management and Prioritization**

---

## Notes

- **Focus**: Prioritize implementing the core requirements before moving on to bonus features.
- **Assumptions**: If you make any assumptions or design decisions that deviate from the requirements, please document them.
- **Styling**: While basic styling is required, the focus should be on functionality and code quality.

---

## Submission

- **Code**: Provide a link to your Git repository or submit a zip file containing your project.
- **Comments**: Feel free to include any comments or notes about your implementation.

---

Thank you for your effort and time. We look forward to reviewing your submission!
