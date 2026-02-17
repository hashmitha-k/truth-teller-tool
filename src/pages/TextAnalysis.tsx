import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ResultCard from "@/components/ResultCard";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TextAnalysis = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    prediction: string;
    uncertainty: string;
    reasons: string[];
  } | null>(null);
  const { toast } = useToast();

  const analyzeText = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-news", {
        body: { text: trimmed, type: "text" },
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
      });
    } catch (e) {
      console.error("Analysis failed:", e);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the text. Please try again.",
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
        <div className="mb-10">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
            Text Analysis
          </h1>
          <p className="text-muted-foreground">
            Paste any news article or claim to analyze its authenticity using AI.
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste news text here..."
            className="min-h-[200px] bg-card border-border font-mono text-sm resize-none focus-visible:ring-primary"
          />

          <Button
            onClick={analyzeText}
            disabled={!text.trim() || isLoading}
            className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Analyze Text
              </>
            )}
          </Button>
        </div>

        {result && (
          <div className="mt-8">
            <ResultCard {...result} />
          </div>
        )}
      </main>
    </div>
  );
};

export default TextAnalysis;
