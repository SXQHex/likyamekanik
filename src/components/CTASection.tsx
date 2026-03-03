import { CTAButton } from "@/components/CTAButton";
import { cn } from "@/lib/utils"

interface CTASectionProps {
    id?: string;
    title: string;
    description: string;
    button: string;
    whatsappMessage: string;
    className?: string;
}

export const CTASection = ({
    id,
    title,
    description,
    button,
    whatsappMessage,
    className
}: CTASectionProps) => {
    return (
        <section id={id} className={cn("py-12 md:py-16", className)}>
            <div className="card-base relative overflow-hidden p-8 text-center md:p-12 ">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
                <h2 className="mb-3 text-3xl font-black uppercase leading-tight tracking-tighter">
                    {title}
                </h2>
                <p className="mb-8 text-muted-foreground mx-auto max-w-xl text-base font-medium">
                    {description}
                </p>
                <a
                    href={`https://wa.me/905446415745?text=${encodeURIComponent(whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-green-500 px-10 py-4 text-base shadow-primary-glow font-bold uppercase tracking-widest text-white transition-all hover:bg-green-600 active:scale-95"
                >
                    {button}
                </a>
            </div>
        </section>
    );
};