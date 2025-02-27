import { NextRequest, NextResponse } from "next/server";
import recipeRepository from "../../../../lib/repository/recipeRepository";
// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

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

            // const uploadResult = await new Promise((resolve, reject) => {
            //     cloudinary.uploader.upload_stream(
            //         { folder: "recipes" },
            //         (error, result) => (error ? reject(error) : resolve(result))
            //     ).end(buffer);
            // });

            // imageUrl = (uploadResult as any).secure_url;
        }

        // Extract recipe data
        const recipeData = {
            title: formData.get("title") as string,
            user_id: Number(formData.get("user_id")),
            description: formData.get("description") as string,
            ingredients: JSON.parse(formData.get("ingredients") as string),
            instructions: formData.get("instructions") as string,
            preparationTime: formData.get("preparationTime") as string,
            difficulty: formData.get("difficulty") as string,
            cuisine: formData.get("cuisine") as string,
            mealType: formData.get("mealType") as string,
            image: imageUrl,
        };

        // Save the recipe
        const recipeId = await recipeRepository.createRecipe(recipeData);
        if (!recipeId) {
            return NextResponse.json({ message: "Failed to create recipe" }, { status: 500 });
        }

        return NextResponse.json({ message: "Recipe created successfully", recipeId }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating recipe", error }, { status: 500 });
    }
}
