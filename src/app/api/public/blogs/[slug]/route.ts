import { NextRequest } from 'next/server';
import { BlogService } from '@/backend/services/blog';
import { successResponse, errorResponse } from '@/utils/response';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const blog = await BlogService.getBySlug(slug);
    return Response.json(successResponse('Blog fetched', blog));
  } catch (error) {
    return Response.json(errorResponse('Blog not found', (error as Error).message), { status: 404 });
  }
}
