"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

interface FeatureProps {
  feature: {
    title: string;
    description: string;
    icon: React.ReactNode;
    image: string;
    imageAlt: string;
    slug: string;
    seoTitle: string;
    className?: string;
    imageClassName?: string;
  };
  index: number;
}

export function BentoCard({
  feature,
  index,
  cardClassName
}: FeatureProps & { cardClassName?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="relative h-full w-full flex flex-col min-h-0"
    >
      <Card
        className={cn(
          // remove default card padding from ui/card (py-2) and ensure no gap
          "card-base relative flex-1 group flex flex-col justify-end overflow-hidden rounded-none! border-0 bg-transparent",
          cardClassName
        )}
      >
        {/* 1. Arka Plan Katmanı (Resim ve Gradyan) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src={feature.image}
            alt={feature.imageAlt}
            fill
            className={cn(
              "object-cover object-bottom grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700",
              feature.imageClassName
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* OKUNAKLIK İÇİN KRİTİK: Alttan üste doğru karartma maskesi */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent z-10" />
          
        </div>

        {/* 2. İçerik Katmanı */}
        <div className="relative z-20 p-8 transition-transform duration-500 group-hover:-translate-y-2 mt-auto pointer-events-auto">
          {/* İkon Kutusu: Cam efekti (backdrop-blur) ve marka rengi etkileşimi */}
          <div className="mb-5 w-fit p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white group-hover:bg-brand-dark group-hover:border-brand-dark transition-all duration-500 shadow-xl">
            {feature.icon}
          </div>

          {/* Başlık: drop-shadow metni görselden ayırır */}
          <CardTitle className="text-2xl font-black text-brand-light uppercase tracking-tight mb-2 drop-shadow-lg">
            {feature.title}
          </CardTitle>

          {/* Açıklama: Saf beyaz yerine brand-light'ın %80 opaklığı (okunaklı ve yumuşak) */}
          <CardDescription className="text-sm font-medium leading-relaxed max-w-64 text-brand-light/80 group-hover:text-white transition-colors drop-shadow-md">
            {feature.description}
          </CardDescription>
        </div>

      </Card>
    </motion.div>
  );
}
