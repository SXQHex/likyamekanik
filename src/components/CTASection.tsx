import { cn } from "@/lib/utils";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";

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
    className,
}: CTASectionProps) => {
    return (
        <section
            id={id}
            className={cn(
                "relative flex min-h-125 w-full flex-col items-center justify-center overflow-hidden bg-tango-black py-20",
                className
            )}
        >
            <div className="relative z-20 text-center px-4">
                <h2 className="mb-6 text-4xl font-black uppercase tracking-tighter text-foreground md:text-7xl">
                    {title}
                </h2>
                <p className="mx-auto mb-10 max-w-2xl text-lg text-foreground/80 leading-relaxed font-medium">
                    {description}
                </p>
                <div className="flex justify-center">
                    <a
                        href={`https://wa.me/905446415745?text=${encodeURIComponent(whatsappMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-2xl border border-foreground/10 bg-secondary px-12 text-xl font-black uppercase tracking-[0.2em] text-primary shadow-2xl transition-all hover:bg-green-600 hover:text-white hover:shadow-green-500/25 active:scale-95"
                    >
                        {button}
                    </a>
                </div>
            </div>

            <InteractiveGridPattern
                className={cn(
                    "mask-[radial-gradient(600px_circle_at_center,white,transparent)]",
                    "inset-y-[-50%] h-[200%] skew-y-12 fill-tango-red/5 stroke-tango-red/10"
                )}
                width={40}
                height={40}
                squares={[80, 80]}
            />
        </section>
    );
};