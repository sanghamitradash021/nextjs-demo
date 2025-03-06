'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { SIGNUP_MESSAGES, FORM_PLACEHOLDERS } from '@/constants/SignupConstant';

/**
 * SignUp Component - Handles user registration.
 * @component
 * @returns {JSX.Element} Sign-up form component.
 */

const SignUp: React.FC = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handles form submission for user registration.
   * @param {Object} data - The form data.
   * @returns {Promise<void>}
   */

  const onSubmit = async (data: any) => {
    setError('');
    data = { ...data, role: 'user' };
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          responseData.message || SIGNUP_MESSAGES.error.registrationFailed
        );
      }
      toast.success(SIGNUP_MESSAGES.success.accountCreated);
      router.push('/login');
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message || SIGNUP_MESSAGES.error.registrationFailed);
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Join Our Culinary Community
        </h2>
        <p className="text-center text-sm text-gray-600">
          Create your account and start sharing recipes
        </p>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div>
            <label className="flex items-center border rounded-lg px-3 py-2 w-full bg-white shadow-sm">
              <FaUser className="text-gray-400 mr-3" />
              <Controller
                name="fullname"
                control={control}
                rules={{ required: 'Full name is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder={FORM_PLACEHOLDERS.fullname}
                    className="flex-1 outline-none"
                  />
                )}
              />
            </label>
            {errors.fullname?.message && (
              <span className="text-red-500 text-sm">
                {String(errors.fullname?.message)}
              </span>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="flex items-center border rounded-lg px-3 py-2 w-full bg-white shadow-sm">
              <FaUser className="text-gray-400 mr-3" />
              <Controller
                name="username"
                control={control}
                rules={{ required: 'Username is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder={FORM_PLACEHOLDERS.username}
                    className="flex-1 outline-none"
                  />
                )}
              />
            </label>
            {errors.username?.message && (
              <span className="text-red-500 text-sm">
                {String(errors.username?.message)}
              </span>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center border rounded-lg px-3 py-2 w-full bg-white shadow-sm">
              <FaEnvelope className="text-gray-400 mr-3" />
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    placeholder={FORM_PLACEHOLDERS.email}
                    className="flex-1 outline-none"
                  />
                )}
              />
            </label>
            {errors.email?.message && (
              <span className="text-red-500 text-sm">
                {String(errors.email?.message)}
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center border rounded-lg px-3 py-2 w-full bg-white shadow-sm">
              <FaLock className="text-gray-400 mr-3" />
              <Controller
                name="password"
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={FORM_PLACEHOLDERS.password}
                    className="flex-1 outline-none"
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </button>
            </label>
            {errors.password?.message && (
              <span className="text-red-500 text-sm">
                {String(errors.password?.message)}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Sign up
          </button>
        </form>

        <div className="text-center">
          <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
