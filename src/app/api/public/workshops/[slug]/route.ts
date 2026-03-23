import { NextRequest } from 'next/server';
import { WorkshopService } from '@/backend/services/workshop';
import { successResponse, errorResponse } from '@/utils/response';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const workshop = await WorkshopService.getBySlug(slug);
    return Response.json(successResponse('Workshop fetched', workshop));
  } catch (error) {
    return Response.json(errorResponse('Workshop not found', (error as Error).message), { status: 404 });
  }
}
