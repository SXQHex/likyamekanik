// src/app/api/og/route.tsx
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const title = searchParams.get("title") ?? "Likya Mekanik";
    const eyebrow = searchParams.get("eyebrow") ?? "Hizmetler";
    const imageUrl = searchParams.get("image");

    // Absolute URL gerekli
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://likyamekanik.com";
    const bgSrc = imageUrl ? `${baseUrl}${imageUrl}` : null;

    return new ImageResponse(
        (
            <div
                style={{
                    width: "1200px",
                    height: "630px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    position: "relative",
                    backgroundColor: "#0a0a0a",
                    fontFamily: "sans-serif",
                }}
            >
                {/* Arka plan görseli */}
                {bgSrc && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={bgSrc}
                        alt=""
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: 0.4,
                        }}
                    />
                )}

                {/* PageHeader gradient — soldan sağa karartma */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(to right, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.75) 60%, rgba(10,10,10,0.2) 100%)",
                    }}
                />

                {/* İçerik */}
                <div
                    style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        padding: "64px 80px",
                        gap: "16px",
                    }}
                >
                    {/* Eyebrow badge */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <span
                            style={{
                                backgroundColor: "rgba(var(--primary-rgb, 220,120,60), 0.15)",
                                border: "1px solid rgba(220,120,60,0.3)",
                                color: "#dc7c3c",
                                fontSize: "13px",
                                fontWeight: 700,
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                padding: "6px 16px",
                                borderRadius: "999px",
                            }}
                        >
                            {eyebrow}
                        </span>
                    </div>

                    {/* Başlık */}
                    <div
                        style={{
                            fontSize: title.length > 30 ? "48px" : "60px",
                            fontWeight: 900,
                            color: "#f5f0e8",
                            lineHeight: 1.05,
                            letterSpacing: "-0.02em",
                            maxWidth: "700px",
                        }}
                    >
                        {title}
                    </div>

                    {/* Site adı */}
                    <div
                        style={{
                            fontSize: "18px",
                            fontWeight: 500,
                            color: "rgba(245,240,232,0.45)",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            marginTop: "8px",
                        }}
                    >
                        likyamekanik.com
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            headers: {
                'Cache-Control': 'public, imutable, no-transform, s-maxage=31536000, max-age=31536000',
            },
        }
    );
}