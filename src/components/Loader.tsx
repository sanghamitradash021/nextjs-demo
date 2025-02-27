'use client';

import React from 'react';

/**
 * Loader component that displays a spinning loader icon.
 *
 * This component is used to show a loading animation while content is being
 * loaded or processed.
 *
 * @returns {JSX.Element} The JSX representation of the loader.
 */
const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <svg
        className="animate-spin h-12 w-12 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 118 8 8 8 0 01-8-8zm0-5a5 5 0 100 10 5 5 0 000-10z"
        ></path>
      </svg>
    </div>
  );
};

export default Loader;
