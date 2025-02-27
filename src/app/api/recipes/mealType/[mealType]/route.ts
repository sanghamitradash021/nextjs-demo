import { NextRequest, NextResponse } from 'next/server';
import recipeRepository from '../../../../../lib/repository/recipeRepository';

// Handle GET request to fetch recipes by meal type
// src/app/api/recipes/mealType/[mealType]/route.ts


export async function GET(req: NextRequest, { params }: { params: { mealType: string } }) {
    try {
        const { mealType } = params;

        if (!mealType) {
            return NextResponse.json({ message: "Meal type is required" }, { status: 400 });
        }

        const recipes = await recipeRepository.getRecipesByMealType(mealType);

        if (!recipes || recipes.length === 0) {
            return NextResponse.json({ message: "No recipes found for this meal type" }, { status: 404 });
        }

        return NextResponse.json(recipes);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching recipes", error }, { status: 500 });
    }
}
