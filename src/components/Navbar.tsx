// 'use client';

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import CreateRecipeModal from './CreateRecipeModal';
// import { NavbarConstants } from '../constants/NavbarConstant';
// // import { useAuth } from '../context/AuthContext';
// import { useTheme } from '../context/ThemeContext';
// import { useAuthStore } from '../store/AuthStore';

// /**
//  * Interface representing a single search result in the navbar.
//  */
// interface SearchResult {
//   recipe_id: number;
//   title: string;
//   description: string;
//   image: string;
// }

// /**
//  * Navbar component that contains search functionality, user authentication,
//  * and recipe management options.
//  */
// const Navbar: React.FC = () => {
//   const router = useRouter();
//   const { user, logout } = useAuthStore();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [, setLoading] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
//   const [, setRecipeNotFound] = useState(false);
//   const { theme, toggleTheme } = useTheme();

//   /**
//    * Fetches recipes based on the search query.
//    */
//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setSearchResults([]);
//       setShowDropdown(false);
//       return;
//     }

//     const fetchRecipes = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           `${NavbarConstants.API_BASE_URL}${encodeURIComponent(searchQuery)}`,
//           {
//             method: 'GET',
//             headers: { Accept: 'application/json' },
//           }
//         );

//         if (!response.ok) {
//           console.error(`Search failed with status: ${response.status}`);
//           setSearchResults([]);
//           setShowDropdown(false);
//           return;
//         }

//         const data = await response.json();
//         setSearchResults(data);
//         setShowDropdown(data.length > 0);
//       } catch (error) {
//         console.error('Search failed:', error);
//         setSearchResults([]);
//         setShowDropdown(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const delayDebounce = setTimeout(fetchRecipes, 500);
//     return () => clearTimeout(delayDebounce);
//   }, [searchQuery]);

//   /**
//    * Handles the selection of a recipe from the search results.
//    */
//   const handleSelectRecipe = async (recipeId?: number) => {
//     if (!recipeId) {
//       console.error('Error: recipeId is undefined');
//       return;
//     }

//     setShowDropdown(false);
//     setSearchQuery('');

//     const apiUrl = `http://localhost:3000/api/recipes/${recipeId}`;
//     console.log('Fetching recipe from:', apiUrl);

//     try {
//       const response = await fetch(apiUrl);
//       const textResponse = await response.text();
//       console.log('Raw API response:', textResponse);

//       if (!response.ok) {
//         console.error('API Error:', response.status, response.statusText);
//         setRecipeNotFound(true);
//         router.push('/404');
//         return;
//       }

//       router.push(`/recipes/${recipeId}`);
//     } catch (error) {
//       console.error('Error selecting recipe:', error);
//       setRecipeNotFound(true);
//       router.push('/404');
//     }
//   };

//   /**
//    * Logs the user out and redirects to the login page.
//    */
//   const handleLogout = () => {
//     logout();
//     router.push('/login');
//     setIsDropdownOpen(false);
//   };

//   return (
//     <>
//       <div
//         className={`bg-white/80 shadow-lg w-full fixed top-0 left-0 z-10 backdrop-blur-sm`}
//         style={{
//           background: theme === 'light' ? '#fff' : '#333',
//           color: theme === 'light' ? '#000' : '#fff',
//         }}
//       >
//         <div className="mx-auto max-w-7xl px-4">
//           <div className="flex h-16 items-center justify-between">
//             <Link href="/" className="flex items-center space-x-3">
//               <svg
//                 className="h-8 w-8 text-indigo-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M8 2v10M6 2v10M10 2v10M8 14v8"
//                 />
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M16 4c1.657 0 3 1.79 3 4s-1.343 4-3 4-3-1.79-3-4 1.343-4 3-4zM16 12v10"
//                 />
//               </svg>
//               <span className="text-xl font-bold">
//                 {NavbarConstants.LOGO_TEXT}
//               </span>
//             </Link>

