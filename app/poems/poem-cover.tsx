"use client";

import Image from "next/image";
import { useState, type SyntheticEvent } from "react";

type CoverShape = "portrait" | "landscape" | "square";

const frameClasses: Record<CoverShape, string> = {
  portrait: "h-full aspect-[176/250]",
  landscape: "w-full aspect-[250/176]",
  square: "h-full aspect-square",
};

function detectShape(event: SyntheticEvent<HTMLImageElement>): CoverShape {
  const { naturalWidth, naturalHeight } = event.currentTarget;
  const ratio = naturalWidth / naturalHeight;

  if (Math.abs(ratio - 1) <= 0.05) return "square";
  return ratio > 1 ? "landscape" : "portrait";
}

export function PoemCover({ src, title }: { src?: string; title: string }) {
  const [shape, setShape] = useState<CoverShape>("portrait");

  return <div className="flex aspect-square w-full max-w-[250px] items-center justify-center">
    <div className={`relative overflow-hidden bg-[#f1eee4] ${frameClasses[shape]}`}>
      {src && <Image
        src={src}
        alt={`${title} 표지 이미지`}
        fill
        sizes="(max-width: 640px) 50vw, 250px"
        className="object-contain"
        onLoad={detectShapeEvent => setShape(detectShape(detectShapeEvent))}
      />}
    </div>
  </div>;
}
