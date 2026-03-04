'use client';

import { Link } from "@/lib/navigation";
import Image from "next/image";
import { Calendar, Tag } from "lucide-react";
import type { Locale } from '@/lib/locales';

// Fumadocs'un ağır modül nesnelerinden (body, _exports vb.) arındırılmış saf tip
interface BlogCardProps {
  post: {
    title: string;
    description: string;
    date: string;
    url: { pathname: '/blog/[slug]'; params: { slug: string } };
    category?: string[];
    tags?: string[];
    coverImage?: string;
  };
  locale: Locale;
}

export function BlogCard({ post, locale }: BlogCardProps) {
  const { title, description, date, category, tags, coverImage, url } = post;

  const formattedDate = new Date(date).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={url}
      className="card-base group flex flex-col bg-card rounded-2xl overflow-hidden h-full"
    >
      {/* Kapak Görseli */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-4xl font-black text-primary/20 uppercase tracking-tighter">
              {title.charAt(0)}
            </span>
          </div>
        )}

        {category && category[0] && (
          <div className="absolute top-3 left-3">
            <span className="inline-block px-2 py-1 bg-card/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest rounded-lg border border-border">
              {category[0]}
            </span>
          </div>
        )}
      </div>

      {/* İçerik */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <h2 className="font-black text-foreground uppercase tracking-tighter leading-tight text-lg group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {description}
        </p>

        {/* Alt Bilgi */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
          {tags && tags.length > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground">
              <Tag className="h-3 w-3" />
              <span>{tags[0]}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}