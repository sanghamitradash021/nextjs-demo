export const CLOUDINARY_URL =
  process.env.NEXT_PUBLIC_CLOUDINARY_URL ||
  'https://api.cloudinary.com/v1_1/dmenponou/image/upload';
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'image_upload';

export const DEFAULT_FORM_DATA = {
  title: '',
  description: '',
  ingredients: '',
  instructions: '',
  preparationTime: '',
  difficulty: 'medium',
  mealType: 'lunch',
  cuisine: 'indian',
  image: null as File | null, // Image file
};

export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export const MEAL_TYPE_OPTIONS = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
  { value: 'dessert', label: 'Dessert' },
];

export const CUISINE_OPTIONS = [
  { value: 'indian', label: 'Indian' },
  { value: 'italian', label: 'Italian' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'thai', label: 'Thai' },
  { value: 'american', label: 'American' },
  { value: 'anglo-indian', label: 'Anglo-Indian' },
];

// Use relative API paths for Next.js API routes
export const API_ENDPOINTS = {
  CREATE_RECIPE: '/api/recipes/create',
};

export const LABELS = {
  CREATE_RECIPE_TITLE: 'Create Your Culinary Masterpiece',
  ERROR_HEADING: 'Oops! Something went wrong:',
  RECIPE_TITLE: 'Recipe Title',
  PREPARATION_TIME: 'Preparation Time (minutes)',
  DESCRIPTION: 'Description',
  INGREDIENTS: 'Ingredients',
  INSTRUCTIONS: 'Instructions',
  DIFFICULTY: 'Difficulty',
  MEAL_TYPE: 'Meal Type',
  CUISINE: 'Cuisine',
  RECIPE_IMAGE: 'Recipe Image',
  CANCEL_BUTTON: 'Cancel',
  CREATE_BUTTON: 'Create Recipe',
  CREATING_BUTTON: 'Creating...',
  IMAGE_UPLOADING: 'Uploading image...',
};
