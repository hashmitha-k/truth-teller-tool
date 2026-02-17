import Navbar from "@/components/Navbar";
import { ExternalLink } from "lucide-react";

const articles = [
  { title: "How to Spot Fake News", source: "FactCheck.org", description: "A comprehensive guide to identifying misinformation in media." },
  { title: "The Psychology of Misinformation", source: "MIT Media Lab", description: "Understanding why false news spreads faster than truth." },
  { title: "Media Literacy in the Digital Age", source: "UNESCO", description: "Building critical thinking skills for consuming online content." },
];

const Articles = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">Articles</h1>
      <p className="text-muted-foreground mb-10">Curated resources on media literacy and fact-checking.</p>
      <div className="space-y-4">
        {articles.map((a, i) => (
          <div key={i} className="p-5 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">{a.title}</h3>
                <p className="text-xs font-mono text-primary mb-2">{a.source}</p>
                <p className="text-sm text-muted-foreground">{a.description}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>
    </main>
  </div>
);

export default Articles;
