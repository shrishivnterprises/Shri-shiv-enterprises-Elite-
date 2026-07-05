/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ImageOff } from "lucide-react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  language?: "en" | "hi";
  size?: "sm" | "md" | "lg";
}

export default function ProductImage({
  src,
  alt,
  className = "w-full h-full object-cover",
  containerClassName = "relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950",
  language = "en",
  size = "md",
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div 
        className={`${containerClassName} border border-slate-200/30 dark:border-slate-800/40 select-none p-4 flex flex-col items-center justify-center text-center`}
      >
        <ImageOff 
          className={`text-slate-300 dark:text-slate-700 animate-pulse ${
            size === "sm" ? "h-5 w-5 mb-1" : size === "md" ? "h-8 w-8 mb-2" : "h-12 w-12 mb-3"
          }`} 
        />
        <span 
          className={`font-semibold tracking-wide text-slate-400 dark:text-slate-500 font-display ${
            size === "sm" ? "text-[8px]" : size === "md" ? "text-[10px]" : "text-xs"
          }`}
        >
          {language === "en" ? "Product Image Not Available" : "उत्पाद छवि उपलब्ध नहीं है"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
