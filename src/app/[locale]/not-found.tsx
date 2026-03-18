import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';

export default function NotFound() {
    const t = useTranslations('notFound');

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-6xl font-black text-primary">
                <span aria-hidden="true">
                    404
                </span>
            </div>
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t('title')}
            </h1>
            <p className="mb-8 max-w-md text-lg text-muted-foreground">
                {t('description')}
            </p>
            <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-8 text-sm font-black uppercase tracking-widest text-primary-foreground transition-all hover:brightness-110"
            >
                {t('backHome')}
            </Link>
        </div>
    );
}
