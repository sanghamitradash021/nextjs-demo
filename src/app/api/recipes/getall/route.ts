import { NextRequest, NextResponse } from "next/server";
import recipeRepository from "../../../../lib/repository/recipeRepository";

/**
 * Retrieves all recipes with pagination.
 * Accepts `page` and `limit` as query parameters.
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 100;
        const offset = (page - 1) * limit;

        const recipes = await recipeRepository.getAllRecipes(limit, offset);
        return NextResponse.json(recipes);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching recipes", error }, { status: 500 });
    }
}
