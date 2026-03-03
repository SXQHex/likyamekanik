"use client";

import { Link, usePathname, type Href } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { type BlogTreeNode } from "@/lib/blog";

interface BlogSidebarProps {
    tree: BlogTreeNode;
    activeUrl: Href;
    label?: string;
}

export function BlogSidebar({ tree, activeUrl, label = "Rehber Hiyerarşisi" }: BlogSidebarProps) {
    const pathname = usePathname();
    const effectiveActiveUrl = (pathname || activeUrl) as Href;

    return (
        <nav className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-3">
                    {label}
                </h4>
                <div className="flex flex-col">
                    {/* Kök düğümü başlatıyoruz */}
                    <TreeNode node={tree} activeUrl={effectiveActiveUrl} level={0} />
                </div>
            </div>
        </nav>
    );
}

function TreeNode({ node, activeUrl, level }: { node: BlogTreeNode; activeUrl: Href; level: number }) {
    const isActive = (() => {
        if (typeof node.url === 'string' && typeof activeUrl === 'string') {
            return node.url === activeUrl;
        }
        if (typeof node.url !== 'string' && typeof activeUrl !== 'string') {
            const nodeParams = 'params' in node.url ? node.url.params : undefined;
            const activeParams = 'params' in activeUrl ? activeUrl.params : undefined;
            return node.url.pathname === activeUrl.pathname &&
                JSON.stringify(nodeParams) === JSON.stringify(activeParams);
        }
        return false;
    })();

    const hasChildren = node.children && node.children.length > 0;

    const getUrlKey = (href: Href): string => {
        if (typeof href === 'string') return href;
        const paramsStr = 'params' in href ? JSON.stringify(href.params) : '';
        const queryStr = href.query ? JSON.stringify(href.query) : '';
        return `${href.pathname}-${paramsStr}-${queryStr}`;
    };

    return (
        <div className="flex flex-col relative">
            {/* Dikey Çizgi: Sadece alt seviyelerde ve çocukların yanında görünsün */}
            {level > 0 && (
                <div
                    className="absolute left-1.75 top-0 bottom-0 w-px bg-primary/10"
                    style={{ left: `${(level * 16) - 9}px` }}
                />
            )}

            <Link
                href={node.url}
                className={cn(
                    "relative flex items-center py-2 px-3 rounded-lg transition-all duration-300 group",
                    isActive
                        ? "text-primary font-bold bg-primary/5 shadow-[inset_0_0_20px_rgba(var(--primary),0.02)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/30",
                )}
                style={{ paddingLeft: `${(level * 16) + 12}px` }} // Dinamik girinti
            >
                {/* Aktiflik Noktası */}
                {isActive && (
                    <div
                        className="absolute size-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)] z-10"
                        style={{ left: `${(level * 16) - 12}px` }}
                    />
                )}

                <span className={cn(
                    "text-[12.5px] leading-tight transition-transform duration-300",
                    isActive ? "translate-x-1" : "group-hover:translate-x-1"
                )}>
                    {node.title}
                </span>
            </Link>

            {/* Çocukları Render Et (Recursion) */}
            {hasChildren && (
                <div className="flex flex-col">
                    {node.children?.map((child) => (
                        <TreeNode
                            key={getUrlKey(child.url)}
                            node={child}
                            activeUrl={activeUrl}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}