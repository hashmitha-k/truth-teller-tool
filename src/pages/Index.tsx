import { Link } from "react-router-dom";
import { Shield, FileText, ScanSearch, Newspaper, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const features = [
  {
    icon: FileText,
    title: "Text Analysis",
    description: "Paste any text and detect fake news using keyword and pattern analysis.",
    to: "/text",
  },
  {
    icon: ScanSearch,
    title: "OCR Detection",
    description: "Upload images of news articles for optical character recognition analysis.",
    to: "/ocr",
  },
  {
    icon: Newspaper,
    title: "Articles",
    description: "Browse curated resources on media literacy and misinformation.",
    to: "/articles",
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

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <Link
                key={f.to}
                to={f.to}
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.08)]"
              >
                <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4 group-hover:bg-primary/15 transition-colors">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
