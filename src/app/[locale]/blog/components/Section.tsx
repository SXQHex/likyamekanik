export default function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {children}
      </div>
    </section>
  );
}
