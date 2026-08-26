import Image from "next/image";
import { cloudinaryImageUrl } from "@/lib/media-url";

export function CloudinaryImage({ src, alt, width, height, className, sizes, fetchPriority, loading = "lazy" }: { src: string; alt: string; width: number; height: number; className?: string; sizes: string; fetchPriority?: "high" | "low" | "auto"; loading?: "lazy" | "eager" }) {
  return <Image src={cloudinaryImageUrl(src, width, height)} alt={alt} width={width} height={height} className={className} sizes={sizes} fetchPriority={fetchPriority} loading={loading} unoptimized />;
}
