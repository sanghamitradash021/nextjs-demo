import { NextRequest, NextResponse } from "next/server";
import CommentRepository from "../,,/../../../../../lib/repository/commentRepository";

export async function GET(req: NextRequest, { params }: { params: { recipeId: string } }) {
    try {
        const recipeId = Number(params.recipeId);
        if (isNaN(recipeId)) {
            return NextResponse.json({ message: "Invalid recipe ID" }, { status: 400 });
        }

        const comments = await CommentRepository.getCommentsByRecipe(recipeId);
        return NextResponse.json(comments, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching comments", error }, { status: 500 });
    }
}
