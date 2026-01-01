"use client";

import { useEffect, useState } from "react";

export function Copyright() {
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    // Avoid hydration mismatch by not rendering until client-side, 
    // or render a fallback that is safe (like the current server year if we passed it, but empty is safer for exact match)
    // Actually, for a footer year, it's fine to just render it if we suppress hydration warning, 
    // but the cleanest "Next.js" way without suppression is client-side mount.
    if (!year) return null;

    return (
        <span>
            © {year} AltSEO Inc.
        </span>
    );
}
