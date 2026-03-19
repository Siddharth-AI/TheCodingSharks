import { NextRequest } from 'next/server';
import { AuthService } from '@/backend/services/auth';
import { successResponse, errorResponse } from '@/utils/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;
    if (!refreshToken) {
      return Response.json(errorResponse('Refresh token required'), { status: 400 });
    }

    const tokens = await AuthService.refreshToken(refreshToken);
    return Response.json(successResponse('Token refreshed', tokens), { status: 200 });
  } catch (error) {
    return Response.json(
      errorResponse('Token refresh failed', (error as Error).message),
      { status: 401 }
    );
  }
}
