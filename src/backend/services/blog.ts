import { BlogModel } from '@/backend/models/blog';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import type { CreateBlogInput, UpdateBlogInput, CreateTagInput } from '@/validators/blog';
import type { Blog, BlogTag, BlogWithTags, PaginatedResponse } from '@/types';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export class BlogService {
  static async getAll(page = 1, limit = 10, includeDeleted = false): Promise<PaginatedResponse<Blog>> {
    return BlogModel.findAllAdmin(page, limit, includeDeleted);
  }

  static async getById(id: string): Promise<BlogWithTags> {
    const blog = await BlogModel.findByIdAdmin(id);
    if (!blog) throw new Error('Blog not found');
    return blog;
  }

  static async create(
    input: CreateBlogInput,
    imageFile: File | null,
    userId: string
  ): Promise<BlogWithTags> {
    const slug = input.slug || generateSlug(input.title);

    let imageData: {
      img_original_name?: string;
      base_url?: string;
      img_name?: string;
      img_type?: string;
    } = {};

    if (imageFile) {
      const uploaded = await uploadToCloudinary(imageFile, 'codingsharks/blogs');
      imageData = {
        img_original_name: imageFile.name,
        base_url: uploaded.secure_url,
        img_name: uploaded.public_id,
        img_type: uploaded.format,
      };
    }

    const blog = await BlogModel.create({
      title: input.title,
      slug,
      excerpt: input.excerpt,
      description: input.description,
      read_time: input.read_time,
      is_active: input.is_active ?? true,
      created_by: userId,
      ...imageData,
    });

    return { ...blog, tags: [] };
  }

  static async update(
    id: string,
    input: UpdateBlogInput,
    imageFile: File | null,
    userId: string
  ): Promise<BlogWithTags> {
    const existing = await BlogModel.findByIdAdmin(id);
    if (!existing) throw new Error('Blog not found');

    let imageData: {
      img_original_name?: string;
      base_url?: string;
      img_name?: string;
      img_type?: string;
    } = {};

    if (imageFile) {
      // Delete old image from Cloudinary if exists
      if (existing.img_name) {
        await deleteFromCloudinary(existing.img_name).catch(() => {});
      }
      const uploaded = await uploadToCloudinary(imageFile, 'codingsharks/blogs');
      imageData = {
        img_original_name: imageFile.name,
        base_url: uploaded.secure_url,
        img_name: uploaded.public_id,
        img_type: uploaded.format,
      };
    }

    const blog = await BlogModel.update(id, {
      ...input,
      updated_by: userId,
      ...imageData,
    });

    const updated = await BlogModel.findByIdAdmin(blog.id);
    return updated ?? { ...blog, tags: existing.tags };
  }

  static async softDelete(id: string, userId: string): Promise<void> {
    const blog = await BlogModel.findByIdAdmin(id);
    if (!blog) throw new Error('Blog not found');
    await BlogModel.softDelete(id, userId);
  }

  static async hardDelete(id: string): Promise<void> {
    const blog = await BlogModel.findByIdAdmin(id);
    if (!blog) throw new Error('Blog not found');
    if (blog.img_name) await deleteFromCloudinary(blog.img_name).catch(() => {});
    await BlogModel.hardDelete(id);
  }

  static async toggleStatus(id: string, userId: string): Promise<Blog> {
    return BlogModel.toggleStatus(id, userId);
  }

  // ─── Public ─────────────────────────────────────────────────────────────────

  static async getPublicBlogs(page = 1, limit = 9): Promise<PaginatedResponse<Blog>> {
    return BlogModel.findAllPublic(page, limit);
  }

  static async getBySlug(slug: string): Promise<BlogWithTags> {
    const blog = await BlogModel.findBySlug(slug);
    if (!blog) throw new Error('Blog not found');
    return blog;
  }

  // ─── Tags ────────────────────────────────────────────────────────────────────

  static async createTag(blogId: string, input: CreateTagInput, userId: string): Promise<BlogTag> {
    return BlogModel.createTag(blogId, input.name, userId);
  }

  static async deleteTag(tagId: string): Promise<void> {
    return BlogModel.deleteTag(tagId);
  }
}
