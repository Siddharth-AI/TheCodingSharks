import { supabaseAdmin } from '@/lib/supabase';
import type { Blog, BlogTag, BlogWithTags, PaginatedResponse } from '@/types';

export class BlogModel {
  // ─── Admin queries ──────────────────────────────────────────────────────────

  static async findAllAdmin(
    page = 1,
    limit = 10,
    includeDeleted = false
  ): Promise<PaginatedResponse<Blog>> {
    const offset = (page - 1) * limit;

    let countQuery = supabaseAdmin!.from('blog').select('*', { count: 'exact', head: true });
    if (!includeDeleted) countQuery = countQuery.eq('is_deleted', false);
    const { count } = await countQuery;
    const total = count || 0;

    let dataQuery = supabaseAdmin!
      .from('blog')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (!includeDeleted) dataQuery = dataQuery.eq('is_deleted', false);

    const { data } = await dataQuery;
    return { data: (data || []) as Blog[], meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  static async findByIdAdmin(id: string): Promise<BlogWithTags | null> {
    const { data: blog, error } = await supabaseAdmin!
      .from('blog')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !blog) return null;

    const { data: tags } = await supabaseAdmin!
      .from('blog_tag')
      .select('*')
      .eq('blog_id', id)
      .eq('is_deleted', false);

    return { ...(blog as Blog), tags: (tags || []) as BlogTag[] };
  }

  static async create(blogData: Partial<Blog>): Promise<Blog> {
    const { data, error } = await supabaseAdmin!
      .from('blog')
      .insert(blogData)
      .select()
      .single();
    if (error) throw new Error(`Failed to create blog: ${error.message}`);
    return data as Blog;
  }

  static async update(id: string, blogData: Partial<Blog>): Promise<Blog> {
    const { data, error } = await supabaseAdmin!
      .from('blog')
      .update({ ...blogData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(`Failed to update blog: ${error.message}`);
    return data as Blog;
  }

  static async softDelete(id: string, userId: string): Promise<void> {
    const { error } = await supabaseAdmin!
      .from('blog')
      .update({ is_deleted: true, is_active: false, updated_by: userId, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw new Error(`Failed to delete blog: ${error.message}`);
  }

  static async hardDelete(id: string): Promise<void> {
    const { error } = await supabaseAdmin!.from('blog').delete().eq('id', id);
    if (error) throw new Error(`Failed to permanently delete blog: ${error.message}`);
  }

  static async toggleStatus(id: string, userId: string): Promise<Blog> {
    const { data: current } = await supabaseAdmin!.from('blog').select('is_active').eq('id', id).single();
    const { data, error } = await supabaseAdmin!
      .from('blog')
      .update({ is_active: !current?.is_active, updated_by: userId, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(`Failed to toggle status: ${error.message}`);
    return data as Blog;
  }

  // ─── Public queries ─────────────────────────────────────────────────────────

  static async findAllPublic(page = 1, limit = 9): Promise<PaginatedResponse<Blog>> {
    const offset = (page - 1) * limit;
    const { count } = await supabaseAdmin!
      .from('blog')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('is_deleted', false);
    const total = count || 0;

    const { data } = await supabaseAdmin!
      .from('blog')
      .select('*')
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    return { data: (data || []) as Blog[], meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  static async findBySlug(slug: string): Promise<BlogWithTags | null> {
    const { data: blog, error } = await supabaseAdmin!
      .from('blog')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();
    if (error || !blog) return null;

    const { data: tags } = await supabaseAdmin!
      .from('blog_tag')
      .select('*')
      .eq('blog_id', (blog as Blog).id)
      .eq('is_active', true)
      .eq('is_deleted', false);

    return { ...(blog as Blog), tags: (tags || []) as BlogTag[] };
  }

  // ─── Tags ────────────────────────────────────────────────────────────────────

  static async createTag(blogId: string, name: string, userId: string): Promise<BlogTag> {
    const { data, error } = await supabaseAdmin!
      .from('blog_tag')
      .insert({ blog_id: blogId, name, created_by: userId })
      .select()
      .single();
    if (error) throw new Error(`Failed to create tag: ${error.message}`);
    return data as BlogTag;
  }

  static async deleteTag(tagId: string): Promise<void> {
    const { error } = await supabaseAdmin!
      .from('blog_tag')
      .update({ is_deleted: true, is_active: false })
      .eq('id', tagId);
    if (error) throw new Error(`Failed to delete tag: ${error.message}`);
  }
}
