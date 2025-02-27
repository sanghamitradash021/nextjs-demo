import { NextRequest, NextResponse } from "next/server";
import recipeRepository from "../../../../lib/repository/recipeRepository";

// Handle GET request - Retrieve a recipe by its ID
export async function GET(req: NextRequest) {
    try {
        // Extracting id from the URL
        const urlParts = req.url.split("/");
        const id = urlParts[urlParts.length - 1]; // Get the last part of the URL as the ID

        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ message: "Invalid or missing recipe ID" }, { status: 400 });
        }

        const recipe = await recipeRepository.findById(Number(id));
        if (!recipe) {
            return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
        }
        return NextResponse.json(recipe);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching recipe", error }, { status: 500 });
    }
}

// Handle PUT request - Update a recipe by its ID
export async function PUT(req: NextRequest) {
    try {
        // Extracting id from the URL
        const urlParts = req.url.split("/");
        const id = urlParts[urlParts.length - 1]; // Get the last part of the URL as the ID

        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ message: "Invalid or missing recipe ID" }, { status: 400 });
        }

        const body = await req.json(); // Get data from body
        const updated = await recipeRepository.updateRecipe(Number(id), body);
        if (!updated) {
            return NextResponse.json({ message: "Recipe not found or not updated" }, { status: 404 });
        }
        return NextResponse.json({ message: "Recipe updated successfully" });
    } catch (error: any) {
        console.error("Error updating recipe:", error);
        return NextResponse.json({ message: "Error updating recipe", error: error.message || error }, { status: 500 });
    }
}

// Handle DELETE request - Delete a recipe by its ID
export async function DELETE(req: NextRequest) {
    try {
        // Extracting id from the URL
        const urlParts = req.url.split("/");
        const id = urlParts[urlParts.length - 1]; // Get the last part of the URL as the ID

        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ message: "Invalid or missing recipe ID" }, { status: 400 });
        }

        const deleted = await recipeRepository.deleteRecipe(Number(id));
        if (!deleted) {
            return NextResponse.json({ message: "Recipe not found or already deleted" }, { status: 404 });
        }
        return NextResponse.json({ message: "Recipe deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting recipe", error }, { status: 500 });
    }
}