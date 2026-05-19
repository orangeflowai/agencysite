"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface FadeImageProps extends Omit<ImageProps, 'onLoad'> {
  className?: string;
}

export function FadeImage({ className = "", ...props }: FadeImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      {...props}
      className={`transition-opacity duration-500 ${
        isLoaded ? "opacity-100" : "opacity-0"
      } ${className}`}
      onLoad={() => setIsLoaded(true)}
    />
  );
}
