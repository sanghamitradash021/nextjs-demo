import { NextRequest, NextResponse } from 'next/server';
import recipeRepository from '../../../../../lib/repository/recipeRepository';

// Handle GET request to fetch recipes uploaded by a specific user
export async function GET(req: NextRequest) {
    try {
        // Extract userId from the URL parameters
        const userId = req.nextUrl.pathname.split('/').pop(); // Extract userId from the URL
        if (!userId || isNaN(Number(userId))) {
            return NextResponse.json({ message: "Invalid or missing userId" }, { status: 400 });
        }

        const recipes = await recipeRepository.getUserRecipes(Number(userId));

        if (!recipes || recipes.length === 0) {
            return NextResponse.json({ message: "No recipes found for this user" }, { status: 404 });
        }

        return NextResponse.json(recipes);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching recipes", error }, { status: 500 });
    }
}
