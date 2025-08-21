"use client";
import { usePathname } from "next/navigation";
import CenteredNavbar from "../components/ui/CenteredNavbar-optimized";
import FooterAprimorado from "../sections/FooterAprimorado";
import { Providers } from "../providers/QueryProvider";

export default function LayoutWithNavFooter({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isJulia = pathname.startsWith("/julia");
    return (
        <Providers>
            {!isJulia && <CenteredNavbar />}
            <main role="main">{children}</main>
            {!isJulia && <FooterAprimorado />}
        </Providers>
    );
}
