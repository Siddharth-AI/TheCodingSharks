import { NextRequest } from 'next/server';
import { verifyAccessToken, JWTPayload } from '@/lib/jwt';
import { errorResponse } from '@/utils/response';

function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.substring(7);
}

export async function authenticateRequest(
  request: NextRequest
): Promise<{ user: JWTPayload } | Response> {
  const token = extractToken(request);
  if (!token) {
    return Response.json(errorResponse('Authentication required', 'No token provided'), { status: 401 });
  }
  try {
    const user = verifyAccessToken(token);
    return { user };
  } catch (error) {
    return Response.json(
      errorResponse('Invalid or expired token', (error as Error).message),
      { status: 401 }
    );
  }
}

export function hasRole(user: JWTPayload, requiredRole: 'admin' | 'super_admin'): boolean {
  if (requiredRole === 'super_admin') return user.role === 'super_admin';
  return user.role === 'admin' || user.role === 'super_admin';
}

export async function requireRole(
  request: NextRequest,
  role: 'admin' | 'super_admin' = 'admin'
): Promise<{ user: JWTPayload } | Response> {
  const authResult = await authenticateRequest(request);
  if (authResult instanceof Response) return authResult;
  if (!hasRole(authResult.user, role)) {
    return Response.json(
      errorResponse('Insufficient permissions', 'Role not authorized'),
      { status: 403 }
    );
  }
  return authResult;
}
