"use client";

import dynamic from "next/dynamic";

const StarField = dynamic(() => import("@/components/StarField"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });

export default function ClientOverlays() {
  return (
    <>
      <StarField />
      <CustomCursor />
    </>
  );
}
