"use client";
import dynamic from "next/dynamic";

const ImovelDetalhes = dynamic(() => import("./ImovelDetalhes"), {
    loading: () => <div className="animate-pulse h-96 bg-gray-200" />,
    ssr: false,
});

export default function ImovelDetalhesClient(props: any) {
    return <ImovelDetalhes {...props} />;
}