//             <div className="flex-1 px-8">
//               <div className="relative max-w-lg">
//                 <input
//                   type="text"
//                   placeholder={NavbarConstants.SEARCH_PLACEHOLDER}
//                   className="w-full rounded-full border-gray-200 bg-gray-50 pl-10 pr-4 focus:border-indigo-500 focus:ring-indigo-500"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   onFocus={() => setShowDropdown(true)}
//                 />
//                 {showDropdown && searchResults.length > 0 && (
//                   <div className="absolute left-0 right-0 mt-2 overflow-hidden rounded-lg border bg-white shadow-lg">
//                     {searchResults.map((result) => (
//                       <Link
//                         key={result.recipe_id}
//                         href={`/recipes/${result.recipe_id}`}
//                         className="flex items-center space-x-4 p-4 hover:bg-gray-50"
//                         onClick={() => handleSelectRecipe(result.recipe_id)}
//                       >
//                         <img
//                           src={
//                             result.image || NavbarConstants.PLACEHOLDER_IMAGE
//                           }
//                           alt={result.title}
//                           className="h-16 w-16 rounded-lg object-cover"
//                         />
//                         <div>
//                           <h3 className="font-medium">{result.title}</h3>
//                           <p className="text-sm text-gray-500">
//                             {result.description}
//                           </p>
//                         </div>
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               {user && (
//                 <button
//                   onClick={() => setShowCreateModal(true)}
//                   className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
//                 >
//                   {NavbarConstants.CREATE_RECIPE_TEXT}
//                 </button>
//               )}

//               {/* {user && (
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                 >
//                   {NavbarConstants.LOGOUT_TEXT}
//                 </button>
//               )} */}

//               {user && (
//                 <div className="relative">
//                   <button
//                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                     className="flex items-center space-x-2 rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
//                   >
//                     <span>{user.username}</span>
//                   </button>

//                   {isDropdownOpen && (
//                     <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border bg-white shadow-lg">
//                       <Link
//                         href="/my-recipes"
//                         onClick={() => setIsDropdownOpen(false)}
//                         className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                       >
//                         {NavbarConstants.MY_RECIPES_TEXT}
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                       >
//                         {NavbarConstants.LOGOUT_TEXT}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {!user && (
//                 <Link href="/login">
//                   <div className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
//                     {NavbarConstants.LOGIN_TEXT}
//                   </div>
//                 </Link>
//               )}

//               <button
//                 onClick={toggleTheme}
//                 className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
//               >
//                 {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <CreateRecipeModal
//         isOpen={showCreateModal}
//         onClose={() => setShowCreateModal(false)}
//         onSuccess={() => {}}
//       />
//     </>
//   );
// };

// export default Navbar;
// function useAuth(): { user: any; logout: any } {
//   throw new Error('Function not implemented.');
// }

// 'use client';

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import CreateRecipeModal from './CreateRecipeModal';
// import { NavbarConstants } from '../constants/NavbarConstant';
// // import { useAuth } from '../context/AuthContext';
// import { useTheme } from '../context/ThemeContext';
// import { useAuthStore } from '../store/AuthStore';

// /**
//  * Interface representing a single search result in the navbar.
//  */
// interface SearchResult {
//   recipe_id: number;
//   title: string;
//   description: string;
//   image: string;
// }

// /**
//  * Navbar component that contains search functionality, user authentication,
//  * and recipe management options.
//  */
// const Navbar: React.FC = () => {
//   const router = useRouter();
//   const { user, logout } = useAuthStore();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [, setLoading] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
//   const [, setRecipeNotFound] = useState(false);
//   const { theme, toggleTheme } = useTheme();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   /**
//    * Fetches recipes based on the search query.
//    */
//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setSearchResults([]);
//       setShowDropdown(false);
//       return;
//     }

//     const fetchRecipes = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           `${NavbarConstants.API_BASE_URL}${encodeURIComponent(searchQuery)}`,
//           {
//             method: 'GET',
//             headers: { Accept: 'application/json' },
//           }
//         );

//         if (!response.ok) {
//           console.error(`Search failed with status: ${response.status}`);
//           setSearchResults([]);
//           setShowDropdown(false);
//           return;
//         }

//         const data = await response.json();
//         setSearchResults(data);
//         setShowDropdown(data.length > 0);
//       } catch (error) {
//         console.error('Search failed:', error);
//         setSearchResults([]);
//         setShowDropdown(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const delayDebounce = setTimeout(fetchRecipes, 500);
//     return () => clearTimeout(delayDebounce);
//   }, [searchQuery]);

//   /**
//    * Handles the selection of a recipe from the search results.
//    */
//   const handleSelectRecipe = async (recipeId?: number) => {
//     if (!recipeId) {
//       console.error('Error: recipeId is undefined');
//       return;
//     }

//     setShowDropdown(false);
//     setSearchQuery('');

//     const apiUrl = `http://localhost:3000/api/recipes/${recipeId}`;
//     console.log('Fetching recipe from:', apiUrl);

//     try {
//       const response = await fetch(apiUrl);
//       const textResponse = await response.text();
//       console.log('Raw API response:', textResponse);

//       if (!response.ok) {
//         console.error('API Error:', response.status, response.statusText);
//         setRecipeNotFound(true);
//         router.push('/404');
//         return;
//       }

//       router.push(`/recipes/${recipeId}`);
//     } catch (error) {
//       console.error('Error selecting recipe:', error);
//       setRecipeNotFound(true);
//       router.push('/404');
//     }
//   };

//   /**
//    * Logs the user out and redirects to the login page.
//    */
//   const handleLogout = () => {
//     logout();
//     router.push('/login');
//     setIsDropdownOpen(false);
//   };

//   return (
//     <>
//       <div
//         className={`bg-white/80 shadow-lg w-full fixed top-0 left-0 z-10 backdrop-blur-sm`}
//         style={{
//           background: theme === 'light' ? '#fff' : '#333',
//           color: theme === 'light' ? '#000' : '#fff',
//         }}
//       >
//         <div className="mx-auto max-w-7xl px-4">
//           <div className="flex h-16 items-center justify-between">
//             <Link href="/" className="flex items-center space-x-3">
//               <svg
//                 className="h-8 w-8 text-indigo-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M8 2v10M6 2v10M10 2v10M8 14v8"
//                 />
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M16 4c1.657 0 3 1.79 3 4s-1.343 4-3 4-3-1.79-3-4 1.343-4 3-4zM16 12v10"
//                 />
//               </svg>
//               <span className="text-xl font-bold">
//                 {NavbarConstants.LOGO_TEXT}
//               </span>
//             </Link>

//             {/* Search bar - hidden on mobile */}
//             <div className="hidden md:flex flex-1 px-8">
//               <div className="relative max-w-lg w-full">
//                 <input
//                   type="text"
//                   placeholder={NavbarConstants.SEARCH_PLACEHOLDER}
//                   className="w-full rounded-full border-gray-200 bg-gray-50 pl-10 pr-4 focus:border-indigo-500 focus:ring-indigo-500"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   onFocus={() => setShowDropdown(true)}
//                 />
//                 {showDropdown && searchResults.length > 0 && (
//                   <div className="absolute left-0 right-0 mt-2 overflow-hidden rounded-lg border bg-white shadow-lg">
//                     {searchResults.map((result) => (
//                       <Link
//                         key={result.recipe_id}
//                         href={`/recipes/${result.recipe_id}`}
//                         className="flex items-center space-x-4 p-4 hover:bg-gray-50"
//                         onClick={() => handleSelectRecipe(result.recipe_id)}
//                       >
//                         <img
//                           src={
//                             result.image || NavbarConstants.PLACEHOLDER_IMAGE
//                           }
//                           alt={result.title}
//                           className="h-16 w-16 rounded-lg object-cover"
//                         />
//                         <div>
//                           <h3 className="font-medium">{result.title}</h3>
//                           <p className="text-sm text-gray-500">
//                             {result.description}
//                           </p>
//                         </div>
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Desktop navigation */}
//             <div className="hidden md:flex items-center space-x-4">
//               {user && (
//                 <button
//                   onClick={() => setShowCreateModal(true)}
//                   className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
//                 >
//                   {NavbarConstants.CREATE_RECIPE_TEXT}
//                 </button>
//               )}

//               {user && (
//                 <div className="relative">
//                   <button
//                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                     className="flex items-center space-x-2 rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
//                   >
//                     <span>{user.username}</span>
//                   </button>

//                   {isDropdownOpen && (
//                     <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border bg-white shadow-lg">
//                       <Link
//                         href="/my-recipes"
//                         onClick={() => setIsDropdownOpen(false)}
//                         className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                       >
//                         {NavbarConstants.MY_RECIPES_TEXT}
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                       >
//                         {NavbarConstants.LOGOUT_TEXT}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {!user && (
//                 <Link href="/login">
//                   <div className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
//                     {NavbarConstants.LOGIN_TEXT}
//                   </div>
//                 </Link>
//               )}

//               {/* <button
//                 onClick={toggleTheme}
//                 className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
//               >
//                 {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
//               </button> */}
//             </div>

//             {/* Mobile menu button */}
//             <button
//               className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               <span className="sr-only">Open main menu</span>
//               {/* Hamburger icon */}
//               <svg
//                 className="h-6 w-6"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 aria-hidden="true"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d={
//                     mobileMenuOpen
//                       ? 'M6 18L18 6M6 6l12 12'
//                       : 'M4 6h16M4 12h16M4 18h16'
//                   }
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Mobile menu, show/hide based on menu state */}
//         {mobileMenuOpen && (
//           <div className="md:hidden">
//             <div
//               className="px-2 pt-2 pb-3 space-y-1 sm:px-3"
//               style={{
//                 background: theme === 'light' ? '#fff' : '#333',
//               }}
//             >
//               {/* Mobile search */}
//               <div className="px-4 py-2">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder={NavbarConstants.SEARCH_PLACEHOLDER}
//                     className="w-full rounded-full border-gray-200 bg-gray-50 pl-10 pr-4 focus:border-indigo-500 focus:ring-indigo-500"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     onFocus={() => setShowDropdown(true)}
//                   />
//                   {showDropdown && searchResults.length > 0 && (
//                     <div className="absolute left-0 right-0 mt-2 overflow-hidden rounded-lg border bg-white shadow-lg z-20">
//                       {searchResults.map((result) => (
//                         <Link
//                           key={result.recipe_id}
//                           href={`/recipes/${result.recipe_id}`}
//                           className="flex items-center space-x-4 p-4 hover:bg-gray-50"
//                           onClick={() => {
//                             handleSelectRecipe(result.recipe_id);
//                             setMobileMenuOpen(false);
//                           }}
//                         >
//                           <img
//                             src={
//                               result.image || NavbarConstants.PLACEHOLDER_IMAGE
//                             }
//                             alt={result.title}
//                             className="h-16 w-16 rounded-lg object-cover"
//                           />
//                           <div>
//                             <h3 className="font-medium">{result.title}</h3>
//                             <p className="text-sm text-gray-500">
//                               {result.description}
//                             </p>
//                           </div>
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Mobile menu items */}
//               <div className="px-4 py-2 space-y-3">
//                 {user && (
//                   <button
//                     onClick={() => {
//                       setShowCreateModal(true);
//                       setMobileMenuOpen(false);
//                     }}
//                     className="w-full inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
//                   >
//                     {NavbarConstants.CREATE_RECIPE_TEXT}
//                   </button>
//                 )}

