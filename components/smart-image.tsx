import Image, { type ImageProps } from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  /** When true, covers parent (parent must be position:relative) */
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  role?: string;
};

/**
 * Local assets → next/image (resize/WebP).
 * Remote (Supabase) → native <img>: next/image was pass-through full files
 * (multi‑MB) and can stall mobile NFC profile loads.
 */
export default function SmartImage({
  src,
  alt,
  className,
  width,
  height,
  fill,
  sizes,
  priority,
  role,
}: Props) {
  if (!src) return null;

  const isRemote = /^https?:\/\//i.test(src);

  if (isRemote) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          role={role}
          className={className ? `absolute inset-0 h-full w-full ${className}` : "absolute inset-0 h-full w-full"}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        role={role}
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
        role={role as ImageProps["role"]}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 100}
      height={height ?? 100}
      sizes={sizes}
      priority={priority}
      className={className}
      role={role as ImageProps["role"]}
    />
  );
}
