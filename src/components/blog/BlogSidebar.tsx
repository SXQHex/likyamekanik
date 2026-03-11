"use client";
import React from "react";

import { Link, usePathname, type Href } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { type BlogTreeNode } from "@/lib/blog";

interface BlogSidebarProps {
    tree: BlogTreeNode;
    activeUrl: Href;
    label?: string;
}

const getUrlKey = (href: Href): string => {
    if (typeof href === 'string') return href;
    const paramsStr = 'params' in href ? JSON.stringify(href.params) : '';
    const queryStr = href.query ? JSON.stringify(href.query) : '';
    return `${href.pathname}-${paramsStr}-${queryStr}`;
};

export function BlogSidebar({ tree, activeUrl, label }: BlogSidebarProps) {
    const pathname = usePathname();
    const effectiveActiveUrl = (pathname || activeUrl) as Href;
    const effectiveLabel = label || tree.title;

    return (
        <nav className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-3">
                    {effectiveLabel}
                </h4>
                <div className="flex flex-col">
                    {/* Üst seviye düğümleri (Pillar veya standalone yazılar) gösteriyoruz */}
                    {tree.children?.map((child) => (
                        <TreeNode
                            key={getUrlKey(child.url)}
                            node={child}
                            activeUrl={effectiveActiveUrl}
                            level={0}
                        />
                    ))}
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

    // Alt dallardan herhangi biri aktif mi? (Recursive kontrol)
    const isParentOfActive = (() => {
        const checkChildren = (children?: BlogTreeNode[]): boolean => {
            if (!children) return false;
            return children.some(child => {
                const childActive = (() => {
                    if (typeof child.url === 'string' && typeof activeUrl === 'string') return child.url === activeUrl;
                    if (typeof child.url !== 'string' && typeof activeUrl !== 'string') {
                        return child.url.pathname === activeUrl.pathname &&
                            JSON.stringify('params' in child.url ? child.url.params : {}) ===
                            JSON.stringify('params' in activeUrl ? activeUrl.params : {});
                    }
                    return false;
                })();
                return childActive || checkChildren(child.children);
            });
        };
        return checkChildren(node.children);
    })();

    return (
        <div className="flex flex-col relative">
            {/* Dikey Çizgi: Aktif dal boyunca daha belirgin olsun */}
            {level > 0 && (
                <div
                    className={cn(
                        "absolute left-1.75 top-0 bottom-0 w-px transition-colors duration-500",
                        (isActive || isParentOfActive) ? "bg-primary/30 w-0.5" : "bg-primary/10"
                    )}
                    style={{ left: `${(level * 12) - 6}px` }}
                />
            )}

            <Link
                href={node.url}
                className={cn(
                    "relative flex items-center py-1.5 px-3 rounded-lg transition-all duration-300 group mb-0.5",
                    isActive
                        ? "text-primary font-bold bg-primary/5 shadow-[inset_0_0_20px_rgba(var(--primary),0.02)]"
                        : isParentOfActive
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/30",
                )}
                style={{ paddingLeft: `${(level * 12) + 12}px` }}
            >
                {/* Aktiflik Noktası */}
                {isActive && (
                    <div
                        className="absolute size-1 rounded-full bg-primary shadow-[0_0_8px_var(--primary)] z-10"
                        style={{ left: `${(level * 12) - 8}px` }}
                    />
                )}

                <span className={cn(
                    "text-[12px] leading-tight transition-transform duration-300",
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