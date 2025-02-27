import { NextRequest, NextResponse } from 'next/server';
import recipeRepository from '../../../../../lib/repository/recipeRepository';

// Handle GET request to search recipes based on query in the URL path
export async function GET(req: NextRequest) {
    try {
        // Extract the search query from the URL's path
        const pathParts = req.nextUrl.pathname.split('/');
        const query = pathParts[pathParts.length - 1]; // Get the last part of the URL

        // If query parameter is missing
        if (!query) {
            return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 });
        }

        // Search recipes based on the query parameter
        const recipes = await recipeRepository.searchRecipes(query);

        if (!recipes || recipes.length === 0) {
            return NextResponse.json({ message: 'No recipes found for the given search' }, { status: 404 });
        }

        return NextResponse.json(recipes);
    } catch (error) {
        return NextResponse.json({ message: 'Error searching recipes', error }, { status: 500 });
    }
}
