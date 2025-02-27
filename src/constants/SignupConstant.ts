// SignupConstants.ts

export const SIGNUP_MESSAGES = {
    error: {
        registrationFailed: 'Signup failed. Please try again.',
        validationError: 'All fields are required.',
    },
    success: {
        accountCreated: 'Account created successfully!',
    },
};

export const FORM_PLACEHOLDERS = {
    fullname: 'Full Name',
    username: 'Username',
    email: 'Email address',
    password: 'Password',
    role: 'Role',
};

export const ROLES = {
    user: 'user',
    admin: 'admin',
};

export const URLS = {
    register: 'http://localhost:3000/api/USERS/register',
};
