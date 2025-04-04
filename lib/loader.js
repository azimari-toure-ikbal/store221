"use client";

export default function myImageLoader({ src, width, height, quality }) {
  const isLocal = !src.startsWith("http");
  const query = new URLSearchParams();

  const imageOptimizationApi = "https://transform.minebar-sn.com";
  // Your NextJS application URL
  const baseUrl = "https://store221.com/";

  const fullSrc = `${baseUrl}${src}`;

  if (width) query.set("width", width);
  if (height) query.set("height", height);
  if (quality) query.set("quality", quality);

  if (isLocal && process.env.NEXT_PUBLIC_DEV_MODE === "false") {
    return src;
  }
  if (isLocal) {
    // console.log(`${imageOptimizationApi}/image/${fullSrc}?${query.toString()}`);

    return `${imageOptimizationApi}/image/${fullSrc}?${query.toString()}`;
  }

  // console.log(
  //   "src",
  //   `${imageOptimizationApi}/image/${src}?${query.toString()}`,
  // );

  return `${imageOptimizationApi}/image/${src}?${query.toString()}`;
}
