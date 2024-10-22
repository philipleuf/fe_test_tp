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
        jest.clearAllMocks(); // Reset mocks before each test
    });

    it("renders the initial UI elements", () => {
        render(<App />);

        // Check that the header and input elements are rendered
        expect(screen.getByText(/TetraPak/i)).toBeInTheDocument();
        expect(screen.getByText(/Frontend Code Test/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter desired username/i)).toBeInTheDocument();
        expect(screen.getByText(/Check uniqueness/i)).toBeInTheDocument();
    });

    it("displays 'Available' when username is available", async () => {
        // Mock the checkUsername API to return an available username
        (checkUsername as jest.Mock).mockResolvedValue({ available: true });

        render(<App />);

        // Simulate typing into the input field
        fireEvent.change(screen.getByPlaceholderText(/Enter desired username/i), {
            target: { value: "unique_username" },
        });

        // Simulate clicking the "Check uniqueness" button
        fireEvent.click(screen.getByText(/Check uniqueness/i));

        // Wait for the API call and check if "Available" is displayed
        await waitFor(() => {
            expect(screen.getByText(/Available/i)).toBeInTheDocument();
        });

        // Ensure the register button appears when the username is available
        expect(screen.getByText(/Register/i)).toBeInTheDocument();
    });

    it("displays 'Not available' when username is not available", async () => {
        // Mock the checkUsername API to return an unavailable username
        (checkUsername as jest.Mock).mockResolvedValue({ available: false });

        render(<App />);

        // Simulate typing into the input field
        fireEvent.change(screen.getByPlaceholderText(/Enter desired username/i), {
            target: { value: "taken_username" },
        });

        // Simulate clicking the "Check uniqueness" button
        fireEvent.click(screen.getByText(/Check uniqueness/i));

        // Wait for the API call and check if "Not available" is displayed
        await waitFor(() => {
            expect(screen.getByText(/Not available/i)).toBeInTheDocument();
        });

        // Ensure the register button does not appear
        expect(screen.queryByText(/Register/i)).not.toBeInTheDocument();
    });

    it("registers the username when it is available", async () => {
        // Mock the checkUsername API to return available and the registerUser API to succeed
        (checkUsername as jest.Mock).mockResolvedValue({ available: true });
        (registerUser as jest.Mock).mockResolvedValue({ success: true });

        render(<App />);

        // Simulate typing into the input field
        fireEvent.change(screen.getByPlaceholderText(/Enter desired username/i), {
            target: { value: "valid_username" },
        });

        // Simulate clicking the "Check uniqueness" button
        fireEvent.click(screen.getByText(/Check uniqueness/i));

        // Wait for the API call and check if "Available" is displayed
        await waitFor(() => {
            expect(screen.getByText(/Available/i)).toBeInTheDocument();
        });

        // Simulate clicking the "Register" button
        fireEvent.click(screen.getByText(/Register/i));

        // Ensure the registerUser function is called with the correct username
        await waitFor(() => {
            expect(registerUser).toHaveBeenCalledWith("valid_username");
        });

        // Ensure the input is cleared after successful registration
        expect(screen.getByPlaceholderText(/Enter desired username/i)).toHaveValue("");
    });

    it("does not register the username if it is not available", async () => {
        // Mock the checkUsername API to return unavailable username
        (checkUsername as jest.Mock).mockResolvedValue({ available: false });

        render(<App />);

        // Simulate typing into the input field
        fireEvent.change(screen.getByPlaceholderText(/Enter desired username/i), {
            target: { value: "taken_username" },
        });

        // Simulate clicking the "Check uniqueness" button
        fireEvent.click(screen.getByText(/Check uniqueness/i));

        // Wait for the API call and check if "Not available" is displayed
        await waitFor(() => {
            expect(screen.getByText(/Not available/i)).toBeInTheDocument();
        });

        // Ensure the register button is not rendered
        expect(screen.queryByText(/Register/i)).not.toBeInTheDocument();
    });
});
