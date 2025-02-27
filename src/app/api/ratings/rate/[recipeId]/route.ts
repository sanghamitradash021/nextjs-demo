import { NextRequest, NextResponse } from 'next/server';
import RatingRepository from '../../../../../lib/repository/ratingRepository'

/**
 * Retrieves the average rating for a specific recipe.
 * 
 * @param {NextRequest} req - The request object, containing recipeId in the query.
 * @returns {NextResponse} - A JSON response indicating the average rating.
 */
// src/app/api/ratings/rate/[id]/route.ts



// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//     const { id } = params;

//     // Convert id to a number and check if it's valid
//     const recipeId = Number(id);
//     if (isNaN(recipeId)) {
//         return NextResponse.json({ message: "Invalid Recipe ID" }, { status: 400 });
//     }

//     try {
//         const averageRating = await RatingRepository.getAverageRating(recipeId);

//         if (averageRating === null) {
//             return NextResponse.json({ message: "No rating found for this recipe" }, { status: 404 });
//         }

//         return NextResponse.json({ averageRating });
//     } catch (error) {
//         return NextResponse.json({ message: "Error fetching average rating", error }, { status: 500 });
//     }
// }

export async function GET(request: NextRequest, { params }: { params: { recipeId: string } }) {
    console.log("Received params:", params); // Debug log

    const { recipeId } = params;
    const numericRecipeId = Number(recipeId);
    console.log("Converted recipeId:", numericRecipeId); // Debug log

    if (isNaN(numericRecipeId)) {
        return NextResponse.json({ message: "Invalid Recipe ID" }, { status: 400 });
    }

    try {
        const averageRating = await RatingRepository.getAverageRating(numericRecipeId);
        if (averageRating === null) {
            return NextResponse.json({ message: "No rating found for this recipe" }, { status: 404 });
        }
        return NextResponse.json({ averageRating });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching average rating", error }, { status: 500 });
    }
}