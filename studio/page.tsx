// app/studio/page.tsx
import { NextStudio } from "next-sanity/studio";
import { sanityConfig } from "../sanity.config";

export default function StudioPage() {
    return <NextStudio config={sanityConfig} />;
}