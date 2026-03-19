import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

export { cloudinary };

export async function uploadToCloudinary(
  file: File | Buffer,
  folder: string,
  publicId?: string
): Promise<{
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}> {
  let buffer: Buffer;
  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } else {
    buffer = file;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: 'auto',
        overwrite: false,
        invalidate: true,
        quality: 'auto:good',
        flags: 'progressive',
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else if (result) {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            url: result.url,
            format: result.format || '',
            width: result.width || 0,
            height: result.height || 0,
            bytes: result.bytes || 0,
          });
        } else {
          reject(new Error('Cloudinary upload failed: No result'));
        }
      }
    );
    uploadStream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete from Cloudinary: ${msg}`);
  }
}

// Generate optimized URL with transformations
export function getOptimizedImageUrl(
  publicId: string,
  type: 'thumbnail' | 'card' | 'hero' = 'card'
): string {
  const base = { quality: 'auto:good', flags: 'progressive', secure: true };
  switch (type) {
    case 'thumbnail':
      return cloudinary.url(publicId, { ...base, width: 150, height: 150, crop: 'fill', gravity: 'center' });
    case 'card':
      return cloudinary.url(publicId, { ...base, width: 800, height: 450, crop: 'fill', gravity: 'center' });
    case 'hero':
      return cloudinary.url(publicId, { ...base, width: 1200, height: 630, crop: 'fill', gravity: 'center' });
    default:
      return cloudinary.url(publicId, base);
  }
}

export function extractPublicIdFromUrl(url: string): string | null {
  if (!url.includes('cloudinary.com')) return null;
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return null;
  const pathAfterUpload = url.substring(uploadIndex + '/upload/'.length);
  const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, '');
  return pathWithoutVersion.replace(/\.[^/.]+$/, '');
}
