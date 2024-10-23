import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";
import { checkUsername, registerUser } from "../callApi";
import { USERNAMESTATUS } from "../constants";

// Mock the API calls
jest.mock("../callApi");
jest.mock("../swalAlert", () => ({
    swalAlert: jest.fn(),
}));
jest.mock("../Spinner", () => () => <div>Loading...</div>);

describe("App Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders the App component", () => {
        render(<App />);
        expect(screen.getByText(/TetraPak/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter desired username/i)).toBeInTheDocument();
    });

    test("validates username and shows available message", async () => {
        (checkUsername as jest.Mock).mockResolvedValue({ available: true });

        render(<App />);
        const input = screen.getByPlaceholderText(/Enter desired username/i);
        fireEvent.change(input, { target: { value: "uniqueUsername" } });

        await waitFor(() => expect(checkUsername).toHaveBeenCalledWith("uniqueUsername"));
        expect(screen.getByText(USERNAMESTATUS.AVAILABLE)).toBeInTheDocument();
    });

    test("validates username and shows not available message", async () => {
        (checkUsername as jest.Mock).mockResolvedValue({ available: false });

        render(<App />);
        const input = screen.getByPlaceholderText(/Enter desired username/i);
        fireEvent.change(input, { target: { value: "takenUsername" } });

        await waitFor(() => expect(checkUsername).toHaveBeenCalledWith("takenUsername"));
        expect(screen.getByText(USERNAMESTATUS.NOT_AVAILABLE)).toBeInTheDocument();
    });

    test("shows error message on username validation error", async () => {
        (checkUsername as jest.Mock).mockResolvedValue({ error: "Username validation error" });

        render(<App />);
        const input = screen.getByPlaceholderText(/Enter desired username/i);
        fireEvent.change(input, { target: { value: "errorUsername" } });

        await waitFor(() => expect(checkUsername).toHaveBeenCalledWith("errorUsername"));
        expect(screen.getByText("Username validation error")).toBeInTheDocument();
    });

    test("registers username successfully", async () => {
        (checkUsername as jest.Mock).mockResolvedValue({ available: true });
        (registerUser as jest.Mock).mockResolvedValue({ success: true, message: "Registration successful" });

        render(<App />);
        const input = screen.getByPlaceholderText(/Enter desired username/i);
        fireEvent.change(input, { target: { value: "uniqueUsername" } });

        await waitFor(() => expect(checkUsername).toHaveBeenCalledWith("uniqueUsername"));
        const registerButton = screen.getByText(/Register/i);
        fireEvent.click(registerButton);

        await waitFor(() => expect(registerUser).toHaveBeenCalledWith("uniqueUsername"));
        expect(screen.getByPlaceholderText(/Enter desired username/i)).toHaveValue("");
    });
});