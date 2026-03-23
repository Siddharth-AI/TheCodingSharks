import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/middlewares/auth';
import { WorkshopService } from '@/backend/services/workshop';
import { updateWorkshopSchema } from '@/validators/workshop';
import { successResponse, errorResponse } from '@/utils/response';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    const workshop = await WorkshopService.getById(id);
    return Response.json(successResponse('Workshop fetched', workshop));
  } catch (error) {
    return Response.json(errorResponse('Workshop not found', (error as Error).message), { status: 404 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    const body: Record<string, unknown> = {};
    const fields = [
      'slug', 'crm_workshop_name', 'title', 'tagline', 'description', 'short_description',
      'event_date', 'event_time', 'duration', 'mode', 'platform',
      'instructor_name', 'instructor_bio', 'price',
    ];
    for (const field of fields) {
      const val = formData.get(field);
      if (val !== null) body[field] = val;
    }
    if (formData.get('is_free') !== null) body.is_free = formData.get('is_free') !== 'false';
    if (formData.get('is_active') !== null) body.is_active = formData.get('is_active') !== 'false';
    if (formData.get('seats_available')) body.seats_available = Number(formData.get('seats_available'));
    const topicsRaw = formData.get('topics');
    if (topicsRaw) body.topics = JSON.parse(topicsRaw as string);

    const validation = updateWorkshopSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        errorResponse('Validation failed', validation.error.issues[0].message),
        { status: 400 }
      );
    }

    const workshop = await WorkshopService.update(id, validation.data, imageFile, auth.user.userId);
    return Response.json(successResponse('Workshop updated', workshop));
  } catch (error) {
    return Response.json(errorResponse('Failed to update workshop', (error as Error).message), { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    await WorkshopService.softDelete(id, auth.user.userId);
    return Response.json(successResponse('Workshop deleted', null));
  } catch (error) {
    return Response.json(errorResponse('Failed to delete workshop', (error as Error).message), { status: 500 });
  }
}
