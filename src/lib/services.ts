// src/lib/services.ts

import { Flame, ThermometerSun, Wind, Droplets, Waves, type LucideIcon } from "lucide-react";
import { type Locale } from "./locales";

export const SERVICE_IDS = ["isi-pompasi", "yangin-sistemleri", "yerden-isitma", "havuz-tesisati", "havalandirma"] as const;
export type ServiceId = typeof SERVICE_IDS[number];


export interface Service {
    id: ServiceId;
    slugs: Record<Locale, string>;
    image?: string;
    imagePosition?: string;
    icon: LucideIcon;
    image1?: string;
    image2?: string;
    image3?: string;
    image4?: string;
    image5?: string;
}

export const services: Service[] = [
    {
        id: "isi-pompasi",
        slugs: {
            tr: "isi-pompasi",
            en: "heat-pump",
            ru: "teplovoj-nasos",
            uk: "teplovyj-nasos"
        },
        image: "/image/services/heat-pump-installation2.avif",
        image1: "/image/services/heat-pump-installation1.avif",
        icon: ThermometerSun,
    },
    {
        id: "yangin-sistemleri",
        slugs: {
            tr: "yangin-sistemleri",
            en: "fire-protection",
            ru: "pozharotushenie",
            uk: "pozhezhna-bezpeka"
        },
        image: "/image/services/fire-fighting.avif",
        image1: "/image/services/fire-fighting-diesel.avif",
        icon: Flame,
    },
    {
        id: "yerden-isitma",
        slugs: {
            tr: "yerden-isitma",
            en: "underfloor-heating",
            ru: "teplyj-pol",
            uk: "tepla-pidloga"
        },
        image: "/image/services/underfloor-heating-02.avif",
        image1: "/image/services/underfloor-heating-01.avif",
        icon: Droplets,
    },
    {
        id: "havuz-tesisati",
        slugs: {
            tr: "havuz-tesisati",
            en: "pool-systems",
            ru: "bassejn",
            uk: "baseyn"
        },
        image: "/image/services/swimming-pool.avif",
        imagePosition: "object-top",
        image1: "/image/services/swimming-pool-installation.avif",
        icon: Waves,
    },
    {
        id: "havalandirma",
        slugs: {
            tr: "havalandirma",
            en: "ventilation",
            ru: "ventilyaciya",
            uk: "ventilyatsiya"
        },
        image: "/image/services/HVAC-Ductwork-System-In-Building.avif",
        image1: "/image/services/HVAC-01.avif",
        icon: Wind,
    },
];
