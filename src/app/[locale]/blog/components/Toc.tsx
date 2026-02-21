"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: string;
}

interface TocProps {
  label?: string; // Çeviriden gelecek olan "İçindekiler" metni
}

export function Toc({ label = "İçindekiler" }: TocProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const postArea = document.getElementById("post-content");
      const mainTitle = document.querySelector("h1");
      if (!postArea) return;

      const elements = Array.from(postArea.querySelectorAll("h2, h3"));
      const allElements = mainTitle ? [mainTitle, ...elements] : elements;

      const items: TocItem[] = allElements.map((el) => {
        const htmlEl = el as HTMLElement;
        if (!htmlEl.id) {
          const slug = htmlEl.textContent
            ?.toLowerCase()
            .trim()
            .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
            .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
          htmlEl.id = slug || Math.random().toString(36).substr(2, 5);
        }
        
        htmlEl.style.scrollMarginTop = "120px"; 
        
        return {
          id: htmlEl.id,
          text: htmlEl.textContent || "",
          level: htmlEl.tagName,
        };
      });

      setHeadings(items);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: "-100px 0% -80% 0%" }
      );

      allElements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-32 hidden w-64 shrink-0 lg:block border-l border-primary/10 pl-6">
      <div className="flex flex-col gap-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">
          {label} {/* ÇEVİRİ BURADA KULLANILIYOR */}
        </h4>
        <ul className="flex flex-col gap-4">
          {headings.map((heading) => (
            <li 
              key={heading.id}
              className={cn(
                "transition-all duration-300",
                heading.level === "H1" && "mb-2 border-b border-primary/5 pb-2",
                heading.level === "H3" && "pl-4"
              )}
            >
              <button
                type="button"
                onClick={() => {
                  const element = document.getElementById(heading.id);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                    window.history.pushState(null, "", `#${heading.id}`);
                  }
                }}
                className={cn(
                  "block text-left text-[11px] uppercase tracking-widest transition-colors duration-300 outline-none",
                  heading.level === "H1" && "text-[12px] font-black",
                  activeId === heading.id
                    ? "text-primary font-bold translate-x-1"
                    : "text-muted-foreground hover:text-white"
                )}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}