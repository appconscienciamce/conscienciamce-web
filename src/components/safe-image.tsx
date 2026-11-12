"use client";

import NextImage, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * next/image with a fallback. When the optimized copy fails (the optimizer
 * timing out on a cold request, or refusing new ones), the same photo is asked
 * again straight from /public, which never goes through the optimizer.
 * A broken-image icon was seen in the Instagram browser on iOS.
 */
export default function SafeImage(props: ImageProps) {
  const [failed, setFailed] = useState(false);
  const { onError, unoptimized, ...rest } = props;
  return (
    <NextImage
      {...rest}
      unoptimized={unoptimized || failed}
      onError={(event) => {
        if (!failed && !unoptimized) setFailed(true);
        onError?.(event);
      }}
    />
  );
}
