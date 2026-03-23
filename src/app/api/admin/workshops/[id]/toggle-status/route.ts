import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/middlewares/auth';
import { WorkshopService } from '@/backend/services/workshop';
import { successResponse, errorResponse } from '@/utils/response';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(request);
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    const workshop = await WorkshopService.toggleStatus(id, auth.user.userId);
    return Response.json(successResponse('Status toggled', workshop));
  } catch (error) {
    return Response.json(errorResponse('Failed to toggle status', (error as Error).message), { status: 500 });
  }
}
