Here’s a detailed `component.md` for your project in the style you requested:

```markdown
# Components Documentation

This document provides detailed information about the components used in the application.

## Table of Contents

- [Overview](#overview)
- [Component Structure](#component-structure)
- [UI Components](#ui-components)
- [Authentication Components](#authentication-components)
- [Recipe Components](#recipe-components)
- [Dashboard Components](#dashboard-components)
- [Error Handling Components](#error-handling-components)
- [Protected Route Components](#protected-route-components)
- [Best Practices](#best-practices)

## Overview

The application uses a component-based architecture with React and Next.js. Components are organized by feature and functionality, promoting reusability and maintainability. All components are written in TypeScript, providing type safety and better developer experience.

## Component Structure

The components are organized in the following structure:
```

components/
├── auth/ # Authentication components
│ ├── signin/ # Sign-in form components
│ └── signup/ # Sign-up form components
├── dashboard/ # Dashboard components
├── error/ # Error handling components
├── home/ # Home page components
├── recipe/ # Recipe-related components
│ ├── create/ # Recipe creation components
│ ├── edit/ # Recipe editing components
│ └── list/ # Recipe list components
├── protected/ # Protected route components
└── ui/ # Reusable UI components

````

## UI Components

The `ui` directory contains reusable UI components that are used throughout the application.

### Button Component

The Button component provides a consistent button style across the application.

**File:** `/components/ui/button.tsx`

**Props:**
- `children`: React nodes to be rendered inside the button
- `className`: Additional CSS classes to apply to the button
- All standard HTML button attributes

**Example:**
```tsx
import { Button } from '@/components/ui/button';

function MyComponent() {
  return (
    <Button
      onClick={() => console.log('Button clicked')}
      className="mt-4"
      disabled={isLoading}
    >
      Submit
    </Button>
  );
}
````

### Loader Component

The Loader component shows a loading spinner while waiting for a request to complete.

**File:** `/components/ui/loader.tsx`

**Props:**

- `size`: The size of the spinner (small, medium, large)
- `message`: A custom message to display next to the spinner

**Example:**

```tsx
import { Loader } from '@/components/ui/loader';

function MyComponent() {
  return <Loader size="large" message="Loading..." />;
}
```

### Error Message Component

The Error Message component displays error messages in a consistent format.

**File:** `/components/ui/error-message.tsx`

**Props:**

- `message`: The error message to display
- `className`: Additional CSS classes to apply to the error message

**Example:**

```tsx
import { ErrorMessage } from '@/components/ui/error-message';

function MyForm() {
  return (
    <form>
      <input type="text" name="username" />
      {errors.username && <ErrorMessage message={errors.username} />}
    </form>
  );
}
```

## Authentication Components

The `auth` directory contains components related to user authentication.

### Sign In Component

The Sign In component provides a form for user login.

**File:** `/components/auth/signin/index.tsx`

**Features:**

- Email and password input fields with validation
- Password visibility toggle
- Form submission with loading state
- Error handling and display
- Navigation to sign-up page

**Example:**

```tsx
import LoginComponent from '@/components/auth/signin';

function LoginPage() {
  return (
    <div>
      <h1>Login to Your Account</h1>
      <LoginComponent />
    </div>
  );
}
```

### Sign Up Component

The Sign Up component provides a form for user registration.

**File:** `/components/auth/signup/index.tsx`

**Features:**

- Input fields for name, email, and password with validation
- Password visibility toggle
- Form submission with loading state
- Error handling and display
- Navigation to sign-in page

**Example:**

```tsx
import SignupComponent from '@/components/auth/signup';

function SignupPage() {
  return (
    <div>
      <h1>Create Your Account</h1>
      <SignupComponent />
    </div>
  );
}
```

## Recipe Components

The `recipe` directory contains components related to recipe management.

### Create Recipe Component

The Create Recipe component allows users to create new recipes.

**File:** `/components/recipe/create/index.tsx`

**Features:**

- Input fields for recipe name, ingredients, and instructions
- Image upload with Cloudinary
- Recipe category selection
- Error handling and display

**Example:**

```tsx
import CreateRecipeComponent from '@/components/recipe/create';

