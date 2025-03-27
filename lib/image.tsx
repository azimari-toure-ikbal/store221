"use client";

import { IKImage } from "imagekitio-next";
import React from "react";

type ImageProps = {
  path: string;
  width?: number;
  height?: number;
  fill?: boolean;
  alt: string;
  loading?: "lazy";
  lqip?: { active: boolean; quality: number; blur: number };
  className?: string;
};

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

const Image: React.FC<ImageProps> = (props) => {
  return <IKImage urlEndpoint={urlEndpoint} {...props} />;
};

export default Image;