//                 {user && (
//                   <Link
//                     href="/my-recipes"
//                     onClick={() => setMobileMenuOpen(false)}
//                     className="block w-full text-center rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
//                   >
//                     {NavbarConstants.MY_RECIPES_TEXT}
//                   </Link>
//                 )}

//                 {user && (
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setMobileMenuOpen(false);
//                     }}
//                     className="w-full text-center rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
//                   >
//                     {NavbarConstants.LOGOUT_TEXT}
//                   </button>
//                 )}

//                 {!user && (
//                   <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
//                     <div className="w-full text-center inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
//                       {NavbarConstants.LOGIN_TEXT}
//                     </div>
//                   </Link>
//                 )}

//                 {/* <button
//                   onClick={() => {
//                     toggleTheme();
//                     setMobileMenuOpen(false);
//                   }}
//                   className="w-full text-center flex items-center justify-center space-x-2 px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
//                 >
//                   {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
//                 </button> */}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <CreateRecipeModal
//         isOpen={showCreateModal}
//         onClose={() => setShowCreateModal(false)}
//         onSuccess={() => {}}
//       />
//     </>
//   );
// };

// export default Navbar;
// function useAuth(): { user: any; logout: any } {
//   throw new Error('Function not implemented.');
// }

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CreateRecipeModal from './CreateRecipeModal';
import { NavbarConstants } from '../constants/NavbarConstant';
// import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useAuthStore } from '../store/AuthStore';

