import { AdminModel } from '@/backend/models/admin';
import { comparePassword } from '@/lib/bcrypt';
import { signAccessToken, signRefreshToken, verifyRefreshToken, JWTPayload } from '@/lib/jwt';
import type { LoginInput } from '@/validators/auth';

export class AuthService {
  static async login(input: LoginInput): Promise<{
    user: { id: string; email: string; full_name: string; role: string };
    accessToken: string;
    refreshToken: string;
  }> {
    const admin = await AdminModel.findByEmail(input.email);
    if (!admin) throw new Error('Invalid email or password');

    const isPasswordValid = await comparePassword(input.password, admin.password);
    if (!isPasswordValid) throw new Error('Invalid email or password');

    const payload: JWTPayload = { userId: admin.id, email: admin.email, role: admin.role };
    return {
      user: { id: admin.id, email: admin.email, full_name: admin.full_name, role: admin.role },
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    };
  }

  static async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = verifyRefreshToken(refreshToken);
    const admin = await AdminModel.findById(payload.userId);
    if (!admin) throw new Error('User not found');

    const newPayload: JWTPayload = { userId: admin.id, email: admin.email, role: admin.role };
    return {
      accessToken: signAccessToken(newPayload),
      refreshToken: signRefreshToken(newPayload),
    };
  }
}
