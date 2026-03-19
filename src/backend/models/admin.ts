import { supabaseAdmin } from '@/lib/supabase';
import type { AdminUser } from '@/types';

export class AdminModel {
  static async findByEmail(email: string): Promise<AdminUser | null> {
    const { data, error } = await supabaseAdmin!
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();
    if (error || !data) return null;
    return data as AdminUser;
  }

  static async findById(id: string): Promise<AdminUser | null> {
    const { data, error } = await supabaseAdmin!
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();
    if (error || !data) return null;
    return data as AdminUser;
  }
}