/**
 * Interface representing a single search result in the navbar.
 */
interface SearchResult {
  recipe_id: number;
  title: string;
  description: string;
  image: string;
}

/**
 * Navbar component that contains search functionality, user authentication,
 * and recipe management options.
 */
const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [, setRecipeNotFound] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Fetches recipes based on the search query.
   */
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${NavbarConstants.API_BASE_URL}${encodeURIComponent(searchQuery)}`,
          {
            method: 'GET',
            headers: { Accept: 'application/json' },
          }
        );

        if (!response.ok) {
          console.error(`Search failed with status: ${response.status}`);
          setSearchResults([]);
          setShowDropdown(false);
          return;
        }

        const data = await response.json();
        setSearchResults(data);
        setShowDropdown(data.length > 0);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchRecipes, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  /**
   * Handles the selection of a recipe from the search results.
   */
  const handleSelectRecipe = async (recipeId?: number) => {
    if (!recipeId) {
      console.error('Error: recipeId is undefined');
      return;
    }

    setShowDropdown(false);
    setSearchQuery('');

    const apiUrl = `http://localhost:3000/api/recipes/${recipeId}`;
    console.log('Fetching recipe from:', apiUrl);

    try {
      const response = await fetch(apiUrl);
      const textResponse = await response.text();
      console.log('Raw API response:', textResponse);

      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        setRecipeNotFound(true);
        router.push('/404');
        return;
      }

      router.push(`/recipes/${recipeId}`);
    } catch (error) {
      console.error('Error selecting recipe:', error);
      setRecipeNotFound(true);
      router.push('/404');
    }
  };

  /**
   * Logs the user out and redirects to the login page.
   */
  const handleLogout = () => {
    logout();
    router.push('/login');
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div
        className={`bg-white/80 shadow-lg w-full fixed top-0 left-0 z-10 backdrop-blur-sm`}
        style={{
          background: theme === 'light' ? '#fff' : '#333',
          color: theme === 'light' ? '#000' : '#fff',
        }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <svg
                className="h-8 w-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 2v10M6 2v10M10 2v10M8 14v8"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 4c1.657 0 3 1.79 3 4s-1.343 4-3 4-3-1.79-3-4 1.343-4 3-4zM16 12v10"
                />
              </svg>
              <span className="text-xl font-bold">
                {NavbarConstants.LOGO_TEXT}
              </span>
            </Link>

            {/* Search bar - hidden on mobile */}
            <div className="hidden md:flex flex-1 px-8">
              <div className="relative max-w-lg w-full">
                <input
                  type="text"
                  placeholder={NavbarConstants.SEARCH_PLACEHOLDER}
                  className="w-full rounded-full border-gray-200 bg-gray-50 pl-10 pr-4 focus:border-indigo-500 focus:ring-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  aria-label="Search recipes"
                  aria-expanded={showDropdown}
                  aria-controls={showDropdown ? 'search-results' : undefined}
                />
                {showDropdown && searchResults.length > 0 && (
                  <div
                    className="absolute left-0 right-0 mt-2 overflow-hidden rounded-lg border bg-white shadow-lg"
                    id="search-results"
                    role="listbox"
                  >
                    {searchResults.map((result) => (
                      <Link
                        key={result.recipe_id}
                        href={`/recipes/${result.recipe_id}`}
                        className="flex items-center space-x-4 p-4 hover:bg-gray-50"
                        onClick={() => handleSelectRecipe(result.recipe_id)}
                        role="option"
                        aria-selected="false"
                      >
                        <img
                          src={
                            result.image || NavbarConstants.PLACEHOLDER_IMAGE
                          }
                          alt={result.title}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-medium">{result.title}</h3>
                          <p className="text-sm text-gray-500">
                            {result.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {user && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                  aria-label="Create new recipe"
                >
                  {NavbarConstants.CREATE_RECIPE_TEXT}
                </button>
              )}

              {user && (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    aria-controls="user-menu"
                  >
                    <span>{user.username}</span>
                  </button>

                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border bg-white shadow-lg"
                      id="user-menu"
                      role="menu"
                    >
                      <Link
                        href="/my-recipes"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        role="menuitem"
                      >
                        {NavbarConstants.MY_RECIPES_TEXT}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        role="menuitem"
                        aria-label="Log out"
                      >
                        {NavbarConstants.LOGOUT_TEXT}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {!user && (
                <Link href="/login">
                  <div
                    className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                    role="button"
                    aria-label="Log in to your account"
                  >
                    {NavbarConstants.LOGIN_TEXT}
                  </div>
                </Link>
              )}

              {/* <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button> */}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    mobileMenuOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div
              className="px-2 pt-2 pb-3 space-y-1 sm:px-3"
              style={{
                background: theme === 'light' ? '#fff' : '#333',
              }}
            >
              {/* Mobile search */}
              <div className="px-4 py-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={NavbarConstants.SEARCH_PLACEHOLDER}
                    className="w-full rounded-full border-gray-200 bg-gray-50 pl-10 pr-4 focus:border-indigo-500 focus:ring-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    aria-label="Search recipes"
                    aria-expanded={showDropdown}
                    aria-controls={
                      showDropdown ? 'mobile-search-results' : undefined
                    }
                  />
                  {showDropdown && searchResults.length > 0 && (
                    <div
                      className="absolute left-0 right-0 mt-2 overflow-hidden rounded-lg border bg-white shadow-lg z-20"
                      id="mobile-search-results"
                      role="listbox"
                    >
                      {searchResults.map((result) => (
                        <Link
                          key={result.recipe_id}
                          href={`/recipes/${result.recipe_id}`}
                          className="flex items-center space-x-4 p-4 hover:bg-gray-50"
                          onClick={() => {
                            handleSelectRecipe(result.recipe_id);
                            setMobileMenuOpen(false);
                          }}
                          role="option"
                          aria-selected="false"
                        >
                          <img
                            src={
                              result.image || NavbarConstants.PLACEHOLDER_IMAGE
                            }
                            alt={result.title}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-medium">{result.title}</h3>
                            <p className="text-sm text-gray-500">
                              {result.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile menu items */}
              <div className="px-4 py-2 space-y-3">
                {user && (
                  <button
                    onClick={() => {
                      setShowCreateModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                    aria-label="Create new recipe"
                  >
                    {NavbarConstants.CREATE_RECIPE_TEXT}
                  </button>
                )}

                {user && (
                  <Link
                    href="/my-recipes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    aria-label="View my recipes"
                  >
                    {NavbarConstants.MY_RECIPES_TEXT}
                  </Link>
                )}

                {user && (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                    role="menuitem"
                    aria-label="Log out"
                  >
                    {NavbarConstants.LOGOUT_TEXT}
                  </button>
                )}

                {!user && (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <div
                      className="w-full text-center inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                      role="button"
                      aria-label="Log in to your account"
                    >
                      {NavbarConstants.LOGIN_TEXT}
                    </div>
                  </Link>
                )}

                {/* <button
                  onClick={() => {
                    toggleTheme();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center flex items-center justify-center space-x-2 px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button> */}
              </div>
            </div>
          </div>
        )}
      </div>

      <CreateRecipeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {}}
      />
    </>
  );
};

export default Navbar;
function useAuth(): { user: any; logout: any } {
  throw new Error('Function not implemented.');
}
