import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import config from "../config/config";
import mysql2 from 'mysql2';


// Load environment variables from .env file
dotenv.config();

/**
 * Sequelize instance for connecting to the MySQL database.
 * 
 * This instance is used to interact with the database for CRUD operations,
 * migrations, and syncing models.
 * 
 * The configuration uses environment variables to set up the connection, 
 * with fallback values in case they are not defined.
 * 
 * @constant
 * @type {Sequelize}
 * @example
 * sequelize.authenticate() // Test the connection to the database
 */
export const sequelize = new Sequelize(
    process.env.DB_NAME || "recipe_sharing_platform", // Database name
    process.env.DB_USER || "developer",                   // Database user
    process.env.DB_PASSWORD || "sangdash",          // Database password
    {
        host: process.env.DB_HOST || "localhost",    // Database host
        dialect: "mysql",
        dialectModule: mysql2,
        benchmark: true                            // Disable logging of SQL queries
    }
);




await sequelize.sync({ alter: true });
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

export default sequelize;