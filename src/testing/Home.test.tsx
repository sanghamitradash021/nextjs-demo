import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Home from '../app/page'; // Adjust the import path as needed
import { ThemeProvider } from '@/context/ThemeContext';
import * as HomePageServices from '../services/HomePage';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock the next/navigation module
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

// Mock the Swiper components
vi.mock('swiper/react', () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper">{children}</div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper-slide">{children}</div>
  ),
}));

// Mock the swiper modules
vi.mock('swiper/modules', () => ({
  Navigation: vi.fn(),
  Pagination: vi.fn(),
  Autoplay: vi.fn(),
}));

// Mock the swiper CSS
vi.mock('swiper/swiper-bundle.css', () => ({}));

// Mock the HomeConstants
vi.mock('../constants/HomeConstant', () => ({
  HomeConstants: {
    cuisineTypes: ['Italian', 'Indian', 'Mexican', 'Chinese'],
    featuredCategories: [
      { name: 'Breakfast', image: '/breakfast.jpg' },
      { name: 'Lunch', image: '/lunch.jpg' },
      { name: 'Dinner', image: '/dinner.jpg' },
      { name: 'Dessert', image: '/dessert.jpg' },
    ],
  },
}));

// Mock the ThemeContext
vi.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock axios
vi.mock('axios');

// Sample recipe data for testing
const mockRecipes = [
  {
    recipe_id: 1,
    title: 'Spaghetti Carbonara',
    description: 'Classic Italian pasta dish',
    image: '/spaghetti.jpg',
    cuisine: 'Italian',
    mealType: 'Dinner',
  },
  {
    recipe_id: 2,
    title: 'Chicken Curry',
    description: 'Spicy Indian curry',
    image: '/curry.jpg',
    cuisine: 'Indian',
    mealType: 'Dinner',
  },
];

describe('Home Component', () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    // Mock router
    (useRouter as any).mockReturnValue({
      push: pushMock,
    });

    // Mock search params
    (useSearchParams as any).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    });

    // Mock the API calls
    vi.spyOn(HomePageServices, 'fetchAllRecipes').mockResolvedValue(
      mockRecipes
    );
    vi.spyOn(HomePageServices, 'fetchCuisineTypeRecipes').mockResolvedValue(
      mockRecipes
    );
    vi.spyOn(HomePageServices, 'fetchMealTypeRecipes').mockResolvedValue(
      mockRecipes
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the home page correctly', async () => {
    render(<Home />);

    // Check for section headings
    expect(screen.getByText('Featured Categories')).toBeInTheDocument();
    expect(screen.getByText('Popular Cuisines')).toBeInTheDocument();
    expect(screen.getByText('All Recipes')).toBeInTheDocument();

    // Wait for recipes to load
    await waitFor(() => {
      expect(HomePageServices.fetchAllRecipes).toHaveBeenCalledTimes(1);
    });
  });

  it('displays recipes when they are loaded', async () => {
    render(<Home />);

    // Wait for the recipes to be displayed
    await waitFor(() => {
      expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
      expect(screen.getByText('Chicken Curry')).toBeInTheDocument();
    });
  });

  it('navigates to recipe detail page when a recipe is clicked', async () => {
    render(<Home />);

    // Wait for recipes to load
    await waitFor(() => {
      expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
    });

    // Click on a recipe
    fireEvent.click(screen.getByText('Spaghetti Carbonara'));

    // Check if router.push was called with the correct path
    expect(pushMock).toHaveBeenCalledWith('/recipes/1');
  });

  it('loads meal type recipes when a category is clicked', async () => {
    render(<Home />);

    // Wait for the categories to be displayed
    await waitFor(() => {
      // Find all swiper slides
      const swiperSlides = screen.getAllByTestId('swiper-slide');
      // Click on the first category (Breakfast)
      const firstCategoryDiv = swiperSlides[0].querySelector('div');
      if (firstCategoryDiv) {
        fireEvent.click(firstCategoryDiv);
      }
    });

    // Check if fetchMealTypeRecipes was called
    await waitFor(() => {
      expect(HomePageServices.fetchMealTypeRecipes).toHaveBeenCalledWith(
        'Breakfast'
      );
    });
  });

  it('navigates to all recipes page when "View All" button is clicked', async () => {
    render(<Home />);

    // Find the "View All" button in the All Recipes section
    const viewAllButtons = screen.getAllByText('View All');
    fireEvent.click(viewAllButtons[viewAllButtons.length - 1]); // Last "View All" button

    // Check if router.push was called with the correct path
    expect(pushMock).toHaveBeenCalledWith('/recipes');
  });

  it('displays meal type recipes section when initialMealType is provided', async () => {
    // Set initial meal type
    (useSearchParams as any).mockReturnValue({
      get: vi.fn().mockReturnValue('Breakfast'),
    });

    render(<Home />);

    // Check for the meal type section heading
    await waitFor(() => {
      expect(screen.getByText('Breakfast Recipes')).toBeInTheDocument();
    });
  });

  it('navigates to cuisine page when a cuisine is clicked', async () => {
    render(<Home />);

    // Wait for the cuisines to be displayed
    await waitFor(() => {
      // Find the Italian cuisine and click it
      const italianElement = screen.getByText('Italian');
      fireEvent.click(italianElement);
    });

    // Check if router.push was called with the correct path
    expect(pushMock).toHaveBeenCalledWith('/recipes/cuisine/Italian');
  });

  it('handles API errors gracefully', async () => {
    // Mock API failure
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(HomePageServices, 'fetchAllRecipes').mockRejectedValue(
      new Error('API error')
    );

    render(<Home />);

    // Wait to ensure the error handler has been called
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });

    // Component should still render without crashing
    expect(screen.getByText('Featured Categories')).toBeInTheDocument();
  });

  it('shows "No recipes found" message when meal type has no recipes', async () => {
    // Mock empty recipe list for a meal type
    vi.spyOn(HomePageServices, 'fetchMealTypeRecipes').mockResolvedValue([]);

    // Set initial meal type
    (useSearchParams as any).mockReturnValue({
      get: vi.fn().mockReturnValue('Breakfast'),
    });

    render(<Home />);

    // Check for the "No recipes found" message
    await waitFor(() => {
      expect(
        screen.getByText('No recipes found for Breakfast.')
      ).toBeInTheDocument();
    });
  });

  it('navigates to meal type page when "View All" button in meal type section is clicked', async () => {
    // Set initial meal type
    (useSearchParams as any).mockReturnValue({
      get: vi.fn().mockReturnValue('Breakfast'),
    });

    render(<Home />);

    // Wait for the meal type section to be displayed
    await waitFor(() => {
      expect(screen.getByText('Breakfast Recipes')).toBeInTheDocument();
    });

    // Find the "View All" button in the meal type section and click it
    const mealTypeViewAllButton = screen.getAllByText('View All')[0]; // First "View All" button
    fireEvent.click(mealTypeViewAllButton);

    // Check if router.push was called with the correct path
    expect(pushMock).toHaveBeenCalledWith('/recipes/meal-type/Breakfast');
  });
});
