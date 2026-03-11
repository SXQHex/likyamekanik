// src/components/JsonLd.tsx
export function JsonLd({ schema }: { schema: Record<string, any> | Record<string, any>[] }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
