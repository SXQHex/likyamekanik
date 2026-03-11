'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations('error');

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 text-6xl font-black text-destructive">
                !
            </div>
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t('title')}
            </h1>
            <p className="mb-8 max-w-md text-lg text-muted-foreground">
                {t('description')}
            </p>
            <button
                onClick={() => reset()}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-8 text-sm font-black uppercase tracking-widest text-primary-foreground transition-all hover:brightness-110"
            >
                {t('retry')}
            </button>
        </div>
    );
}
