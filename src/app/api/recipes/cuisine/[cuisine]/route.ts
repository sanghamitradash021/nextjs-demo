import { NextRequest, NextResponse } from 'next/server';
import recipeRepository from '../../../../../lib/repository/recipeRepository';

// Handle GET request to fetch recipes by cuisine
// export async function GET(req: NextRequest) {
//     try {
//         // Extracting the cuisine type from the query parameters using the get method
//         const cuisine = req.nextUrl.searchParams.get('cuisine');

//         if (!cuisine) {
//             return NextResponse.json({ message: "Cuisine type is required" }, { status: 400 });
//         }

//         const recipes = await recipeRepository.getRecipesByCuisine(cuisine);

//         if (!recipes || recipes.length === 0) {
//             return NextResponse.json({ message: "No recipes found for this cuisine" }, { status: 404 });
//         }

//         return NextResponse.json(recipes);
//     } catch (error) {
//         return NextResponse.json({ message: "Error fetching recipes", error }, { status: 500 });
//     }
// }
export async function GET(req: NextRequest, { params }: { params: { cuisine: string } }) {
    try {
        const { cuisine } = params;

        if (!cuisine) {
            return NextResponse.json({ message: "Cuisine type is required" }, { status: 400 });
        }

        const recipes = await recipeRepository.getRecipesByCuisine(cuisine);

        if (!recipes || recipes.length === 0) {
            return NextResponse.json({ message: "No recipes found for this cuisine" }, { status: 404 });
        }

        return NextResponse.json(recipes);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching recipes", error }, { status: 500 });
    }
}

