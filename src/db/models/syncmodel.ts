import Recipe from "./recipe";


import User from "./user";
import Comment from "./comment";
import Rating from "./rating";



const syncTables = async () => {
    try {
        await User.sync()
        console.log("User table synced successfully")



        await Recipe.sync({ alter: true })
        console.log("Recipe table synced successfully")



        await Comment.sync({ alter: true })
        console.log("Comment table synced successfully")

        await Rating.sync({ alter: true })
        console.log("Rating table synced successfully")


    } catch (error) {
        console.error("Error in syncing tables:", error)
    }
}

export default syncTables