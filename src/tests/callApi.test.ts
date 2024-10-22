import { checkUsername, registerUser } from '../callApi';
import { successAlert, errorAlert } from '../swalAlerts';
import { responseMessages } from '../constants';

// Mocking global fetch
global.fetch = jest.fn();

// Mocking success and error alerts
jest.mock('../swalAlerts', () => ({
    successAlert: jest.fn(),
    errorAlert: jest.fn(),
}));

describe('API Functions', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    describe('checkUsername', () => {
        it('should return data when the username check is successful', async () => {
            const mockResponse = { available: true };

            // Mock fetch for successful response
            (fetch as jest.Mock).mockResolvedValue({
                status: 200,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            const result = await checkUsername('valid_username');

            // Check if fetch was called correctly
            expect(fetch).toHaveBeenCalledWith('http://localhost:3000/check-username?username=valid_username');

            // Validate the result
            expect(result).toEqual(mockResponse);

            // Ensure errorAlert is not called
            expect(errorAlert).not.toHaveBeenCalled();
        });

        it('should throw an error and call errorAlert when the username check fails', async () => {
            const mockErrorResponse = { error: 'Username is already taken' };

            // Mock fetch for failed response
            (fetch as jest.Mock).mockResolvedValue({
                status: 400,
                json: jest.fn().mockResolvedValue(mockErrorResponse),
            });

            await expect(checkUsername('taken_username')).rejects.toThrow('Username is already taken');

            // Check if errorAlert was called with the correct message
            expect(errorAlert).toHaveBeenCalledWith('Username is already taken');
        });
    });

    describe('registerUser', () => {
        it('should return data and call successAlert when registration is successful', async () => {
            const mockResponse = { success: true };

            // Mock fetch for successful response
            (fetch as jest.Mock).mockResolvedValue({
                status: 200,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            const result = await registerUser('new_username');

            // Check if fetch was called correctly
            expect(fetch).toHaveBeenCalledWith('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: 'new_username' }),
            });

            // Validate the result
            expect(result).toEqual(mockResponse);

            // Ensure successAlert was called with the correct message
            expect(successAlert).toHaveBeenCalledWith(responseMessages.registerUserSuccess);

            // Ensure errorAlert was not called
            expect(errorAlert).not.toHaveBeenCalled();
        });

        it('should throw an error and call errorAlert when registration fails', async () => {
            const mockErrorResponse = { error: 'Registration failed' };

            // Mock fetch for failed response
            (fetch as jest.Mock).mockResolvedValue({
                status: 400,
                json: jest.fn().mockResolvedValue(mockErrorResponse),
            });

            await expect(registerUser('invalid_username')).rejects.toThrow('Registration failed');

            // Check if errorAlert was called with the correct message
            expect(errorAlert).toHaveBeenCalledWith('Registration failed');

            // Ensure successAlert was not called
            expect(successAlert).not.toHaveBeenCalled();
        });
    });
});
