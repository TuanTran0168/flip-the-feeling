"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

const StarField = dynamic(() => import("@/components/StarField"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });

export default function ClientOverlays() {
  useEffect(() => {
    const blockDevKeys = (e: KeyboardEvent) => {
      if (e.key === "F12") { e.preventDefault(); return; }
      if (e.ctrlKey && e.shiftKey && ["i","I","j","J","c","C","k","K"].includes(e.key)) { e.preventDefault(); return; }
      if (e.ctrlKey && ["u","U","s","S"].includes(e.key)) { e.preventDefault(); return; }
    };
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();

    document.addEventListener("keydown", blockDevKeys);
    document.addEventListener("contextmenu", blockContextMenu);

    return () => {
      document.removeEventListener("keydown", blockDevKeys);
      document.removeEventListener("contextmenu", blockContextMenu);
    };
  }, []);

  return (
    <>
      <StarField />
      <CustomCursor />
    </>
  );
}
