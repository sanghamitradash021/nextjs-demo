// import { describe, it, expect, afterEach, vi } from 'vitest';
// import { Request } from 'node-fetch';
// import { NextResponse } from 'next/server';
// import * as UserRepository from '../lib/repository/userRepository'; // Adjust path to match your repo
// import { POST as login } from '../app/api/users/login/route'; // Adjust path to match your API

// // Mock the UserRepository
// vi.mock('../lib/repository/userRepository', () => ({
//   validateCredentials: vi.fn(), // Mock the validateCredentials function
// }));




// vi.stubEnv('JWT_SECRET', 'your_secret_key_here');

// describe('POST /login', () => {
//   afterEach(() => {
//     vi.restoreAllMocks();
//   });

//   it('should return a token for valid credentials', async () => {
//     const mockUser = {
//       user_id: 1,
//       username: 'testuser',
//       email: 'test@example.com',
//       fullname: 'Test User',
//       password: '$2b$10$hashedpassword', // Replace with a valid bcrypt hash
//     };

//     // Mock the return value of validateCredentials
//     vi.spyOn(UserRepository, 'validateCredentials').mockResolvedValue(mockUser as any); // Use `as any` here to bypass type checking

//     const req = new Request('http://localhost:3000/api/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         email: 'test@example.com',
//         password: 'correctpassword',
//       }), 
//     });

//     const res = await login(req as any); // Use `as any` to bypass type checking for the request object

//     const responseJson = await res.json();
//     expect(res.status).toBe(200);
//     expect(responseJson).toHaveProperty('token');
//     expect(responseJson.user).toEqual({
//       id: mockUser.user_id,
//       username: mockUser.username,
//       email: mockUser.email,
//       fullname: mockUser.fullname,
//     });
//   });

//   it('should return 400 for missing fields', async () => {
//     const req = new Request('http://localhost:3000/api/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email: 'test@example.com' }), // Missing password
//     });

//     const res = await login(req as any); // Use `as any` to bypass type checking for the request object
//     const responseJson = await res.json();

//     expect(res.status).toBe(400);
//     expect(responseJson).toEqual({ message: 'Email and password are required' });
//   });

//   it('should return 400 for invalid credentials', async () => {
//     // Mock invalid credentials
//     vi.spyOn(UserRepository, 'validateCredentials').mockResolvedValue(null as any); // Return `null` using `as any`

//     const req = new Request('http://localhost:3000/api/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         email: 'wrong@example.com',
//         password: 'wrongpassword',
//       }),
//     });

//     const res = await login(req as any); // Use `as any` to bypass type checking for the request object
//     const responseJson = await res.json();

//     expect(res.status).toBe(400);
//     expect(responseJson).toEqual({ message: 'Invalid credentials' });
//   });

//   it('should return 500 if an error occurs', async () => {
//     // Mock the function to throw an error
//     vi.spyOn(UserRepository, 'validateCredentials').mockRejectedValue(new Error('Internal server error') as any); // Use `as any` for error

//     const req = new Request('http://localhost:3000/api/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         email: 'test@example.com',
//         password: 'correctpassword',
//       }),
//     });

//     const res = await login(req as any); // Use `as any` to bypass type checking for the request object
//     const responseJson = await res.json();

//     expect(res.status).toBe(500);
//     expect(responseJson).toEqual({ message: 'Error logging in', error: expect.any(Error) });
//   });
// });


import { describe, it, expect, vi, afterEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { POST } from '../app/api/users/login/route'; // Adjust the path to your route handler
import * as AuthModule from "../store/AuthStore"; // Import the entire auth module
import UserRepository from '../lib/repository/userRepository'; // Import the UserRepository

// Mock the next/headers module for cookies
vi.mock('next/headers', () => ({
  cookies: () => ({
    set: vi.fn(),
  }),
}));

// Mock the UserRepository methods
vi.mock('@/repositories/userRepository', () => ({
  findByEmail: vi.fn(),
  validateCredentials: vi.fn(),
}));

describe('/api/users/login Tests', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 200 and user data on successful login', async () => {
    const mockDbUser = {
      user_id: 9,
      username: 'cruise',
      email: 'cruise@gmail.com',
      fullname: 'Cruise Ship',
      // Include any other required properties your UserRepository returns
    };

    // This is what your API actually returns
    const expectedResponseUser = {
      id: mockDbUser.user_id,
      username: mockDbUser.username,
      email: mockDbUser.email,
      fullname: mockDbUser.fullname,
    };

    // Mock validateCredentials to return the database user
    vi.spyOn(UserRepository, 'validateCredentials').mockResolvedValue(mockDbUser as any);

    const req = new NextRequest('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: "cruise@gmail.com", password: "password123" }),
    });

    const res = await POST(req);

    if (res) {
      const responseJson = await res.json();
      expect(res.status).toBe(200);
      expect(responseJson).toHaveProperty('user');
      expect(responseJson).toHaveProperty('token');
      // Compare the full user object with what your API actually returns
      expect(responseJson.user).toEqual(expectedResponseUser);
      // You can check token exists but not its exact value since it's generated dynamically
      expect(typeof responseJson.token).toBe('string');
    } else {
      throw new Error('Response is undefined');
    }
  });

  it('should return 400 if email or password is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: "johndoe@example.com" }), // Missing password
    });

    const res = await POST(req);

    if (res) {
      const responseJson = await res.json();
      expect(res.status).toBe(400);
      expect(responseJson).toEqual({ message: "Email and password are required" });
    } else {
      throw new Error('Response is undefined');
    }
  });

  it('should return 400 for invalid credentials', async () => {
    // Mock invalid credentials response
    vi.spyOn(UserRepository, 'validateCredentials').mockResolvedValue(null);

    const req = new NextRequest('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: "wrongemail@example.com", password: "wrongpassword" }),
    });

    const res = await POST(req);

    if (res) {
      const responseJson = await res.json();
      expect(res.status).toBe(400);
      expect(responseJson).toEqual({ message: "Invalid credentials" });
    } else {
      throw new Error('Response is undefined');
    }
  });

  it('should return 500 if there is a server error', async () => {
    // Mock a server error during validation
    vi.spyOn(UserRepository, 'validateCredentials').mockRejectedValue(new Error('Internal server error'));

    const req = new NextRequest('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: "cruise@gmail.com", password: "password123" }),
    });

    const res = await POST(req);

    if (res) {
      const responseJson = await res.json();
      expect(res.status).toBe(500);
      // Instead of expecting an Error object, just check that the error property exists
      expect(responseJson.message).toBe("Error logging in");
      expect(responseJson).toHaveProperty('error');
    } else {
      throw new Error('Response is undefined');
    }
  });
});
