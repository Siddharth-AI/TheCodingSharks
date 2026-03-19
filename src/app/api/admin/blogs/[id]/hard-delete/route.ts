import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/middlewares/auth';
import { BlogService } from '@/backend/services/blog';
import { successResponse, errorResponse } from '@/utils/response';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    await BlogService.hardDelete(id);
    return Response.json(successResponse('Blog permanently deleted', null));
  } catch (error) {
    return Response.json(errorResponse('Failed to permanently delete blog', (error as Error).message), { status: 500 });
  }
}
