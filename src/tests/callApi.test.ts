import { checkUsername, registerUser } from '../callApi';
import { CheckUsernameResponse, RegisterResponse } from '../interfaces';

global.fetch = jest.fn();

describe('API Functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('checkUsername', () => {
        it('should return data when the username check is successful', async () => {
            const mockResponse: CheckUsernameResponse = { available: true };

            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            const result = await checkUsername('test_username');
            expect(fetch).toHaveBeenCalledWith('http://localhost:3000/check-username?username=test_username');
            expect(result).toEqual(mockResponse);
        });

        it('should return error data if the response status is 400', async () => {
            const mockErrorResponse = { error: 'Invalid username' };

            (fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 400,
                json: jest.fn().mockResolvedValue(mockErrorResponse),
                statusText: 'Bad Request',
            });

            const result = await checkUsername('invalid_username');
            expect(fetch).toHaveBeenCalledWith('http://localhost:3000/check-username?username=invalid_username');
            expect(result).toEqual(mockErrorResponse);
        });

        it('should throw an error for other status codes', async () => {
            (fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 500,
                json: jest.fn().mockResolvedValue({}),
                statusText: 'Internal Server Error',
            });

            await expect(checkUsername('server_error_username')).rejects.toThrow('Internal Server Error');
            expect(fetch).toHaveBeenCalledWith('http://localhost:3000/check-username?username=server_error_username');
        });
    });

    describe('registerUser', () => {
        it('should return data when registration is successful', async () => {
            const mockResponse: RegisterResponse = { success: true, message: 'User registered successfully' };

            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            const result = await registerUser('new_username');
            expect(fetch).toHaveBeenCalledWith('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'new_username' }),
            });

            expect(result).toEqual(mockResponse);
        });

        it('should return error data if registration fails with status 400', async () => {
            const mockErrorResponse = { error: 'Registration failed' };

            (fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 400,
                json: jest.fn().mockResolvedValue(mockErrorResponse),
                statusText: 'Bad Request',
            });

            const result = await registerUser('invalid_username');
            expect(fetch).toHaveBeenCalledWith('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'invalid_username' }),
            });

            expect(result).toEqual(mockErrorResponse);
        });

        it('should throw an error for other status codes', async () => {
            (fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 500,
                json: jest.fn().mockResolvedValue({}),
                statusText: 'Internal Server Error',
            });

            await expect(registerUser('server_error_username')).rejects.toThrow('Internal Server Error');
            expect(fetch).toHaveBeenCalledWith('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'server_error_username' }),
            });
        });
    });
});
