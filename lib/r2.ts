import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL?.replace(/\/$/, "");

export function isR2Configured(): boolean {
  return Boolean(accountId && accessKeyId && secretAccessKey && bucketName && publicUrl);
}

export function getR2PublicBaseUrl(): string | null {
  return publicUrl ?? null;
}

/** True when URL is served from our R2 public base (or *.r2.dev). */
export function isR2PublicUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (publicUrl) {
      const base = new URL(publicUrl);
      if (u.origin === base.origin) return true;
    }
    return u.hostname.endsWith(".r2.dev");
  } catch {
    return false;
  }
}

/**
 * Object key inside the R2 bucket from a public media URL.
 * e.g. https://pub-xxx.r2.dev/avatars/slug/uuid.webp → avatars/slug/uuid.webp
 */
export function r2KeyFromPublicUrl(url: string): string | null {
  if (!isR2PublicUrl(url)) return null;
  try {
    const u = new URL(url);
    if (publicUrl) {
      const base = new URL(publicUrl);
      // Public base may include a path prefix (custom domain + folder)
      if (u.origin === base.origin && u.pathname.startsWith(base.pathname)) {
        const rest = u.pathname.slice(base.pathname.length).replace(/^\/+/, "");
        return rest ? decodeURIComponent(rest) : null;
      }
    }
    const key = u.pathname.replace(/^\/+/, "");
    return key ? decodeURIComponent(key) : null;
  } catch {
    return null;
  }
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
): Promise<string> {
  const client = getR2Client();
  if (!client || !bucketName || !publicUrl) {
    throw new Error(
      "Cloudflare R2 is not configured. Set CLOUDFLARE_R2_* env vars.",
    );
  }

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

  // Public URL stored in Supabase columns (avatar_url, gallery, …)
  return `${publicUrl}/${cleanPath}`;
}

export async function deleteFromR2(path: string): Promise<boolean> {
  const client = getR2Client();
  if (!client || !bucketName) return false;

  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  if (!cleanPath) return false;

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

/** Best-effort batch delete of object keys. */
export async function deleteManyFromR2(paths: string[]): Promise<void> {
  const client = getR2Client();
  if (!client || !bucketName || paths.length === 0) return;

  const keys = [
    ...new Set(
      paths
        .map((p) => (p.startsWith("/") ? p.slice(1) : p).trim())
        .filter(Boolean),
    ),
  ];
  if (keys.length === 0) return;

  // R2/S3 DeleteObjects accepts max 1000 keys per request
  for (let i = 0; i < keys.length; i += 1000) {
    const chunk = keys.slice(i, i + 1000);
    try {
      await client.send(
        new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: {
            Objects: chunk.map((Key) => ({ Key })),
            Quiet: true,
          },
        }),
      );
    } catch (err) {
      console.error("Failed batch delete from Cloudflare R2:", err);
      // Fallback: one-by-one
      await Promise.all(chunk.map((key) => deleteFromR2(key)));
    }
  }
}

/** Delete every object under a key prefix (e.g. avatars/my-slug/). */
export async function deletePrefixFromR2(prefix: string): Promise<void> {
  const client = getR2Client();
  if (!client || !bucketName) return;

  let cleanPrefix = prefix.startsWith("/") ? prefix.slice(1) : prefix;
  if (cleanPrefix && !cleanPrefix.endsWith("/")) {
    cleanPrefix = `${cleanPrefix}/`;
  }
  if (!cleanPrefix) return;

  let continuationToken: string | undefined;
  do {
    const listed = await client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: cleanPrefix,
        ContinuationToken: continuationToken,
      }),
    );

    const keys = (listed.Contents ?? [])
      .map((obj) => obj.Key)
      .filter((k): k is string => Boolean(k));

    if (keys.length > 0) {
      await deleteManyFromR2(keys);
    }

    continuationToken = listed.IsTruncated
      ? listed.NextContinuationToken
      : undefined;
  } while (continuationToken);
}
