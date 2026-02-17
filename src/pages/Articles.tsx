import { useState } from "react";
import { Link2, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ResultCard from "@/components/ResultCard";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Articles = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    prediction: string;
    uncertainty: string;
    reasons: string[];
    title?: string;
    summary?: string;
    url?: string;
  } | null>(null);
  const { toast } = useToast();

  const verifyUrl = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("verify-url", {
        body: { url: trimmed },
      });

      if (error) throw error;

      if (data?.error) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
        return;
      }

      setResult({
        prediction: data.prediction || "Uncertain",
        uncertainty: `Confidence: ${data.confidence || 50}%`,
        reasons: data.reasons || [],
        title: data.title,
        summary: data.summary,
        url: data.url,
      });
    } catch (e) {
      console.error("Verification failed:", e);
      toast({
        title: "Verification Failed",
        description: "Could not verify the URL. Make sure it's a valid news article.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">Article Verification</h1>
        <p className="text-muted-foreground mb-10">
          Paste a news article URL to verify its content and check for misinformation.
        </p>

        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/news-article"
              className="bg-card border-border font-mono text-sm focus-visible:ring-primary"
              onKeyDown={(e) => e.key === "Enter" && verifyUrl()}
            />
            <Button
              onClick={verifyUrl}
              disabled={!url.trim() || isLoading}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Link2 className="h-4 w-4" />
              )}
              Verify
            </Button>
          </div>
        </div>

        {result && (
          <div className="mt-8 space-y-4">
            {/* Article info */}
            {result.title && (
              <div className="p-4 rounded-xl bg-card border border-border">
                <h3 className="font-display font-semibold text-foreground mb-1">{result.title}</h3>
                {result.url && (
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-primary flex items-center gap-1 mb-2 hover:underline"
                  >
                    {result.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {result.summary && (
                  <p className="text-sm text-muted-foreground">{result.summary}</p>
                )}
              </div>
            )}

            <ResultCard
              prediction={result.prediction}
              uncertainty={result.uncertainty}
              reasons={result.reasons}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Articles;
