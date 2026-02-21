import type { MetadataRoute } from "next";
import { services } from "@/lib/services";

const BASE_URL = "https://likyamekanik.com";
const locales = ["tr", "en", "ru", "uk"];

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const staticRoutes = ["", "/hizmetler", "/hakkimizda", "/iletisim", "/blog"];

    const entries: MetadataRoute.Sitemap = [];

    for (const locale of locales) {
        for (const route of staticRoutes) {
            entries.push({
                url: `${BASE_URL}/${locale}${route}`,
                lastModified: now,
                changeFrequency: "monthly",
                priority: route === "" ? 1 : 0.8,
                alternates: {
                    languages: Object.fromEntries(
                        locales.map((l) => [l, `${BASE_URL}/${l}${route}`]),
                    ),
                },
            });
        }

        for (const service of services) {
            entries.push({
                url: `${BASE_URL}/${locale}/hizmetler/${service.slug}`,
                lastModified: now,
                changeFrequency: "monthly",
                priority: 0.7,
                alternates: {
                    languages: Object.fromEntries(
                        locales.map((l) => [
                            l,
                            `${BASE_URL}/${l}/hizmetler/${service.slug}`,
                        ]),
                    ),
                },
            });
        }
    }

    return entries;
}
