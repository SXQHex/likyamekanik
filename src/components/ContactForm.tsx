"use client";

import { useState } from "react";

interface ContactFormProps {
    labels: {
        name: string;
        phone: string;
        message: string;
        submit: string;
        success: string;
        error: string;
    };
    whatsappMessage: string;
}

export function ContactForm({ labels, whatsappMessage }: ContactFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    function handleSubmit() {
        if (!name.trim() || !phone.trim()) {
            setStatus("error");
            return;
        }

        const text = [
            whatsappMessage,
            `İsim: ${name}`,
            `Telefon: ${phone}`,
            message ? `Mesaj: ${message}` : "",
        ].filter(Boolean).join("\n");

        window.open(
            `https://wa.me/905446415745?text=${encodeURIComponent(text)}`,
            "_blank",
            "noopener,noreferrer"
        );
        setStatus("success");
    }

    if (status === "success") {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <p className="text-base font-semibold text-foreground">{labels.success}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* İsim */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {labels.name} *
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    placeholder={labels.name}
                />
            </div>

            {/* Telefon */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {labels.phone} *
                </label>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    placeholder="+90 5__ ___ __ __"
                />
            </div>

            {/* Mesaj */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {labels.message}
                </label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    placeholder={labels.message}
                />
            </div>

            {/* Hata */}
            {status === "error" && (
                <p className="text-xs font-medium text-red-500">{labels.error}</p>
            )}

            {/* Gönder */}
            <button
                onClick={handleSubmit}
                className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-8 text-sm font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-green-600 active:scale-95"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.882a.5.5 0 0 0 .604.619l6.204-1.63A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.52-5.16-1.427l-.37-.22-3.827 1.006.977-3.565-.242-.38A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
                {labels.submit}
            </button>
        </div>
    );
}