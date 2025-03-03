// import { render, screen, fireEvent } from '@testing-library/react';
// import { beforeEach, describe, expect, it } from 'vitest';
// import Navbar from '../components/Navbar';
// import { vi } from 'vitest';

// // Mock modules **before** importing them
// vi.mock('../context/ThemeContext', async () => {
//   const actual = await vi.importActual('../context/ThemeContext');
//   return {
//     ...actual,
//     useTheme: vi.fn(),
//   };
// });

// vi.mock('../store/AuthStore', async () => {
//   const actual = await vi.importActual('../store/AuthStore');
//   return {
//     ...actual,
//     useAuthStore: vi.fn(),
//   };
// });

// // Now import them after mocking
// import { useAuthStore } from '../store/AuthStore';
// import { useTheme } from '../context/ThemeContext';

// // Mock the useRouter hook from next/navigation
// vi.mock('next/navigation', () => ({
//   useRouter: () => ({
//     push: vi.fn(),
//   }),
// }));

// describe('Navbar Component', () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   it('renders Navbar with logo text', () => {
//     (useTheme as vi.Mock).mockReturnValue({
//       theme: 'light',
//       toggleTheme: vi.fn(),
//     });
//     (useAuthStore as vi.Mock).mockReturnValue({ user: null, logout: vi.fn() });

//     render(<Navbar />);

//     expect(screen.getByText('LOGO_TEXT')).toBeInTheDocument();
//   });

//   it('displays login button when user is not authenticated', () => {
//     (useTheme as vi.Mock).mockReturnValue({
//       theme: 'light',
//       toggleTheme: vi.fn(),
//     });
//     (useAuthStore as vi.Mock).mockReturnValue({ user: null, logout: vi.fn() });

//     render(<Navbar />);
//     expect(screen.getByText('Login')).toBeInTheDocument();
//   });

//   it('displays user menu when authenticated', () => {
//     (useTheme as vi.Mock).mockReturnValue({
//       theme: 'light',
//       toggleTheme: vi.fn(),
//     });

//     (useAuthStore as vi.Mock).mockReturnValue({
//       user: { username: 'testuser' },
//       logout: vi.fn(),
//     });

//     render(<Navbar />);
//     expect(screen.getByText('testuser')).toBeInTheDocument();
//   });

//   it('calls logout function on logout button click', () => {
//     const mockLogout = vi.fn();

//     (useTheme as vi.Mock).mockReturnValue({
//       theme: 'light',
//       toggleTheme: vi.fn(),
//     });

//     (useAuthStore as vi.Mock).mockReturnValue({
//       user: { username: 'testuser' },
//       logout: mockLogout,
//     });

//     render(<Navbar />);
//     fireEvent.click(screen.getByText('testuser'));
//     fireEvent.click(screen.getByText('Logout'));

//     expect(mockLogout).toHaveBeenCalled();
//   });

//   it('calls toggleTheme function on theme button click', () => {
//     const mockToggleTheme = vi.fn();

//     (useTheme as vi.Mock).mockReturnValue({
//       theme: 'light',
//       toggleTheme: mockToggleTheme,
//     });

//     (useAuthStore as vi.Mock).mockReturnValue({ user: null, logout: vi.fn() });

//     render(<Navbar />);
//     fireEvent.click(screen.getByText('Dark Mode'));

//     expect(mockToggleTheme).toHaveBeenCalled();
//   });
// });
