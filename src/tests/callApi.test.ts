import { checkUsername, registerUser } from '../callApi';
import { successAlert, errorAlert } from '../swalAlerts'; // Adjust the path to where errorAlert is defined
import { responseMessages } from '../constants';

// Mocks
global.fetch = jest.fn();

jest.mock('../swalAlerts', () => ({
    errorAlert: jest.fn(),
    successAlert: jest.fn(),
}));


// Define a mock for errorMessage in case it is external
const errorMessage = "Unexpected error, try again";

describe('checkUsername', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return data when the username check is successful', async () => {
        // Mock fetch success response
        (fetch as jest.Mock).mockResolvedValue({
            status: 200,
            json: jest.fn().mockResolvedValue({ available: true }),
        });

        const result = await checkUsername("test_user");

        // Check if fetch was called with correct URL
        expect(fetch).toHaveBeenCalledWith("http://localhost:3000/check-username?username=test_user");

        // Validate the result
        expect(result).toEqual({ available: true });

        // Ensure errorAlert was not called
        expect(errorAlert).not.toHaveBeenCalled();
    });

    it('should show error alert and throw error when response is unsuccessful', async () => {
        // Mock fetch failure response
        (fetch as jest.Mock).mockResolvedValue({
            status: 400,
            json: jest.fn().mockResolvedValue({ error: "Username not found" }),
        });

        await expect(checkUsername("invalid_user")).rejects.toThrow("Username not found");

        // Check if errorAlert was called with correct message
        expect(errorAlert).toHaveBeenCalledWith("Username not found");

        // Ensure no other calls were made
        expect(fetch).toHaveBeenCalledWith("http://localhost:3000/check-username?username=invalid_user");
    });

    it('should handle response error with default error message when no specific error is provided', async () => {
        // Mock fetch failure response without an error message
        (fetch as jest.Mock).mockResolvedValue({
            status: 500,
            json: jest.fn().mockResolvedValue({}),
            statusText: "Internal Server Error",
        });

        await expect(checkUsername("test_user")).rejects.toThrow("Internal Server Error");

        // Check if errorAlert was called with statusText as fallback message
        expect(errorAlert).toHaveBeenCalledWith("Internal Server Error");
    });

    it('should handle missing statusText or error by using the fallback errorMessage', async () => {
        // Mock fetch failure response without an error or statusText
        (fetch as jest.Mock).mockResolvedValue({
            status: 500,
            json: jest.fn().mockResolvedValue({}),
        });

        await expect(checkUsername("test_user")).rejects.toThrow(errorMessage);

        // Check if errorAlert was called with fallback errorMessage
        expect(errorAlert).toHaveBeenCalledWith(errorMessage);
    });
});

describe('registerUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should register the user and show success alert when response is successful', async () => {
        // Mock fetch success response
        (fetch as jest.Mock).mockResolvedValue({
            status: 200,
            json: jest.fn().mockResolvedValue({ id: 1, username: "test_user" }),
        });

        const result = await registerUser("test_user");

        // Check if fetch was called with correct parameters
        expect(fetch).toHaveBeenCalledWith("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "test_user" }),
        });

        // Check if successAlert was called with correct message
        expect(successAlert).toHaveBeenCalledWith(responseMessages.registerUserSuccess);

        // Validate the result
        expect(result).toEqual({ id: 1, username: "test_user" });
    });

    it('should throw an error and show error alert when response fails', async () => {
        // Mock fetch error response
        (fetch as jest.Mock).mockResolvedValue({
            status: 400,
            json: jest.fn().mockResolvedValue({ error: "Invalid username" }),
        });

        await expect(registerUser("invalid_user")).rejects.toThrow("Invalid username");

        // Check if errorAlert was called with correct message
        expect(errorAlert).toHaveBeenCalledWith("Invalid username");

        // Ensure successAlert was not called
        expect(successAlert).not.toHaveBeenCalled();
    });

    it('should handle unexpected error gracefully', async () => {
        // Mock fetch error without a specific error message
        (fetch as jest.Mock).mockResolvedValue({
            status: 500,
            json: jest.fn().mockResolvedValue({}),
        });

        await expect(registerUser("test_user")).rejects.toThrow("Unexpected error");

        // Check if errorAlert was called with fallback error message
        expect(errorAlert).toHaveBeenCalledWith("Unexpected error");

        // Ensure successAlert was not called
        expect(successAlert).not.toHaveBeenCalled();
    });
});