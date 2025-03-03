import { describe, it, expect, afterEach, vi } from 'vitest';
import { Request } from 'node-fetch';
import { NextResponse } from 'next/server';
import * as UserRepository from '../lib/repository/userRepository'; // Adjust path to match your repo
import { POST as login } from '../app/api/users/login/route'; // Adjust path to match your API

// Mock the UserRepository
vi.mock('../lib/repository/userRepository', () => ({
  validateCredentials: vi.fn(), // Mock the validateCredentials function
}));

// Mock environment variables
vi.stubEnv('JWT_SECRET', 'your_secret_key_here');

describe('POST /login', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return a token for valid credentials', async () => {
    const mockUser = {
      user_id: 1,
      username: 'testuser',
      email: 'test@example.com',
      fullname: 'Test User',
      password: '$2b$10$hashedpassword', // Replace with a valid bcrypt hash
    };

    // Mock the return value of validateCredentials
    vi.spyOn(UserRepository, 'validateCredentials').mockResolvedValue(mockUser);

    const req = new Request('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'correctpassword',
      }),
    });

    const res = await login(req as any); // Assuming login is your POST handler

    const responseJson = await res.json();
    expect(res.status).toBe(200);
    expect(responseJson).toHaveProperty('token');
    expect(responseJson.user).toEqual({
      id: mockUser.user_id,
      username: mockUser.username,
      email: mockUser.email,
      fullname: mockUser.fullname,
    });
  });

  it('should return 400 for missing fields', async () => {
    const req = new Request('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }), // Missing password
    });

    const res = await login(req as any); // Assuming login is your POST handler
    const responseJson = await res.json();

    expect(res.status).toBe(400);
    expect(responseJson).toEqual({ message: 'Email and password are required' });
  });

  it('should return 400 for invalid credentials', async () => {
    // Mock invalid credentials
    vi.spyOn(UserRepository, 'validateCredentials').mockResolvedValue(null);

    const req = new Request('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      }),
    });

    const res = await login(req as any); // Assuming login is your POST handler
    const responseJson = await res.json();

    expect(res.status).toBe(400);
    expect(responseJson).toEqual({ message: 'Invalid credentials' });
  });

  it('should return 500 if an error occurs', async () => {
    // Mock the function to throw an error
    vi.spyOn(UserRepository, 'validateCredentials').mockRejectedValue(new Error('Internal server error'));

    const req = new Request('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'correctpassword',
      }),
    });

    const res = await login(req as any); // Assuming login is your POST handler
    const responseJson = await res.json();

    expect(res.status).toBe(500);
    expect(responseJson).toEqual({ message: 'Error logging in', error: expect.any(Error) });
  });
});
