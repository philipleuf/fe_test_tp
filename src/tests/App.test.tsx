import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import { checkUsername, registerUser } from "../callApi";

// Mock the API calls
jest.mock("../callApi", () => ({
    checkUsername: jest.fn(),
    registerUser: jest.fn(),
}));

describe("App Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the App component with initial elements", () => {
        render(<App />);

        // Check for the input and button
        const inputElement = screen.getByPlaceholderText(/enter desired username/i);
        const checkButton = screen.getByText(/check uniqueness/i);

        expect(inputElement).toBeInTheDocument();
        expect(checkButton).toBeInTheDocument();
    });

    it("displays 'Available' when username is available", async () => {
        // Mock `checkUsername` to return available username
        (checkUsername as jest.Mock).mockResolvedValue({ available: true });

        render(<App />);

        const inputElement = screen.getByPlaceholderText(/enter desired username/i);
        const checkButton = screen.getByText(/check uniqueness/i);

        // Simulate typing into the input
        fireEvent.change(inputElement, { target: { value: "unique_username" } });

        // Simulate clicking the check button
        fireEvent.click(checkButton);

        // Wait for the API call to complete
        await waitFor(() => {
            const availableMessage = screen.getByText(/available/i);
            expect(availableMessage).toBeInTheDocument();
        });

        // Check that the Register button is visible
        const registerButton = screen.getByText(/register/i);
        expect(registerButton).toBeInTheDocument();
    });

    it("displays 'Not available' when username is not available", async () => {
        // Mock `checkUsername` to return unavailable username
        (checkUsername as jest.Mock).mockResolvedValue({ available: false });

        render(<App />);

        const inputElement = screen.getByPlaceholderText(/enter desired username/i);
        const checkButton = screen.getByText(/check uniqueness/i);

        // Simulate typing into the input
        fireEvent.change(inputElement, { target: { value: "taken_username" } });

        // Simulate clicking the check button
        fireEvent.click(checkButton);

        // Wait for the API call to complete
        await waitFor(() => {
            const notAvailableMessage = screen.getByText(/not available/i);
            expect(notAvailableMessage).toBeInTheDocument();
        });

        // Check that the Register button is not rendered
        expect(screen.queryByText(/register/i)).toBeNull();
    });

    it("registers the username when it is available", async () => {
        // Mock `checkUsername` to return available and `registerUser` to succeed
        (checkUsername as jest.Mock).mockResolvedValue({ available: true });
        (registerUser as jest.Mock).mockResolvedValue({ success: true });

        render(<App />);

        const inputElement = screen.getByPlaceholderText(/enter desired username/i);
        const checkButton = screen.getByText(/check uniqueness/i);

        // Simulate typing into the input
        fireEvent.change(inputElement, { target: { value: "valid_username" } });

        // Simulate clicking the check button
        fireEvent.click(checkButton);

        // Wait for the API call to complete
        await waitFor(() => {
            const availableMessage = screen.getByText(/available/i);
            expect(availableMessage).toBeInTheDocument();
        });

        // Simulate clicking the Register button
        const registerButton = screen.getByText(/register/i);
        fireEvent.click(registerButton);

        // Ensure registerUser was called
        await waitFor(() => {
            expect(registerUser).toHaveBeenCalledWith("valid_username");
        });

        // After registration, ensure input is cleared
        expect(inputElement).toHaveValue("");
    });

    it("does not register the username if not available", async () => {
        // Mock `checkUsername` to return unavailable username
        (checkUsername as jest.Mock).mockResolvedValue({ available: false });

        render(<App />);

        const inputElement = screen.getByPlaceholderText(/enter desired username/i);
        const checkButton = screen.getByText(/check uniqueness/i);

        // Simulate typing into the input
        fireEvent.change(inputElement, { target: { value: "invalid_username" } });

        // Simulate clicking the check button
        fireEvent.click(checkButton);

        // Wait for the API call to complete
        await waitFor(() => {
            const notAvailableMessage = screen.getByText(/not available/i);
            expect(notAvailableMessage).toBeInTheDocument();
        });

        // Ensure that the Register button is not visible
        expect(screen.queryByText(/register/i)).toBeNull();
    });
});
