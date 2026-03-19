import { NextRequest } from 'next/server';
import { AuthService } from '@/backend/services/auth';
import { loginSchema } from '@/validators/auth';
import { successResponse, errorResponse } from '@/utils/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        errorResponse('Validation failed', validation.error.issues[0].message),
        { status: 400 }
      );
    }

    const result = await AuthService.login(validation.data);
    return Response.json(successResponse('Login successful', result), { status: 200 });
  } catch (error) {
    return Response.json(
      errorResponse('Login failed', (error as Error).message),
      { status: 401 }
    );
  }
}
