import { WorkshopModel } from '@/backend/models/workshop';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import type { CreateWorkshopInput, UpdateWorkshopInput, WorkshopRegistrationInput } from '@/validators/workshop';
import type { Workshop, WorkshopRegistration, WorkshopWithRegistrations, PaginatedResponse } from '@/types';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export class WorkshopService {
  static async getAll(page = 1, limit = 10, includeDeleted = false): Promise<PaginatedResponse<Workshop>> {
    return WorkshopModel.findAllAdmin(page, limit, includeDeleted);
  }

  static async getById(id: string): Promise<WorkshopWithRegistrations> {
    const workshop = await WorkshopModel.findByIdAdmin(id);
    if (!workshop) throw new Error('Workshop not found');
    return workshop;
  }

  static async create(
    input: CreateWorkshopInput,
    imageFile: File | null,
    userId: string
  ): Promise<Workshop> {
    const slug = input.slug || generateSlug(input.title);

    let imageData: {
      img_original_name?: string;
      base_url?: string;
      img_name?: string;
      img_type?: string;
    } = {};

    if (imageFile) {
      const uploaded = await uploadToCloudinary(imageFile, 'codingsharks/workshops');
      imageData = {
        img_original_name: imageFile.name,
        base_url: uploaded.secure_url,
        img_name: uploaded.public_id,
        img_type: uploaded.format,
      };
    }

    return WorkshopModel.create({
      ...input,
      slug,
      topics: input.topics ?? [],
      created_by: userId,
      ...imageData,
    });
  }

  static async update(
    id: string,
    input: UpdateWorkshopInput,
    imageFile: File | null,
    userId: string
  ): Promise<Workshop> {
    const existing = await WorkshopModel.findByIdAdmin(id);
    if (!existing) throw new Error('Workshop not found');

    let imageData: {
      img_original_name?: string;
      base_url?: string;
      img_name?: string;
      img_type?: string;
    } = {};

    if (imageFile) {
      if (existing.img_name) {
        await deleteFromCloudinary(existing.img_name).catch(() => {});
      }
      const uploaded = await uploadToCloudinary(imageFile, 'codingsharks/workshops');
      imageData = {
        img_original_name: imageFile.name,
        base_url: uploaded.secure_url,
        img_name: uploaded.public_id,
        img_type: uploaded.format,
      };
    }

    return WorkshopModel.update(id, { ...input, updated_by: userId, ...imageData });
  }

  static async softDelete(id: string, userId: string): Promise<void> {
    const workshop = await WorkshopModel.findByIdAdmin(id);
    if (!workshop) throw new Error('Workshop not found');
    await WorkshopModel.softDelete(id, userId);
  }

  static async toggleStatus(id: string, userId: string): Promise<Workshop> {
    return WorkshopModel.toggleStatus(id, userId);
  }

  // ─── Public ─────────────────────────────────────────────────────────────────

  static async getPublicWorkshops(page = 1, limit = 9): Promise<PaginatedResponse<Workshop>> {
    return WorkshopModel.findAllPublic(page, limit);
  }

  static async getBySlug(slug: string): Promise<Workshop> {
    const workshop = await WorkshopModel.findBySlug(slug);
    if (!workshop) throw new Error('Workshop not found');
    return workshop;
  }

  // ─── Registration ────────────────────────────────────────────────────────────

  static async register(
    workshopId: string,
    input: WorkshopRegistrationInput
  ): Promise<WorkshopRegistration> {
    const existing = await WorkshopModel.findRegistrationByEmail(workshopId, input.email);
    if (existing) throw new Error('You have already registered for this workshop');
    return WorkshopModel.register(workshopId, input.name, input.email, input.phone);
  }
}
