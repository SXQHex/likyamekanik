"use client";

import { useEffect } from "react";
import {
    useAlternatePaths,
    type AlternatePathMap,
} from "./AlternatePathContext";

export function AlternatePathSetter({ paths }: { paths: AlternatePathMap }) {
    const { setAlternatePaths } = useAlternatePaths();

    useEffect(() => {
        setAlternatePaths(paths);
        // Cleanup on unmount (reset to empty)
        return () => setAlternatePaths({});
    }, [paths, setAlternatePaths]);

    return null;
}
