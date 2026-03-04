"use client";

import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background/80">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="mb-3 text-lg font-bold text-card-foreground">
              Likya Mekanik
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("footer.description")}
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("nav.home")}
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/hizmetler"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("nav.services")}
              </Link>
              <Link
                href="/hakkimizda"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("nav.about")}
              </Link>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("nav.blog")}
              </Link>
              <Link
                href="/iletisim"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("nav.contact")}
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("contact.title")}
            </h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a
                href={`tel:+905446415745`}
                className="transition-colors hover:text-foreground"
              >
                +90 544 641 5745
              </a>
              <span>Taşyaka Mah. 178. Sokak<br />No:6/B D:1 Fethiye/Muğla/Türkiye</span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {year} Likya Mekanik. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
