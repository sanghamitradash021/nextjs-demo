


import sequelize from "@/db/models";
import { QueryTypes } from "sequelize";
import bcrypt from "bcrypt";
import User from "../../db/models/user";

/**
 * Repository for handling user-related database operations such as creating, updating, 
 * deleting, and validating user credentials.
 * 
 * @class UserRepository
 */
class UserRepository {
    /**
     * Creates a new user and inserts it into the database.
     * 
     * @param {Partial<User>} userData - The data for the new user.
     * @param {string} userData.username - The username of the user.
     * @param {string} userData.email - The email of the user.
     * @param {string} userData.password - The password of the user.
     * @param {string} userData.fullname - The full name of the user.
     * @param {string} userData.role - The role of the user (e.g., admin, user).
     * @returns {Promise<User | null>} - A promise that resolves to the created user, or null if the creation failed.
     */
    async create(userData: Partial<User>): Promise<User | null> {
        const { username, email, password, fullname, role } = userData;

        // Hash the password if it exists
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        const result = await sequelize.query(
            `INSERT INTO Users (username, email, password, fullname, role, createdAt, updatedAt)
             VALUES (:username, :email, :password, :fullname, :role, NOW(), NOW())`,
            {
                replacements: {
                    username,
                    email,
                    password: hashedPassword,
                    fullname,
                    role,
                },
                type: QueryTypes.INSERT,
            }
        );

        // Retrieve the last inserted ID
        const [idResult] = await sequelize.query("SELECT LAST_INSERT_ID() as id", {
            type: QueryTypes.SELECT,
        });

        const user_id = (idResult as { id: number }).id;
        if (!user_id) return null;

        return this.findById(user_id);
    }

    /**
     * Retrieves a user by their ID.
     * 
     * @param {number} id - The ID of the user to retrieve.
     * @returns {Promise<User | null>} - A promise that resolves to the user data if found, or null if not found.
     */
    async findById(id: number): Promise<User | null> {
        const [user]: any[] = await sequelize.query(
            "SELECT * FROM Users WHERE user_id = :id",
            {
                replacements: { id },
                type: QueryTypes.SELECT,
            }
        );

        return user ? (user as User) : null;
    }

    /**
     * Retrieves a user by their email address.
     * 
     * @param {string} email - The email of the user to retrieve.
     * @returns {Promise<User | null>} - A promise that resolves to the user data if found, or null if not found.
     */
    async findByEmail(email: string): Promise<User | null> {
        const [user]: any[] = await sequelize.query(
            "SELECT * FROM Users WHERE email = :email",
            {
                replacements: { email },
                type: QueryTypes.SELECT,
            }
        );

        return user ? (user as User) : null;
    }

    /**
     * Validates a user's credentials by comparing the provided email and password.
     * 
     * @param {string} email - The email of the user to validate.
     * @param {string} password - The password to validate.
     * @returns {Promise<User | null>} - A promise that resolves to the user if credentials are valid, or null if not.
     */
    async validateCredentials(email: string, password: string): Promise<User | null> {
        const user = await this.findByEmail(email);
        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        return isPasswordValid ? user : null;
    }

    /**
     * Updates an existing user's data by their ID.
     * 
     * @param {number} id - The ID of the user to update.
     * @param {Partial<User>} userData - The data to update the user with.
     * @param {string} userData.username - The new username of the user.
     * @param {string} userData.email - The new email of the user.
     * @param {string} userData.password - The new password of the user.
     * @param {string} userData.fullname - The new full name of the user.
     * @param {string} userData.role - The new role of the user.
     * @returns {Promise<boolean>} - A promise that resolves to true if the update was successful, false otherwise.
     */
    async update(id: number, userData: Partial<User>): Promise<boolean> {
        const { username, email, password, fullname, role } = userData;

        let hashedPassword = undefined;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const result = await sequelize.query(
            `UPDATE Users SET username = :username, email = :email, 
             password = COALESCE(:password, password), fullname = :fullname, role = :role, updatedAt = NOW() 
             WHERE user_id = :id`,
            {
                replacements: { id, username, email, password: hashedPassword, fullname, role },
                type: QueryTypes.UPDATE,
            }
        );

        const affectedRows = Array.isArray(result) ? result[1] : 0;
        return affectedRows > 0;
    }

    /**
     * Deletes a user by their ID.
     * 
     * @param {number} id - The ID of the user to delete.
     * @returns {Promise<boolean>} - A promise that resolves to true if the deletion was successful, false otherwise.
     */
    async delete(id: number): Promise<boolean> {
        const result = await sequelize.query(
            "DELETE FROM Users WHERE user_id = :id",
            { replacements: { id }, type: QueryTypes.DELETE }
        );

        const affectedRows = Array.isArray(result) ? result[1] : 0;
        return affectedRows > 0;
    }
}

export default new UserRepository();
