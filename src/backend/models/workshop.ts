import { supabaseAdmin } from '@/lib/supabase';
import type { Workshop, WorkshopRegistration, WorkshopWithRegistrations, PaginatedResponse } from '@/types';

export class WorkshopModel {
  // ─── Admin queries ──────────────────────────────────────────────────────────

  static async findAllAdmin(
    page = 1,
    limit = 10,
    includeDeleted = false
  ): Promise<PaginatedResponse<Workshop>> {
    const offset = (page - 1) * limit;

    let countQuery = supabaseAdmin!.from('workshop').select('*', { count: 'exact', head: true });
    if (!includeDeleted) countQuery = countQuery.eq('is_deleted', false);
    const { count } = await countQuery;
    const total = count || 0;

    let dataQuery = supabaseAdmin!
      .from('workshop')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (!includeDeleted) dataQuery = dataQuery.eq('is_deleted', false);

    const { data } = await dataQuery;
    return { data: (data || []) as Workshop[], meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  static async findByIdAdmin(id: string): Promise<WorkshopWithRegistrations | null> {
    const { data: workshop, error } = await supabaseAdmin!
      .from('workshop')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !workshop) return null;

    const { data: registrations } = await supabaseAdmin!
      .from('workshop_registration')
      .select('*')
      .eq('workshop_id', id)
      .order('created_at', { ascending: false });

    return { ...(workshop as Workshop), registrations: (registrations || []) as WorkshopRegistration[] };
  }

  static async create(workshopData: Partial<Workshop>): Promise<Workshop> {
    const { data, error } = await supabaseAdmin!
      .from('workshop')
      .insert(workshopData)
      .select()
      .single();
    if (error) throw new Error(`Failed to create workshop: ${error.message}`);
    return data as Workshop;
  }

  static async update(id: string, workshopData: Partial<Workshop>): Promise<Workshop> {
    const { data, error } = await supabaseAdmin!
      .from('workshop')
      .update({ ...workshopData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(`Failed to update workshop: ${error.message}`);
    return data as Workshop;
  }

  static async softDelete(id: string, userId: string): Promise<void> {
    const { error } = await supabaseAdmin!
      .from('workshop')
      .update({ is_deleted: true, is_active: false, updated_by: userId, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw new Error(`Failed to delete workshop: ${error.message}`);
  }

  static async toggleStatus(id: string, userId: string): Promise<Workshop> {
    const { data: current } = await supabaseAdmin!.from('workshop').select('is_active').eq('id', id).single();
    const { data, error } = await supabaseAdmin!
      .from('workshop')
      .update({ is_active: !current?.is_active, updated_by: userId, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(`Failed to toggle status: ${error.message}`);
    return data as Workshop;
  }

  // ─── Public queries ─────────────────────────────────────────────────────────

  static async findAllPublic(page = 1, limit = 9): Promise<PaginatedResponse<Workshop>> {
    const offset = (page - 1) * limit;
    const { count } = await supabaseAdmin!
      .from('workshop')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('is_deleted', false);
    const total = count || 0;

    const { data } = await supabaseAdmin!
      .from('workshop')
      .select('*')
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('event_date', { ascending: true })
      .range(offset, offset + limit - 1);

    return { data: (data || []) as Workshop[], meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  static async findBySlug(slug: string): Promise<Workshop | null> {
    const { data, error } = await supabaseAdmin!
      .from('workshop')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();
    if (error || !data) return null;
    return data as Workshop;
  }

  // ─── Registration ────────────────────────────────────────────────────────────

  static async register(
    workshopId: string,
    name: string,
    email: string,
    phone: string
  ): Promise<WorkshopRegistration> {
    const { data, error } = await supabaseAdmin!
      .from('workshop_registration')
      .insert({ workshop_id: workshopId, name, email, phone })
      .select()
      .single();
    if (error) throw new Error(`Failed to register: ${error.message}`);
    return data as WorkshopRegistration;
  }

  static async findRegistrationByEmail(workshopId: string, email: string): Promise<WorkshopRegistration | null> {
    const { data } = await supabaseAdmin!
      .from('workshop_registration')
      .select('*')
      .eq('workshop_id', workshopId)
      .eq('email', email)
      .single();
    return data as WorkshopRegistration | null;
  }
}
