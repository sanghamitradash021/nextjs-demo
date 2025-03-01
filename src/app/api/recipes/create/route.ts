import { NextRequest, NextResponse } from "next/server";
import recipeRepository from "@/lib/repository/recipeRepository";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Handles recipe creation.
 * Accepts a POST request with formData including image and recipe details.
 */
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const imageFile = formData.get("image") as File | null;

        let imageUrl = "";
        if (imageFile) {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            imageUrl = await new Promise<string>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "recipes" },
                    (error, result) => {
                        if (error) {
                            reject(new Error(`Cloudinary upload failed: ${error.message}`));
                        } else {
                            resolve(result?.secure_url || "");
                        }
                    }
                );
                uploadStream.end(buffer);
            });
        }

        // Extract and validate recipe data
        const title = formData.get("title") as string;
        const user_id = Number(formData.get("user_id"));
        const description = formData.get("description") as string;
        const ingredients = formData.get("ingredients") ? JSON.parse(formData.get("ingredients") as string) : [];
        const instructions = formData.get("instructions") as string;
        const preparationTime = Number(formData.get("preparationTime"));
        const difficulty = formData.get("difficulty") as string;
        const cuisine = formData.get("cuisine") as string;
        const mealType = formData.get("mealType") as string;

        if (!title || !user_id || !description || !ingredients.length || !instructions || !preparationTime || !difficulty || !cuisine || !mealType) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const recipeData = {
            title,
            user_id,
            description,
            ingredients,
            instructions,
            preparationTime,
            difficulty,
            cuisine,
            mealType,
            image: imageUrl,
        };

        // Save the recipe
        const recipeId = await recipeRepository.createRecipe(recipeData);
        if (!recipeId) {
            return NextResponse.json({ message: "Failed to create recipe" }, { status: 500 });
        }

        return NextResponse.json({ message: "Recipe created successfully", recipeId, imageUrl }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating recipe", error: (error as Error).message }, { status: 500 });
    }
}
