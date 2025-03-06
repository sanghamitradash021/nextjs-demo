export interface Recipe {
    recipe_id: number
    title: string
    description: string
    image: string
    rating?: number
    cuisine?: string
    mealType?: string
    preparationTime?: string
    difficulty?: string
}

