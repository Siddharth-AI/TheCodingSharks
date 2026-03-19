import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashPassword } from '@/lib/bcrypt';
import { successResponse, errorResponse } from '@/utils/response';
import { z } from 'zod';

const registerSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  role: z.enum(['admin', 'super_admin']).optional().default('admin'),
  secret_key: z.string(), // prevent public registration
});

const REGISTER_SECRET = process.env.REGISTER_SECRET || 'codingsharks-register-2024';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        errorResponse('Validation failed', validation.error.issues[0].message),
        { status: 400 }
      );
    }

    const { full_name, email, password, role, secret_key } = validation.data;

    // Guard against public access
    if (secret_key !== REGISTER_SECRET) {
      return Response.json(errorResponse('Invalid secret key'), { status: 403 });
    }

    // Check duplicate
    const { data: existing } = await supabaseAdmin!
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return Response.json(errorResponse('Email already registered'), { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const { data, error } = await supabaseAdmin!
      .from('admin_users')
      .insert({ full_name, email, password: hashedPassword, role })
      .select('id, full_name, email, role, created_at')
      .single();

    if (error) throw new Error(error.message);

    return Response.json(successResponse('Admin registered successfully', data), { status: 201 });
  } catch (error) {
    return Response.json(
      errorResponse('Registration failed', (error as Error).message),
      { status: 500 }
    );
  }
}
