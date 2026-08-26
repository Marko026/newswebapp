export function cloudinaryImageUrl(url: string, width: number, height?: number) {
  const marker = "/image/upload/";
  if (!url.includes(marker)) return url;
  const crop = height ? `w_${width},h_${height},c_fill,g_auto` : `w_${width},c_limit`;
  return url.replace(marker, `${marker}f_auto,q_auto,${crop}/`);
}
