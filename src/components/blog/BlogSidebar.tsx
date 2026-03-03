"use client";

import Link from "next/link";
import { usePathname } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { type BlogTreeNode } from "@/lib/blog";

export function BlogSidebar({ tree, activeUrl, label = "Rehber Hiyerarşisi" }: { tree: BlogTreeNode; activeUrl: string; label?: string }) {
    const pathname = usePathname();
    const effectiveActiveUrl = pathname ?? activeUrl;

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

function TreeNode({ node, activeUrl, level }: { node: BlogTreeNode; activeUrl: string; level: number }) {
    const isActive = node.url === activeUrl;
    const hasChildren = node.children && node.children.length > 0;

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
                            key={child.url} 
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