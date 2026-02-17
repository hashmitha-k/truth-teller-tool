import { Shield, ArrowRight, TrendingUp, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const trendingNews = [
  {
    title: "AI-Generated Deepfakes Surge in 2025 Elections",
    source: "Reuters",
    searches: "2.4M",
    category: "Politics",
  },
  {
    title: "Miracle Drug Claims Flood Social Media Platforms",
    source: "AP News",
    searches: "1.8M",
    category: "Health",
  },
  {
    title: "Viral Climate Change Denial Post Debunked by Scientists",
    source: "BBC",
    searches: "1.5M",
    category: "Science",
  },
  {
    title: "Celebrity Death Hoax Spreads Across WhatsApp Groups",
    source: "Snopes",
    searches: "1.2M",
    category: "Entertainment",
  },
  {
    title: "Fake Investment Schemes Target Young Adults Online",
    source: "FactCheck.org",
    searches: "980K",
    category: "Finance",
  },
  {
    title: "Manipulated War Footage Goes Viral on Social Media",
    source: "AFP",
    searches: "870K",
    category: "World",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
          <div className="max-w-6xl mx-auto px-6 py-24 md:py-36 relative">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-mono mb-6">
                <Shield className="h-3.5 w-3.5" />
                AI-Powered Verification
              </div>
              <h1 className="font-display font-bold text-4xl md:text-6xl text-foreground leading-tight mb-6">
                Detect Fake News<br />
                <span className="text-primary">Before It Spreads</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Analyze news articles, detect misinformation patterns, and verify claims with our intelligent detection tools.
              </p>
              <Link to="/text">
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold text-base px-6 py-5 animate-pulse-glow">
                  Start Analyzing
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Trending News */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground">Trending Searches</h2>
              <p className="text-sm text-muted-foreground">Top 6 most searched news topics being fact-checked right now</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingNews.map((item, i) => (
              <div
                key={i}
                className="group p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.08)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {item.category}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2 leading-snug">
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground font-mono">{item.source}</span>
                  <span className="text-xs font-mono text-primary">{item.searches} searches</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
