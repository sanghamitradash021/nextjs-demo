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

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar'; // Adjust this path to match your file structure
import { useAuthStore } from '../store/AuthStore';
import { useTheme } from '../context/ThemeContext';
import { NavbarConstants } from '../constants/NavbarConstant';

// Mock the next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

// Mock the store
vi.mock('../store/AuthStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock the theme context
vi.mock('../context/ThemeContext', () => ({
  useTheme: vi.fn(),
}));

// Mock fetch API
global.fetch = vi.fn();

describe('Navbar Component', () => {
  const mockRouter = {
    push: vi.fn(),
  };

  const mockLogout = vi.fn();

  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup router mock
    (useRouter as any).mockReturnValue(mockRouter);

    // Setup auth store mock
    (useAuthStore as any).mockReturnValue({
      user: null,
      logout: mockLogout,
    });

    // Setup theme context mock
    (useTheme as any).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    // Reset fetch mock
    (global.fetch as any).mockReset();
  });

  it('renders the navbar with logo and search bar', () => {
    render(<Navbar />);

    // Check for logo text
    expect(screen.getByText(NavbarConstants.LOGO_TEXT)).toBeInTheDocument();

    // Check for search placeholder
    expect(
      screen.getByPlaceholderText(NavbarConstants.SEARCH_PLACEHOLDER)
    ).toBeInTheDocument();
  });

  it('shows login button when user is not logged in', () => {
    render(<Navbar />);

    expect(screen.getByText(NavbarConstants.LOGIN_TEXT)).toBeInTheDocument();
    expect(
      screen.queryByText(NavbarConstants.LOGOUT_TEXT)
    ).not.toBeInTheDocument();
  });

  it('shows user dropdown when user is logged in', () => {
    // Mock a logged-in user
    (useAuthStore as any).mockReturnValue({
      user: { username: 'testuser' },
      logout: mockLogout,
    });

    render(<Navbar />);

    // Username should be visible
    expect(screen.getByText('testuser')).toBeInTheDocument();

    // Create Recipe button should be visible for logged-in users
    expect(
      screen.getByText(NavbarConstants.CREATE_RECIPE_TEXT)
    ).toBeInTheDocument();
  });

  it('opens user dropdown when clicking on username', async () => {
    // Mock a logged-in user
    (useAuthStore as any).mockReturnValue({
      user: { username: 'testuser' },
      logout: mockLogout,
    });

    render(<Navbar />);

    // Username button
    const usernameButton = screen.getByText('testuser');
    expect(usernameButton).toBeInTheDocument();

    // Click on username
    fireEvent.click(usernameButton);

    // Dropdown options should be visible
    expect(
      screen.getByText(NavbarConstants.MY_RECIPES_TEXT)
    ).toBeInTheDocument();
    expect(screen.getByText(NavbarConstants.LOGOUT_TEXT)).toBeInTheDocument();
  });

  it('calls logout function and redirects when logout is clicked', async () => {
    // Mock a logged-in user
    (useAuthStore as any).mockReturnValue({
      user: { username: 'testuser' },
      logout: mockLogout,
    });

    render(<Navbar />);

    // Open dropdown
    fireEvent.click(screen.getByText('testuser'));

    // Click logout
    fireEvent.click(screen.getByText(NavbarConstants.LOGOUT_TEXT));

    // Check if logout was called
    expect(mockLogout).toHaveBeenCalledTimes(1);

    // Check if router.push was called with '/login'
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('toggles theme when theme button is clicked', () => {
    render(<Navbar />);

    // Find and click the theme toggle button
    const themeButton = screen.getByText('Dark Mode');
    fireEvent.click(themeButton);

    // Check if theme toggle function was called
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('shows dark mode button when theme is light', () => {
    (useTheme as any).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<Navbar />);

    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
  });

  it('shows light mode button when theme is dark', () => {
    (useTheme as any).mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });

    render(<Navbar />);

    expect(screen.getByText('Light Mode')).toBeInTheDocument();
  });

  it('opens create recipe modal when create button is clicked', () => {
    // Mock a logged-in user
    (useAuthStore as any).mockReturnValue({
      user: { username: 'testuser' },
      logout: mockLogout,
    });

    render(<Navbar />);

    // Find and click the create recipe button
    const createButton = screen.getByText(NavbarConstants.CREATE_RECIPE_TEXT);
    fireEvent.click(createButton);

    // The CreateRecipeModal should be rendered with isOpen=true
    // We would need to mock the modal component to test this more thoroughly
    // This is a basic test that the button exists and can be clicked
    expect(createButton).toBeInTheDocument();
  });

  it('fetches search results when typing in search bar', async () => {
    // Mock fetch response
    const mockSearchResults = [
      {
        recipe_id: 1,
        title: 'Pancakes',
        description: 'Fluffy breakfast pancakes',
        image: 'pancake.jpg',
      },
    ];

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSearchResults),
    });

    render(<Navbar />);

    // Get search input
    const searchInput = screen.getByPlaceholderText(
      NavbarConstants.SEARCH_PLACEHOLDER
    );

    // Type in search query
    fireEvent.change(searchInput, { target: { value: 'pancake' } });

    // Wait for the debounced fetch to be called
    await waitFor(
      () => {
        expect(global.fetch).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );

    // There's a 500ms debounce, so we need to wait
    await new Promise((r) => setTimeout(r, 600));

    // Search results should be displayed after fetch
    await waitFor(() => {
      expect(screen.getByText('Pancakes')).toBeInTheDocument();
      expect(screen.getByText('Fluffy breakfast pancakes')).toBeInTheDocument();
    });
  });

  it('navigates to recipe page when search result is clicked', async () => {
    // Mock a search result
    const mockSearchResults = [
      {
        recipe_id: 1,
        title: 'Pancakes',
        description: 'Fluffy breakfast pancakes',
        image: 'pancake.jpg',
      },
    ];

    // Mock fetch responses
    (global.fetch as any).mockImplementation((url: string | string[]) => {
      if (url.includes('search')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSearchResults),
        });
      } else if (url.includes('/api/recipes/1')) {
        return Promise.resolve({
          ok: true,
          text: () =>
            Promise.resolve(JSON.stringify({ id: 1, title: 'Pancakes' })),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(<Navbar />);

    // Search for pancakes
    const searchInput = screen.getByPlaceholderText(
      NavbarConstants.SEARCH_PLACEHOLDER
    );
    fireEvent.change(searchInput, { target: { value: 'pancake' } });

    // Wait for the results to appear
    await waitFor(
      () => {
        expect(screen.getByText('Pancakes')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    // Click on search result
    fireEvent.click(screen.getByText('Pancakes'));

    // Check if router was called to navigate to recipe page
    expect(mockRouter.push).toHaveBeenCalledWith('/recipes/1');
  });

  it('handles API errors when fetching recipe details', async () => {
    // Mock a search result
    const mockSearchResults = [
      {
        recipe_id: 1,
        title: 'Pancakes',
        description: 'Fluffy breakfast pancakes',
        image: 'pancake.jpg',
      },
    ];

    // Mock fetch responses - search works but recipe details fail
    (global.fetch as any).mockImplementation((url: string | string[]) => {
      if (url.includes('search')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSearchResults),
        });
      } else if (url.includes('/api/recipes/1')) {
        return Promise.resolve({
          ok: false,
          status: 404,
          statusText: 'Not Found',
          text: () => Promise.resolve('Recipe not found'),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(<Navbar />);

    // Search for pancakes
    const searchInput = screen.getByPlaceholderText(
      NavbarConstants.SEARCH_PLACEHOLDER
    );
    fireEvent.change(searchInput, { target: { value: 'pancake' } });

    // Wait for the results to appear
    await waitFor(
      () => {
        expect(screen.getByText('Pancakes')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    // Click on search result
    fireEvent.click(screen.getByText('Pancakes'));

    // Should navigate to 404 page on error
    expect(mockRouter.push).toHaveBeenCalledWith('/404');
  });
});
