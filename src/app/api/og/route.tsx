/* eslint-disable @next/next/no-img-element */
// src/app/api/og/route.tsx
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const rawTitle = searchParams.get("title");
    const rawEyebrow = searchParams.get("eyebrow");
    const rawImage = searchParams.get("image");
    const rawDescription = searchParams.get("description");

    const title = rawTitle ? decodeURIComponent(rawTitle) : "Likya Mekanik Tesisat";
    const eyebrow = rawEyebrow ? decodeURIComponent(rawEyebrow) : null;
    const imageUrl = rawImage ? decodeURIComponent(rawImage) : null;
    const description = rawDescription ? decodeURIComponent(rawDescription) : null;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://likyamekanik.com";
    const bgSrc = imageUrl
        ? `${baseUrl}${imageUrl.replace(/^\/image\//, '/og/').replace(/\.[^.]+$/, '.png')}`
        : null;

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
                    backgroundColor: "#0d1120",
                    fontFamily: "sans-serif",
                }}
            >

                {bgSrc && (
                    <img
                        src={bgSrc}
                        alt=""
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: 1,
                        }}
                    />
                )}

                {/* 2. KATMAN: Yatay Gradyan (Soldan Sağa) */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        // transparent yerine rgba(13, 17, 32, 0) kullanıldı
                        backgroundImage: "linear-gradient(to top right, rgba(13, 17, 32, 1) 0%, rgba(13, 17, 32, 0.8) 35%, rgba(13, 17, 32, 0) 70%)",
                    }}
                />

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
                    {eyebrow && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span
                                style={{
                                    backgroundColor: "rgba(201,106,42,0.15)",
                                    border: "1px solid rgba(201,106,42,0.3)",
                                    color: "#c96a2a",
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
                    )}
                    <div
                        style={{
                            fontSize: title.length > 30 ? "48px" : "60px",
                            fontWeight: 900,
                            color: "#fafbfc",
                            lineHeight: 1.05,
                            letterSpacing: "-0.02em",
                            maxWidth: "700px",
                        }}
                    >
                        {title}
                    </div>

                    <div
                        style={{
                            fontSize: "24px",
                            fontWeight: 500,
                            color: "#fafbfc",
                            maxWidth: "700px",
                        }}
                    >
                        {description}
                    </div>

                    <div
                        style={{
                            fontSize: "18px",
                            fontWeight: 500,
                            color: "rgba(250,251,252,0.45)",
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
                "Cache-Control": "public, immutable, no-transform, s-maxage=31536000, max-age=31536000",
            },
        }
    );
}