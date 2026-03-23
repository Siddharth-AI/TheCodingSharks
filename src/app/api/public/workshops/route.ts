import { NextRequest } from 'next/server';
import { WorkshopService } from '@/backend/services/workshop';
import { successResponse, errorResponse } from '@/utils/response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');

    const result = await WorkshopService.getPublicWorkshops(page, limit);
    return Response.json(successResponse('Workshops fetched', result));
  } catch (error) {
    return Response.json(errorResponse('Failed to fetch workshops', (error as Error).message), { status: 500 });
  }
}
