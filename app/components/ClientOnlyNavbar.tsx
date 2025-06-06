'use client';

import CleanNavbar from './CleanNavbar';

interface ClientOnlyNavbarProps {
    transparent?: boolean;
}

export default function ClientOnlyNavbar({ transparent = false }: ClientOnlyNavbarProps) {
    return <CleanNavbar transparent={transparent} />;
}
