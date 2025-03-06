// src/server/database/connection.ts

import mysql from 'mysql2/promise';
// import { logger } from '../utils/logger';

// Environment variables
const {
    DB_HOST = 'localhost',
    DB_USER = 'root',
    DB_PASSWORD = '',
    DB_NAME = 'recipe_platform',
    DB_PORT = '3306',
    DB_CONNECTION_LIMIT = '10',
    DB_QUEUE_LIMIT = '0' // 0 means unlimited
} = process.env;

// Create a connection pool
export const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: parseInt(DB_PORT, 10),
    connectionLimit: parseInt(DB_CONNECTION_LIMIT, 10),
    queueLimit: parseInt(DB_QUEUE_LIMIT, 10),
    waitForConnections: true,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000, // 10 seconds
});

// Intercept database queries for logging and performance metrics
export const query = async (sql: string, params?: any[]) => {
    const start = Date.now();

    try {
        const [results] = await pool.query(sql, params);
        const duration = Date.now() - start;

        // Log slow queries (>100ms)
        if (duration > 100) {
            logger.warn({
                message: 'Slow query detected',
                sql: sql.substring(0, 200), // Truncate very long queries
                params,
                duration: `${duration}ms`
            });
        }

        return results;
    } catch (error: any) {
        const duration = Date.now() - start;

        logger.error({
            message: 'Database query error',
            sql: sql.substring(0, 200),
            params,
            duration: `${duration}ms`,
            error: error.message,
            code: error.code
        });

        throw error;
    }
};

// Wrapper for transactions
export const transaction = async <T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const result = await callback(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// Initialize database connection
export const initializeDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        logger.info('Database connection established successfully');
        connection.release();
        return true;
    } catch (error: any) {
        logger.error('Failed to establish database connection:', error.message);
        throw error;
    }
};