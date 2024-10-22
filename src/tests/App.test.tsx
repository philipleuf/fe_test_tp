import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App"; // Adjust the path as necessary
import { checkUsername, registerUser } from "../callApi"; // Mocking these API calls

// Mock the API calls
jest.mock("../callApi");

describe("App Component", () => {
    beforeEach(() => {
        // Clear mock history before each test
        jest.clearAllMocks();
    });

    it("renders the App component with initial elements", () => {
        render(<App />);

        // Check for the input and button
        const inputElement = screen.getByPlaceholderText(/enter desired username/i);
        const checkButton = screen.getByText(/check unqiueness/i);

        expect(inputElement).toBeInTheDocument();
        expect(checkButton).toBeInTheDocument();
    });

    it("displays 'Available' when username is available", async () => {
        // Mock `checkUsername` to return available username
        (checkUsername as jest.Mock).mockResolvedValue({ available: true });

        render(<App />);

        const inputElement = screen.getByPlaceholderText(/enter desired username/i);
        const checkButton = screen.getByText(/check unqiueness/i);

        // Simulate typing into the input
        fireEvent.change(inputElement, { target: { value: "unique_username" } });

        // Simulate clicking the check button
        fireEvent.click(checkButton);

        // Wait for the API call to complete
        await waitFor(() => {
            // Check if "Available" text is rendered
            const availableMessage = screen.getByText(/available/i);
            expect(availableMessage).toBeInTheDocument();
        });
    });

    it("displays 'Not available' when username is not available", async () => {
        // Mock `checkUsername` to return unavailable username
        (checkUsername as jest.Mock).mockResolvedValue({ available: false });

        render(<App />);

        const inputElement = screen.getByPlaceholderText(/enter desired username/i);
        const checkButton = screen.getByText(/check unqiueness/i);

        // Simulate typing into the input
        fireEvent.change(inputElement, { target: { value: "taken_username" } });

        // Simulate clicking the check button
        fireEvent.click(checkButton);

        // Wait for the API call to complete
        await waitFor(() => {
            // Check if "Not available" text is rendered
            const notAvailableMessage = screen.getByText(/not available/i);
            expect(notAvailableMessage).toBeInTheDocument();
        });
    });

    it("registers the username when available", async () => {
        // Mock `checkUsername` to return available and `registerUser` to succeed
        (checkUsername as jest.Mock).mockResolvedValue({ available: true });
        (registerUser as jest.Mock).mockResolvedValue({ success: true });

        render(<App />);

        const inputElement = screen.getByPlaceholderText(/enter desired username/i);
        const checkButton = screen.getByText(/check unqiueness/i);

        // Simulate typing into the input
        fireEvent.change(inputElement, { target: { value: "unique_username" } });

        // Simulate clicking the check button
        fireEvent.click(checkButton);

        // Wait for the "Available" message to appear
        await waitFor(() => {
            const availableMessage = screen.getByText(/available/i);
            expect(availableMessage).toBeInTheDocument();
        });

        // Simulate clicking the "Register" button
        const registerButton = screen.getByText(/register/i);
        fireEvent.click(registerButton);

        // Ensure registerUser is called
        await waitFor(() => {
            expect(registerUser).toHaveBeenCalledWith("unique_username");
        });

        // Check that the input is cleared after registration
        expect(inputElement).toHaveValue("");
    });

    it("does not register the username if not available", async () => {
        // Mock `checkUsername` to return unavailable username
        (checkUsername as jest.Mock).mockResolvedValue({ available: false });

        render(<App />);

        const inputElement = screen.getByPlaceholderText(/enter desired username/i);
        const checkButton = screen.getByText(/check unqiueness/i);

        // Simulate typing into the input
        fireEvent.change(inputElement, { target: { value: "taken_username" } });

        // Simulate clicking the check button
        fireEvent.click(checkButton);

        // Wait for the API call to complete
        await waitFor(() => {
            const notAvailableMessage = screen.getByText(/not available/i);
            expect(notAvailableMessage).toBeInTheDocument();
        });

        // Ensure that the "Register" button is not visible
        expect(screen.queryByText(/register/i)).toBeNull();
    });
});