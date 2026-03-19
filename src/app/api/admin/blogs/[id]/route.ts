import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/middlewares/auth';
import { BlogService } from '@/backend/services/blog';
import { updateBlogSchema } from '@/validators/blog';
import { successResponse, errorResponse } from '@/utils/response';

// GET /api/admin/blogs/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    const blog = await BlogService.getById(id);
    return Response.json(successResponse('Blog fetched', blog));
  } catch (error) {
    return Response.json(errorResponse('Blog not found', (error as Error).message), { status: 404 });
  }
}

// PUT /api/admin/blogs/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    const body: Record<string, unknown> = {};
    if (formData.get('title')) body.title = formData.get('title');
    if (formData.get('slug')) body.slug = formData.get('slug');
    if (formData.get('excerpt') !== null) body.excerpt = formData.get('excerpt');
    if (formData.get('description') !== null) body.description = formData.get('description');
    if (formData.get('read_time')) body.read_time = Number(formData.get('read_time'));
    if (formData.get('is_active') !== null) body.is_active = formData.get('is_active') !== 'false';

    const validation = updateBlogSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        errorResponse('Validation failed', validation.error.issues[0].message),
        { status: 400 }
      );
    }

    const blog = await BlogService.update(id, validation.data, imageFile, auth.user.userId);
    return Response.json(successResponse('Blog updated', blog));
  } catch (error) {
    return Response.json(errorResponse('Failed to update blog', (error as Error).message), { status: 500 });
  }
}

// DELETE /api/admin/blogs/[id] - soft delete
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    await BlogService.softDelete(id, auth.user.userId);
    return Response.json(successResponse('Blog deleted', null));
  } catch (error) {
    return Response.json(errorResponse('Failed to delete blog', (error as Error).message), { status: 500 });
  }
}
