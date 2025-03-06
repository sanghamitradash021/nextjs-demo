// HomeConstant.ts

type Cuisine = string;

export const HomeConstants = {
    cuisineTypes: [
        'Italian',
        'Indian',
        'Chinese',
        'Mexican',
        'Japanese',
        'American',
        'Thai',
        'Anglo-Indian',
    ] as Cuisine[],

    // cuisineTypes: ['Italian', 'Chinese', 'Mexican', 'Indian'] as Cuisine[],
    featuredCategories: [
        { name: 'Breakfast', image: '/assets/breakfast.jpeg' },
        { name: 'Healthy', image: '/assets/healthy.jpeg' },
        { name: 'Vegetarian', image: '/assets/vegetarian.jpeg' },
        { name: 'Desserts', image: '/assets/dessert.jpeg' },
        { name: 'Lunch', image: '/assets/lunch.jpeg' },
        { name: 'Dinner', image: '/assets/dinner.jpeg' },
    ],
    mealTypes: [
        { id: 1, name: 'Breakfast' },
        { id: 2, name: 'Lunch' },
        { id: 3, name: 'Dinner' },
        { id: 4, name: 'Snack' },
    ],
};
