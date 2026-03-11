// src/lib/schema.ts
import { BlogPost, getPillarPost, getClusterPosts } from "./blog";
import { Service } from "./services";
import { Locale } from "./locales";
import { DEFAULT_BASE, siteName } from "./metadata";

const BASE_URL = DEFAULT_BASE;

// 1. Organizasyon Şeması (Global referans için @id içerir)
export function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": ["Organization", "HVACBusiness"],
        "@id": `${BASE_URL}/#organization`,
        "name": siteName,
        "url": BASE_URL,
        "knowsLanguage": ["tr", "en"],
        "logo": {
            "@type": "ImageObject",
            "url": `${BASE_URL}/logo.png`, // Logonun tam URL'i
        },
        "image": {
            "@type": "ImageObject",
            "url": `${BASE_URL}/og/services/mechanical-services-2.png`, // Logonun tam URL'i
        },
        "sameAs": [
            "https://instagram.com/likyamekanik", // Varsa sosyal medya linkleri
        ],
        "priceRange": "$$",
        "telephone": "+90-544-641-5745",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Taşyaka Mh, 178. Sk, No:6/B, D:1",
            "addressLocality": "Fethiye",
            "addressRegion": "Muğla",
            "postalCode": "48300",
            "addressCountry": "TR",
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "36.621748",
            "longitude": "29.128123"
        },
        "currenciesAccepted": "TRY, EUR, GBP, USD",
        "paymentAccepted": "Cash, Credit Card, Bank Transfer",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+90-544-641-5745",
            "contactType": "customer service",
            "areaServed": "TR",
            "availableLanguage": ["Turkish", "English"]
        },
        "employee": {
            "@type": "Person",
            "name": "Likya Mekanik Ekibi",
            "knowsLanguage": ["tr", "en"]
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday"
                ],
                "opens": "09:00",
                "closes": "17:00"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Saturday",
                    "Sunday"
                ],
                "opens": "09:00",
                "closes": "14:00"
            }
        ]
    };
}

// 2. Breadcrumb Şeması (Hiyerarşiyi SERP'e taşır)
export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
    return {
        "@type": "BreadcrumbList",
        "itemListElement": items.map((it, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": it.name,
            "item": it.item.startsWith('http') ? it.item : `${BASE_URL}${it.item}`
        }))
    };
}

// 3. Teknik Makale Şeması (Blog için)
export function generateTechArticleSchema(post: BlogPost, locale: Locale) {
    const url = `${BASE_URL}/${locale}/blog/${post.slug}`;
    const authorRef = { "@id": `${BASE_URL}/#organization` };

    const schema: any = {
        "@type": "TechArticle",
        "@id": `${url}/#article`,
        "headline": post.title,
        "description": post.description,
        "image": post.coverImage ? `${BASE_URL}${post.coverImage}` : `${BASE_URL}/og-default.png`,
        "datePublished": post.date,
        "dateModified": post.date,
        "author": authorRef,
        "publisher": authorRef,
        "inLanguage": locale,
        "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    };

    // 1. ÜST DÜĞÜM (Ebeveyn) Bağlantısı
    // Eğer bu yazı bir Pillar'a bağlıysa (Cluster ise)
    if (post.pillarKey) {
        // Üst pillar yazısını bul (İlişki kurmak için URL'ini oluştur)
        // Not: getPillarPost fonksiyonun translationKey üzerinden çalışıyor
        const parentPillar = getPillarPost(post.pillarKey, locale);
        if (parentPillar) {
            schema.isPartOf = {
                "@type": "TechArticle",
                "@id": `${BASE_URL}/${locale}/blog/${parentPillar.slug}/#article`,
                "headline": parentPillar.title,
                "image": parentPillar.coverImage ? `${BASE_URL}${parentPillar.coverImage}` : `${BASE_URL}/og-default.png`,
                "author": authorRef
            };
        }
    }

    // 2. ALT DÜĞÜM (Çocuklar) Bağlantısı
    // Eğer bu yazı bir Pillar ise, ona bağlı olan Cluster yazılarını listele
    if (post.isPillar) {
        const childPosts = getClusterPosts(post.translationKey, locale);
        if (childPosts.length > 0) {
            schema.hasPart = childPosts.map(child => ({
                "@type": "TechArticle",
                "@id": `${BASE_URL}/${locale}/blog/${child.slug}/#article`,
                "headline": child.title,
                "image": child.coverImage ? `${BASE_URL}${child.coverImage}` : `${BASE_URL}/og-default.png`,
                "author": authorRef
            }));
        }
    }

    return schema;
}
// 4. Hizmet & FAQ Birleşik Şeması (Hizmet sayfaları için)
export function generateServiceSchema(
    url: string,
    title: string,
    description: string,
    serviceImage?: string,
    faqs?: { question: string; answer: string }[]
) {
    const serviceObj: any = {
        "@type": "Service",
        "@id": `${url}/#service`,
        "name": title,
        "description": description,
        "provider": { "@id": `${BASE_URL}/#organization` },
        "image": serviceImage ? `${BASE_URL}${serviceImage}` : `${BASE_URL}/logo.png`, // Kritik eksik
        "areaServed": [
            {
                "@type": "City",
                "name": "Fethiye",
                "sameAs": "https://tr.wikipedia.org/wiki/Fethiye"
            },
            {
                "@type": "City",
                "name": "Seydikemer"
            },
            {
                "@type": "City",
                "name": "Göcek"
            },
            {
                "@type": "City",
                "name": "Dalaman"
            },
            {
                "@type": "City",
                "name": "Ortaca"
            },
            {
                "@type": "City",
                "name": "Dalyan"
            },
            {
                "@type": "City",
                "name": "Kaş"
            }
        ],
        "serviceType": "HVAC"
    };

    if (faqs && faqs.length > 0) {
        serviceObj.subjectOf = {
            "@type": "FAQPage",
            "@id": `${url}/#faq`,
            "mainEntity": faqs.map(f => ({
                "@type": "Question",
                "name": f.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f.answer
                }
            }))
        };
    }

    return serviceObj;
}