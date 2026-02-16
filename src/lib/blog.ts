import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content/blog");

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
}

export function getBlogPosts(locale: string): BlogPost[] {
    const dir = path.join(contentDir, locale);
    if (!fs.existsSync(dir)) return [];

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

    return files
        .map((file) => {
            const slug = file.replace(".mdx", "");
            const raw = fs.readFileSync(path.join(dir, file), "utf-8");
            const { data, content } = matter(raw);

            return {
                slug,
                title: (data.title as string) ?? slug,
                date: (data.date as string) ?? "",
                excerpt: (data.excerpt as string) ?? "",
                content,
            };
        })
        .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getBlogPost(
    locale: string,
    slug: string,
): BlogPost | null {
    const filePath = path.join(contentDir, locale, `${slug}.mdx`);
    if (!fs.existsSync(filePath)) return null;

    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    return {
        slug,
        title: (data.title as string) ?? slug,
        date: (data.date as string) ?? "",
        excerpt: (data.excerpt as string) ?? "",
        content,
    };
}

/** Simple markdown → HTML converter for blog content */
export function markdownToHtml(md: string): string {
    return md
        .split("\n\n")
        .map((block) => {
            const trimmed = block.trim();
            if (!trimmed) return "";
            if (trimmed.startsWith("### "))
                return `<h3 class="text-xl font-semibold mt-6 mb-3 text-foreground">${trimmed.slice(4)}</h3>`;
            if (trimmed.startsWith("## "))
                return `<h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">${trimmed.slice(3)}</h2>`;
            if (trimmed.startsWith("- ")) {
                const items = trimmed
                    .split("\n")
                    .map((l) => `<li class="ml-4">${l.replace(/^-\s*/, "")}</li>`)
                    .join("");
                return `<ul class="list-disc list-inside space-y-1 text-muted-foreground">${items}</ul>`;
            }
            return `<p class="text-muted-foreground leading-relaxed">${trimmed}</p>`;
        })
        .join("\n");
}
