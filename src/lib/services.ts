// src/lib/services.ts

import { Flame, ThermometerSun, Wind, Droplets, Waves, type LucideIcon } from "lucide-react";

export interface Service {
    slug: string;
    titleKey: string;
    descriptionKey: string;
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
        slug: "isi-pompasi",
        titleKey: "isi-pompasi",
        descriptionKey: "isi-pompasi",
        image: "/services/heat-pump-installation2.avif",
        image1: "/services/heat-pump-installation1.avif",
        icon: ThermometerSun,
    },
    {
        slug: "yangin-sistemleri",
        titleKey: "yangin-sistemleri",
        descriptionKey: "yangin-sistemleri",
        image: "/services/fire-fighting.avif",
        image1: "/services/fire-fighting-diesel.avif",
        icon: Flame,
    },
    {
        slug: "yerden-isitma",
        titleKey: "yerden-isitma",
        descriptionKey: "yerden-isitma",
        image: "/services/underfloor-heating-02.avif",
        image1:"/services/underfloor-heating-01.avif",
        icon: Droplets,
    },
    {
        slug: "havuz-tesisati",
        titleKey: "havuz-tesisati",
        descriptionKey: "havuz-tesisati",
        image: "/services/swimming-pool.avif",
        imagePosition: "object-top",
        image1:"/services/swimming-pool-installation.avif",
        icon: Waves,
    },
    {
        slug: "havalandirma",
        titleKey: "havalandirma",
        descriptionKey: "havalandirma",
        image: "/services/HVAC-Ductwork-System-In-Building.avif",
        image1:"/services/HVAC-01.avif",
        icon: Wind,
    },
    
];
