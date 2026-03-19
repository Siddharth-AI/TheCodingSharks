import { NextRequest } from 'next/server';
import { BlogService } from '@/backend/services/blog';
import { successResponse, errorResponse } from '@/utils/response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');

    const result = await BlogService.getPublicBlogs(page, limit);
    return Response.json(successResponse('Blogs fetched', result));
  } catch (error) {
    return Response.json(errorResponse('Failed to fetch blogs', (error as Error).message), { status: 500 });
  }
}
