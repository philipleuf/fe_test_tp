import { checkUsername, registerUser } from '../callApi';
import { CheckUsernameResponse, RegisterResponse } from '../interfaces';

global.fetch = jest.fn();

describe("API Functions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("checkUsername", () => {
        it("should return data when the username check is successful", async () => {
            const mockResponse: CheckUsernameResponse = { available: true };

            (fetch as jest.Mock).mockResolvedValue({
                status: 200,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            const result = await checkUsername('test_username');
            expect(fetch).toHaveBeenCalledWith("http://localhost:3000/check-username?username=test_username");
            expect(result).toEqual(mockResponse);
        });

        it("should return an error message if the response is not successful", async () => {
            const mockErrorResponse = { error: "Username is taken" };

            (fetch as jest.Mock).mockResolvedValue({
                status: 400,
                json: jest.fn().mockResolvedValue(mockErrorResponse),
                statusText: "Bad Request",
            });

            const result = await checkUsername('taken_username');
            expect(fetch).toHaveBeenCalledWith("http://localhost:3000/check-username?username=taken_username");
            expect(result).toBe("Username is taken");
        });
    });

    describe("registerUser", () => {
        it("should return data when registration is successful", async () => {
            const mockResponse: RegisterResponse = { success: true, message: "User registered successfully" };

            (fetch as jest.Mock).mockResolvedValue({
                status: 200,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            const result = await registerUser('new_username');
            expect(fetch).toHaveBeenCalledWith("http://localhost:3000/register", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'new_username' }),
            });
            expect(result).toEqual(mockResponse);
        });

        it("should return an error message if registration fails", async () => {
            const mockErrorResponse = { error: "Registration failed" };

            (fetch as jest.Mock).mockResolvedValue({
                status: 400,
                json: jest.fn().mockResolvedValue(mockErrorResponse),
                statusText: "Bad Request",
            });

            const result = await registerUser('invalid_username');
            expect(fetch).toHaveBeenCalledWith("http://localhost:3000/register", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'invalid_username' }),
            });
            expect(result).toBe("Registration failed");
        });
    });
});
