"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Maps locale -> path.
 * Example: { "en": "/en/blog/heat-pump", "tr": "/tr/blog/isi-pompasi" }
 */
export type AlternatePathMap = Record<string, string>;

interface AlternatePathContextType {
    alternatePaths: AlternatePathMap;
    setAlternatePaths: (paths: AlternatePathMap) => void;
}

const AlternatePathContext = createContext<AlternatePathContextType | null>(
    null
);

export function AlternatePathProvider({ children }: { children: ReactNode }) {
    const [alternatePaths, setAlternatePaths] = useState<AlternatePathMap>({});

    return (
        <AlternatePathContext.Provider
            value={{ alternatePaths, setAlternatePaths }}
        >
            {children}
        </AlternatePathContext.Provider>
    );
}

export function useAlternatePaths() {
    const context = useContext(AlternatePathContext);
    if (!context) {
        throw new Error(
            "useAlternatePaths must be used within an AlternatePathProvider"
        );
    }
    return context;
}
