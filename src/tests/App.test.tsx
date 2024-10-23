import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";
import { checkUsername, registerUser } from "../callApi";
import { USERNAMESTATUS } from "../constants";

jest.mock("../callApi", () => ({
    checkUsername: jest.fn(),
    registerUser: jest.fn(),
}));

jest.mock("../swalAlerts", () => ({
    successAlert: jest.fn(),
    errorAlert: jest.fn(),
}));

describe("App Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the App component correctly", () => {
        render(<App />);
        expect(screen.getByPlaceholderText(/Enter desired username/i)).toBeInTheDocument();
        expect(screen.getByText(/TetraPak/i)).toBeInTheDocument();
        expect(screen.getByText(/Frontend Code Test/i)).toBeInTheDocument();
    });

    it("shows the spinner while validating username", async () => {
        (checkUsername as jest.Mock).mockResolvedValue({ available: true });
        render(<App />);
        fireEvent.change(screen.getByPlaceholderText(/Enter desired username/i), {
            target: { value: "unique_username" },
        });
        expect(screen.getByTestId("spinner")).toBeInTheDocument();
        await waitFor(() => expect(screen.queryByTestId("spinner")).toBeNull());
        expect(screen.getByText(USERNAMESTATUS.AVAILABLE)).toBeInTheDocument();
    });

    it("displays 'Available' and shows register button when username is available", async () => {
        (checkUsername as jest.Mock).mockResolvedValue({ available: true });
        render(<App />);
        fireEvent.change(screen.getByPlaceholderText(/Enter desired username/i), {
            target: { value: "available_username" },
        });
        await waitFor(() => {
            expect(screen.getByText(USERNAMESTATUS.AVAILABLE)).toBeInTheDocument();
            expect(screen.getByText(/Register/i)).toBeInTheDocument();
        });
    });

    it("displays 'Not Available' and hides the register button when username is not available", async () => {
        (checkUsername as jest.Mock).mockResolvedValue({ available: false });
        render(<App />);
        fireEvent.change(screen.getByPlaceholderText(/Enter desired username/i), {
            target: { value: "taken_username" },
        });
        await waitFor(() => {
            expect(screen.getByText(USERNAMESTATUS.NOT_AVAILABLE)).toBeInTheDocument();
            expect(screen.queryByText(/Register/i)).toBeNull();
        });
    });

    it("handles successful registration", async () => {
        (checkUsername as jest.Mock).mockResolvedValue({ available: true });
        (registerUser as jest.Mock).mockResolvedValue({ success: true, message: "Registration successful" });
        render(<App />);
        fireEvent.change(screen.getByPlaceholderText(/Enter desired username/i), {
            target: { value: "new_username" },
        });
        await waitFor(() => {
            expect(screen.getByText(USERNAMESTATUS.AVAILABLE)).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText(/Register/i));
        await waitFor(() => {
            expect(registerUser).toHaveBeenCalledWith("new_username");
            expect(screen.getByPlaceholderText(/Enter desired username/i)).toHaveValue("");
        });
    });

    it("handles registration failure", async () => {
        (checkUsername as jest.Mock).mockResolvedValue({ available: true });
        (registerUser as jest.Mock).mockResolvedValue({ success: false, message: "Registration failed" });
        render(<App />);
        fireEvent.change(screen.getByPlaceholderText(/Enter desired username/i), {
            target: { value: "new_username" },
        });
        await waitFor(() => {
            expect(screen.getByText(USERNAMESTATUS.AVAILABLE)).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText(/Register/i));
        await waitFor(() => {
            expect(registerUser).toHaveBeenCalledWith("new_username");
            expect(screen.queryByText(/Register/i)).toBeInTheDocument();
        });
    });

    it("does not show spinner or register button when input is cleared", async () => {
        render(<App />);
        const input = screen.getByPlaceholderText(/Enter desired username/i);
        fireEvent.change(input, { target: { value: "test_username" } });
        expect(screen.getByTestId("spinner")).toBeInTheDocument();
        fireEvent.change(input, { target: { value: "" } });
        await waitFor(() => {
            expect(screen.queryByTestId("spinner")).toBeNull();
        });
        expect(screen.queryByText(/Register/i)).toBeNull();
    });
});
