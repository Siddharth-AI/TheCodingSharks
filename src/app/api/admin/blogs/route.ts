import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/middlewares/auth';
import { BlogService } from '@/backend/services/blog';
import { createBlogSchema } from '@/validators/blog';
import { successResponse, errorResponse } from '@/utils/response';

// GET /api/admin/blogs - list blogs
export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    const result = await BlogService.getAll(page, limit, includeDeleted);
    return Response.json(successResponse('Blogs fetched', result));
  } catch (error) {
    return Response.json(errorResponse('Failed to fetch blogs', (error as Error).message), { status: 500 });
  }
}

// POST /api/admin/blogs - create blog
export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    const body = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      excerpt: formData.get('excerpt') as string | undefined,
      description: formData.get('description') as string | undefined,
      read_time: formData.get('read_time') ? Number(formData.get('read_time')) : undefined,
      is_active: formData.get('is_active') !== 'false',
    };

    const validation = createBlogSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        errorResponse('Validation failed', validation.error.issues[0].message),
        { status: 400 }
      );
    }

    const blog = await BlogService.create(validation.data, imageFile, auth.user.userId);
    return Response.json(successResponse('Blog created', blog), { status: 201 });
  } catch (error) {
    return Response.json(errorResponse('Failed to create blog', (error as Error).message), { status: 500 });
  }
}
