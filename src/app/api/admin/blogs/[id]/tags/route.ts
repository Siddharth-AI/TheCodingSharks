import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/middlewares/auth';
import { BlogService } from '@/backend/services/blog';
import { createTagSchema } from '@/validators/blog';
import { successResponse, errorResponse } from '@/utils/response';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    const body = await request.json();
    const validation = createTagSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        errorResponse('Validation failed', validation.error.issues[0].message),
        { status: 400 }
      );
    }

    const tag = await BlogService.createTag(id, validation.data, auth.user.userId);
    return Response.json(successResponse('Tag created', tag), { status: 201 });
  } catch (error) {
    return Response.json(errorResponse('Failed to create tag', (error as Error).message), { status: 500 });
  }
}
