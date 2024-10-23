import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";
import { checkUsername, registerUser } from "../callApi";
import { USERNAMESTATUS } from "../constants";

// Mock the API calls
jest.mock("../callApi");

describe("App Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders the App component", () => {
        render(<App />);
        expect(screen.getByText("TetraPak")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter desired username")).toBeInTheDocument();
    });

    test("validates username and shows available message", async () => {
        (checkUsername as jest.Mock).mockResolvedValue({ available: true });

        render(<App />);
        const input = screen.getByPlaceholderText("Enter desired username");
        fireEvent.change(input, { target: { value: "uniqueUsername" } });

        await waitFor(() => {
            expect(screen.getByText(USERNAMESTATUS.AVAILABLE)).toBeInTheDocument();
        });
    });

    test("validates username and shows not available message", async () => {
        (checkUsername as jest.Mock).mockResolvedValue({ available: false });

        render(<App />);
        const input = screen.getByPlaceholderText("Enter desired username");
        fireEvent.change(input, { target: { value: "takenUsername" } });

        await waitFor(() => {
            expect(screen.getByText(USERNAMESTATUS.NOT_AVAILABLE)).toBeInTheDocument();
        });
    });

    test("registers a user when username is available", async () => {
        (checkUsername as jest.Mock).mockResolvedValue({ available: true });
        (registerUser as jest.Mock).mockResolvedValue({ success: true, message: "User registered successfully" });

        render(<App />);
        const input = screen.getByPlaceholderText("Enter desired username");
        fireEvent.change(input, { target: { value: "uniqueUsername" } });

        await waitFor(() => {
            expect(screen.getByText(USERNAMESTATUS.AVAILABLE)).toBeInTheDocument();
        });

        const registerButton = screen.getByText("Register");
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(registerUser).toHaveBeenCalledWith("uniqueUsername");
        });
    });

    test("shows error message when registration fails", async () => {
        (checkUsername as jest.Mock).mockResolvedValue({ available: true });
        (registerUser as jest.Mock).mockResolvedValue({ success: false, error: "Registration failed" });

        render(<App />);
        const input = screen.getByPlaceholderText("Enter desired username");
        fireEvent.change(input, { target: { value: "uniqueUsername" } });

        await waitFor(() => {
            expect(screen.getByText(USERNAMESTATUS.AVAILABLE)).toBeInTheDocument();
        });

        const registerButton = screen.getByText("Register");
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(registerUser).toHaveBeenCalledWith("uniqueUsername");
        });
    });
});