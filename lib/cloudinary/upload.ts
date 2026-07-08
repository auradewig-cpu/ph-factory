import { cloudinary } from './client';
import { fileTypeFromBuffer } from 'file-type';

type AssetType = 'image' | 'video_frame' | 'audio' | 'reference_photo';

interface UploadParams {
  file: Buffer | string;
  projectId: number;
  type: AssetType;
  mimeType?: string;
}

interface UploadResult {
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
}

type CloudinaryResourceType = 'image' | 'video' | 'raw';

const TYPE_RESOURCE: Record<AssetType, CloudinaryResourceType> = {
  image: 'image',
  video_frame: 'image',
  audio: 'video',
  reference_photo: 'image',
};

export async function uploadAsset(params: UploadParams): Promise<UploadResult> {
  const folder = `ph-factory/${params.projectId}/${params.type}`;

  let fileStr: string;
  if (typeof params.file === 'string') {
    fileStr = params.file;
  } else {
    let mime = params.mimeType;
    if (!mime) {
      const detected = await fileTypeFromBuffer(params.file);
      mime = detected?.mime ?? (params.type === 'audio' ? 'audio/mpeg' : 'application/octet-stream');
    }
    fileStr = `data:${mime};base64,${params.file.toString('base64')}`;
  }

  const result = await cloudinary.uploader.upload(fileStr, {
    folder,
    resource_type: TYPE_RESOURCE[params.type],
    use_filename: true,
    unique_filename: true,
  });

  return {
    cloudinaryUrl: result.secure_url,
    cloudinaryPublicId: result.public_id,
  };
}

export async function deleteAsset(publicId: string, resourceType: CloudinaryResourceType): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
