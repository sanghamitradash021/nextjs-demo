import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../app/api/users/register/route';
import userRepository from '../lib/repository/userRepository';
import { NextRequest, NextResponse } from 'next/server';

// Mock the userRepository
vi.mock('../lib/repository/userRepository', () => ({
    default: {
        findByEmail: vi.fn(),
        create: vi.fn(),
    },
}));

describe('POST /api/users/register', () => {
    const mockUserData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullname: 'Test User',
        role: 'user',
    };

    // Helper function to create a mock request
    function createMockRequest(body: any): NextRequest {
        return {
            json: () => Promise.resolve(body),
        } as unknown as NextRequest;
    }

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();
    });

    it('should successfully register a new user', async () => {
        // Mock the userRepository methods
        vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
        vi.mocked(userRepository.create).mockResolvedValue({ ...mockUserData, user_id: 1 } as any);

        // Create a mock request
        const req = createMockRequest(mockUserData);

        // Call the handler
        const response = await POST(req);
        const responseData = await response.json();

        // Assertions
        expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUserData.email);
        expect(userRepository.create).toHaveBeenCalledWith(mockUserData);
        expect(response.status).toBe(201);
        expect(responseData).toEqual({ message: 'Profile created successfully' });
    });

    it('should return 400 if user already exists', async () => {
        // Mock the userRepository methods
        vi.mocked(userRepository.findByEmail).mockResolvedValue({ ...mockUserData, user_id: 1 } as any);

        // Create a mock request
        const req = createMockRequest(mockUserData);

        // Call the handler
        const response = await POST(req);
        const responseData = await response.json();

        // Assertions
        expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUserData.email);
        expect(userRepository.create).not.toHaveBeenCalled();
        expect(response.status).toBe(400);
        expect(responseData).toEqual({ message: 'User already exists' });
    });

    it('should return 500 if user creation fails', async () => {
        // Mock the userRepository methods
        vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
        vi.mocked(userRepository.create).mockResolvedValue(null);

        // Create a mock request
        const req = createMockRequest(mockUserData);

        // Call the handler
        const response = await POST(req);
        const responseData = await response.json();

        // Assertions
        expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUserData.email);
        expect(userRepository.create).toHaveBeenCalledWith(mockUserData);
        expect(response.status).toBe(500);
        expect(responseData).toEqual({ message: 'Failed to create user' });
    });

    it('should handle errors during registration process', async () => {
        // Mock the userRepository methods to throw an error
        vi.mocked(userRepository.findByEmail).mockRejectedValue(new Error('Database error'));

        // Create a mock request
        const req = createMockRequest(mockUserData);

        // Call the handler
        const response = await POST(req);
        const responseData = await response.json();

        // Assertions
        expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUserData.email);
        expect(response.status).toBe(500);
        expect(responseData).toEqual({
            message: 'Error in registering',
            error: 'Database error'
        });
    });

    it('should handle JSON parsing errors', async () => {
        // Create a mock request that throws an error when json() is called
        const req = {
            json: () => Promise.reject(new Error('Invalid JSON')),
        } as unknown as NextRequest;

        // Call the handler
        const response = await POST(req);
        const responseData = await response.json();

        // Assertions
        expect(response.status).toBe(500);
        expect(responseData).toEqual({
            message: 'Error in registering',
            error: 'Invalid JSON'
        });
    });
});