import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME || "recipe_platform",
    process.env.DB_USER || "developer",
    process.env.DB_PASSWORD || "sangdash",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        port: parseInt(process.env.DB_PORT || "3306"),
        logging: false,
    }
);
