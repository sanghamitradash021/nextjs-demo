'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';
import { LoginConstants } from '../../../constants/LoginConstant';
import { useAuth } from '@/context/AuthContext';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState('');

  const onSubmit = async (formData: any) => {
    setError('');
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || 'Login failed');
      }

      const data = await response.json();

      // Store token in cookies
      Cookies.set('auth_token', data.token, { expires: 7, path: '/' });

      // Update auth state
      login(data.user, data.token);

      toast.success(LoginConstants.successMessage);
      router.push('/'); // Redirect to homepage
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message || LoginConstants.errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {LoginConstants.welcomeBackMessage}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {LoginConstants.signInPrompt}
          </p>
        </div>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                id="email"
                type="email"
                placeholder={LoginConstants.emailPlaceholder}
                {...register('email', { required: 'Email is required' })}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.email?.message && (
                <p className="text-red-500 text-sm">
                  {String(errors.email?.message)}
                </p>
              )}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                id="password"
                type="password"
                placeholder={LoginConstants.passwordPlaceholder}
                {...register('password', { required: 'Password is required' })}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.password?.message && (
                <p className="text-red-500 text-sm">
                  {String(errors.password?.message)}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            {LoginConstants.buttonText}
          </button>
        </form>

        <div className="text-center">
          <a
            href="/sign-up"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            {LoginConstants.signUpPrompt}
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
