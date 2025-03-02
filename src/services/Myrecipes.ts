// "use server";
// import axios from "axios";

// import { MyRecipesConstants } from "../constants/MyrecipesConstant";

// export const fetchUserRecipes = async (userId: number, token: string) => {
//     try {
//         const response = await axios.get (`${MyRecipesConstants.apiUrl}/my-recipes/${userId}`, {
//             method: "GET",
//             headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!response.ok) {
//             const result = await response.json();
//             console.error("Error fetching recipes:", result.message || result);
//             throw new Error(MyRecipesConstants.errorFetchingRecipes);
//         }

//         return response.json();
//     } catch (error) {
//         console.error(MyRecipesConstants.errorFetchingRecipes, error);
//         throw new Error(MyRecipesConstants.errorFetchingRecipes);
//     }
// };

"use server";
import axios from "axios";

import { MyRecipesConstants } from "../constants/MyrecipesConstant";

export const fetchUserRecipes = async (userId: number, token: string) => {
    try {
        const url = `${MyRecipesConstants.apiUrl}/my-recipes/${userId}`;
        console.log("Request URL:", url);  // Log the URL

        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            console.error("Unexpected response status:", response.status);
            throw new Error(MyRecipesConstants.errorFetchingRecipes);
        }
    } catch (error: any) {
        if (error.response) {
            console.error("Server Error:", error.response.data);
            throw new Error(`Server Error: ${error.response.data.message || error.message}`);
        } else if (error.request) {
            console.error("No response received:", error.request);
            throw new Error("No response received from server.");
        } else {
            console.error("Error setting up request:", error.message);
            throw new Error(`Error setting up request: ${error.message}`);
        }
    }
};


