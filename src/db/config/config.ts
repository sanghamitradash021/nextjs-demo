import dotenv from "dotenv";

dotenv.config();

/**
 * Configuration object for database connection.
 * @typedef {Object} Config
 * @property {Object} development - Configuration for the development environment.
 * @property {string} development.username - The database username.
 * @property {string} development.password - The database password.
 * @property {string} development.database - The name of the database.
 * @property {string} development.host - The database host.
 * @property {string} development.port - The port number for the database connection.
 * @property {string} development.dialect - The dialect used for the database (e.g., 'mysql').
 * @property {boolean} development.benchmark - Whether to enable query benchmarking.
 */

/**
 * Configuration for different environments.
 * The default environment is 'development'.
 * @type {Config}
 */

const config = {
    development: {
        username: process.env.DB_USER || '',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || '',
        host: process.env.DB_HOST || '',
        port: process.env.DB_PORT || '',
        dialect: 'mysql',
        benchmark: true
    }
};

export default config;