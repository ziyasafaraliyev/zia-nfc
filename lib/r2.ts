import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL?.replace(/\/$/, "");

export function isR2Configured(): boolean {
  return Boolean(accountId && accessKeyId && secretAccessKey && bucketName && publicUrl);
}

function getR2Client(): S3Client | null {
  if (!isR2Configured()) return null;

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
  });
}

export async function uploadToR2(
  path: string,
  buffer: Buffer,
  contentType: string,
): Promise<string | null> {
  const client = getR2Client();
  if (!client || !bucketName || !publicUrl) return null;

  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: cleanPath,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return `${publicUrl}/${cleanPath}`;
}

export async function deleteFromR2(path: string): Promise<boolean> {
  const client = getR2Client();
  if (!client || !bucketName) return false;

  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: cleanPath,
      }),
    );
    return true;
  } catch (err) {
    console.error("Failed to delete from Cloudflare R2:", err);
    return false;
  }
}
