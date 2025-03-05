import { describe, test, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../app/api/comments/recipes/[recipeId]/route'; // Update this path
import CommentRepository from '../lib/repository/commentRepository';
import recipeRepository from '../lib/repository/recipeRepository';

// Properly mock the entire module
vi.mock('../lib/repository/commentRepository', async () => {
    const actual = await vi.importActual<typeof import('../lib/repository/commentRepository')>(
        '../lib/repository/commentRepository'
    );
    return {
        ...actual,
        addComment: vi.fn(),
    };
});

vi.mock('../lib/repository/recipeRepository', async () => {
    const actual = await vi.importActual<typeof import('../lib/repository/recipeRepository')>(
        '../lib/repository/recipeRepository'
    );
    return {
        ...actual,
        findById: vi.fn(),
    };
});

const mockedRecipeRepository = vi.mocked(recipeRepository);
const mockedCommentRepository = vi.mocked(CommentRepository);

describe('POST /comments', () => {
    test('should return 404 if recipe is not found', async () => {
        const req = {
            json: vi.fn().mockResolvedValue({ recipeId: '1', userId: 'user123', content: 'Nice recipe!' })
        } as unknown as NextRequest;

        mockedRecipeRepository.findById.mockResolvedValue(null);

        const res = await POST(req);
        expect(res.status).toBe(404);
        expect(await res.json()).toEqual({ message: 'Recipe not found' });
    });

    test('should return 403 if user is the owner of the recipe', async () => {
        const req = {
            json: vi.fn().mockResolvedValue({ recipeId: '1', userId: 'user123', content: 'Nice recipe!' })
        } as unknown as NextRequest;

        mockedRecipeRepository.findById.mockResolvedValue({ user_id: 'user123' });

        const res = await POST(req);
        expect(res.status).toBe(403);
        expect(await res.json()).toEqual({ message: "You can't comment on your own recipe" });
    });

    test('should return 500 if adding a comment fails', async () => {
        const req = {
            json: vi.fn().mockResolvedValue({ recipeId: '1', userId: 'user456', content: 'Nice recipe!' })
        } as unknown as NextRequest;

        mockedRecipeRepository.findById.mockResolvedValue({ user_id: 'user123' });
        mockedCommentRepository.addComment.mockResolvedValue(null);

        const res = await POST(req);
        expect(res.status).toBe(500);
        expect(await res.json()).toEqual({ message: 'Failed to add comment' });
    });

    test('should return 201 and the new comment when successfully added', async () => {
        const req = {
            json: vi.fn().mockResolvedValue({ recipeId: '1', userId: 'user456', content: 'Nice recipe!' })
        } as unknown as NextRequest;

        mockedRecipeRepository.findById.mockResolvedValue({ user_id: 'user123' });
        const newComment = { id: 'c1', recipeId: '1', userId: 'user456', content: 'Nice recipe!' };
        mockedCommentRepository.addComment.mockResolvedValue(newComment as any);

        const res = await POST(req);
        expect(res.status).toBe(201);
        expect(await res.json()).toEqual(newComment);
    });

    test('should return 500 on unexpected errors', async () => {
        const req = {
            json: vi.fn().mockRejectedValue(new Error('Unexpected error'))
        } as unknown as NextRequest;

        const res = await POST(req);
        expect(res.status).toBe(500);
        expect(await res.json()).toMatchObject({ message: 'Error adding comment' });
    });
});
