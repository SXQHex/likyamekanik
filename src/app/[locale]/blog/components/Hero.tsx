export default function Hero({ title, description }: { title: string; description: string }) {
  return (
    <section className="relative py-20 px-4 bg-linear-to-br from-primary/10 to-secondary/10 rounded-3xl">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter mb-6">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          {description}
        </p>
      </div>
    </section>
  );
}
