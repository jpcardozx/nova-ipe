// types/next-sanity-studio.d.ts

// Tell TS that `next-sanity/studio` exists, 
// and that NextStudio is a React component.
import type { NextStudioProps } from "next-sanity";
import React from "react";

declare module "next-sanity/studio" {
  export function NextStudio(props: NextStudioProps): React.JSX.Element;
  export const metadata: unknown;
  export const viewport: unknown;
}

// Also declare the metadata sub‑path if you use it:
declare module "next-sanity/studio/metadata" {
  export const metadata: unknown;
  export const viewport: unknown;
}
