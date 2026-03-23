import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/middlewares/auth';
import { WorkshopService } from '@/backend/services/workshop';
import { createWorkshopSchema } from '@/validators/workshop';
import { successResponse, errorResponse } from '@/utils/response';

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    const result = await WorkshopService.getAll(page, limit, includeDeleted);
    return Response.json(successResponse('Workshops fetched', result));
  } catch (error) {
    return Response.json(errorResponse('Failed to fetch workshops', (error as Error).message), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    const topicsRaw = formData.get('topics');
    const topics = topicsRaw ? JSON.parse(topicsRaw as string) : [];

    const g = (key: string) => (formData.get(key) as string | null) ?? undefined;

    const body = {
      slug: formData.get('slug') as string,
      crm_workshop_name: formData.get('crm_workshop_name') as string,
      title: formData.get('title') as string,
      tagline: g('tagline'),
      description: g('description'),
      short_description: g('short_description'),
      event_date: g('event_date'),
      event_time: g('event_time'),
      duration: g('duration'),
      mode: (formData.get('mode') as 'online' | 'offline') || 'online',
      platform: g('platform'),
      instructor_name: g('instructor_name'),
      instructor_bio: g('instructor_bio'),
      topics,
      price: g('price') || 'Free',
      is_free: formData.get('is_free') !== 'false',
      seats_available: formData.get('seats_available') ? Number(formData.get('seats_available')) : undefined,
      is_active: formData.get('is_active') !== 'false',
    };

    const validation = createWorkshopSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        errorResponse('Validation failed', validation.error.issues[0].message),
        { status: 400 }
      );
    }

    const workshop = await WorkshopService.create(validation.data, imageFile, auth.user.userId);
    return Response.json(successResponse('Workshop created', workshop), { status: 201 });
  } catch (error) {
    return Response.json(errorResponse('Failed to create workshop', (error as Error).message), { status: 500 });
  }
}