function CreateRecipePage() {
  return (
    <div>
      <h1>Create a New Recipe</h1>
      <CreateRecipeComponent />
    </div>
  );
}
```

### Edit Recipe Component

The Edit Recipe component allows users to modify existing recipes.

**File:** `/components/recipe/edit/index.tsx`

**Features:**

- Pre-filled input fields with recipe data
- Image upload with Cloudinary
- Recipe category selection
- Error handling and display

**Example:**

```tsx
import EditRecipeComponent from '@/components/recipe/edit';

function EditRecipePage({ recipeId }) {
  return (
    <div>
      <h1>Edit Recipe</h1>
      <EditRecipeComponent recipeId={recipeId} />
    </div>
  );
}
```

### Recipe List Component

The Recipe List component displays a list of recipes.

**File:** `/components/recipe/list/index.tsx`

**Features:**

- Displays a list of recipes with pagination
- Filters recipes by category or tag
- Recipe search functionality
- Error handling

**Example:**

```tsx
import RecipeListComponent from '@/components/recipe/list';

function RecipeListPage() {
  return (
    <div>
      <h1>Recipe List</h1>
      <RecipeListComponent />
    </div>
  );
}
```

## Dashboard Components

The `dashboard` directory contains components related to the user dashboard.

### Dashboard Component

The Dashboard component displays an overview of the user's recipes, comments, and ratings.

**File:** `/components/dashboard/index.tsx`

**Features:**

- Display statistics such as the number of recipes, comments, and ratings
- Quick actions for creating or editing recipes
- Recent activity display

**Example:**

```tsx
import DashboardComponent from '@/components/dashboard';

function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardComponent />
    </div>
  );
}
```

## Error Handling Components

The `error` directory contains components related to error handling.

### Error Boundary Component

The Error Boundary component catches JavaScript errors in child components and displays a fallback UI.

**File:** `/components/error/ErrorBoundary.tsx`

**Features:**

- Catches JavaScript errors in child components
- Displays a fallback UI when an error occurs
- Provides a way to reset the error state

**Example:**

```tsx
import ErrorBoundary from '@/components/error/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

## Protected Route Components

The `protected` directory contains components related to route protection.

### Protected Route Component

The Protected Route component ensures that only authenticated users can access certain routes.

**File:** `/components/protected/protected-route.tsx`

**Features:**

- Checks if the user is authenticated
- Redirects to the login page if the user is not authenticated
- Displays a loading state while checking authentication

**Example:**

```tsx
import ProtectedRoute from '@/components/protected/protected-route';

function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardComponent />
    </ProtectedRoute>
  );
}
```

## Best Practices

When working with components in this application, follow these best practices:

1. **Component Organization**: Keep components organized by feature and functionality.

2. **Component Naming**: Use descriptive names for components that reflect their purpose.

3. **Component Size**: Keep components small and focused on a single responsibility.

4. **Props**: Define prop types using TypeScript interfaces for better type safety.

5. **State Management**: Use React hooks for state management within components.

6. **Error Handling**: Use error boundaries to catch and handle errors gracefully.

7. **Accessibility**: Ensure components are accessible by using semantic HTML and ARIA attributes.

8. **Testing**: Write tests for components to ensure they work as expected.

9. **Documentation**: Document components with JSDoc comments for better code understanding.

10. **Reusability**: Create reusable components that can be used in multiple places.

11. **Performance**: Optimize components for performance by using React.memo, useMemo, and useCallback where appropriate.

12. **Styling**: Use Tailwind CSS for styling components, following the project's design system.

```

This should help you document your components effectively and keep your project organized!
```
