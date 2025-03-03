import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import RecipeDetails from '../app/recipes/[id]/page';
import { useAuthStore } from '../store/AuthStore';
import { RecipeDetailConstants } from '../constants/RecipedetailsConstant';

// Mock the next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

// Mock the store
vi.mock('../../store/AuthStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock fetch API
global.fetch = vi.fn();

describe('RecipeDetails Component', () => {
  const mockRouter = {
    push: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup router mock
    (useRouter as any).mockReturnValue(mockRouter);

    // Reset fetch mock
    (global.fetch as any).mockReset();
  });

  it('renders the recipe details correctly', async () => {
    const mockRecipe = {
      id: 1,
      title: 'Spaghetti Carbonara',
      description: 'A classic Italian pasta dish.',
      ingredients: ['Spaghetti', 'Eggs', 'Pancetta', 'Parmesan Cheese'],
      image: 'carbonara.jpg',
      averageRating: 4.5,
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRecipe),
    });

    render(<RecipeDetails recipeId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
      expect(
        screen.getByText('A classic Italian pasta dish.')
      ).toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });
  });

  it('handles API error when fetching recipe details', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    render(<RecipeDetails recipeId={99} />);

    await waitFor(() => {
      expect(
        screen.getByText(RecipeConstants.RECIPE_NOT_FOUND)
      ).toBeInTheDocument();
    });
  });

  it('calls the API when submitting a rating', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Rating submitted' }),
    });

    render(<RecipeDetails recipeId={1} />);

    const ratingButton = screen.getByText(RecipeConstants.SUBMIT_RATING_TEXT);
    fireEvent.click(ratingButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('navigates to login page when trying to rate without authentication', async () => {
    (useAuthStore as any).mockReturnValue({ user: null });

    render(<RecipeDetails recipeId={1} />);

    const ratingButton = screen.getByText(RecipeConstants.SUBMIT_RATING_TEXT);
    fireEvent.click(ratingButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });
});
