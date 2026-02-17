import { useState, useRef } from "react";
import { ScanSearch, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResultCard from "@/components/ResultCard";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const OcrDetection = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    prediction: string;
    uncertainty: string;
    reasons: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file.", variant: "destructive" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 10MB.", variant: "destructive" });
      return;
    }

    setResult(null);
    setExtractedText("");

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setPreview(base64);

      // Extract text via OCR
      setIsExtracting(true);
      try {
        const { data, error } = await supabase.functions.invoke("ocr-extract", {
          body: { imageBase64: base64 },
        });
        if (error) throw error;
        if (data?.error) {
          toast({ title: "OCR Error", description: data.error, variant: "destructive" });
          return;
        }
        setExtractedText(data.text || "");
      } catch (err) {
        console.error("OCR failed:", err);
        toast({ title: "OCR Failed", description: "Could not extract text from image.", variant: "destructive" });
      } finally {
        setIsExtracting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const analyzeExtracted = async () => {
    if (!extractedText.trim()) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-news", {
        body: { text: extractedText, type: "ocr" },
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
      toast({ title: "Analysis Failed", description: "Could not analyze text.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">OCR Detection</h1>
        <p className="text-muted-foreground mb-10">Upload an image of a news article for AI-powered text extraction and analysis.</p>

        {/* Upload area */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {!preview ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-16 text-center bg-card hover:border-primary/30 hover:bg-card/80 transition-all cursor-pointer"
          >
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-foreground font-display font-medium mb-1">Click to upload an image</p>
            <p className="text-sm text-muted-foreground">PNG, JPG, WEBP up to 10MB</p>
          </button>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden border border-border bg-card">
              <img src={preview} alt="Uploaded" className="max-h-80 w-full object-contain bg-muted/20" />
              <button
                onClick={() => {
                  setPreview(null);
                  setExtractedText("");
                  setResult(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-background/80 text-sm text-foreground hover:bg-background transition-colors"
              >
                Change image
              </button>
            </div>

            {isExtracting && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Extracting text from image…</p>
              </div>
            )}

            {extractedText && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Extracted Text</label>
                  <div className="p-4 rounded-xl bg-card border border-border font-mono text-sm text-foreground min-h-[100px] whitespace-pre-wrap">
                    {extractedText}
                  </div>
                </div>

                <Button
                  onClick={analyzeExtracted}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <ScanSearch className="h-4 w-4" />
                      Analyze Extracted Text
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {result && (
          <div className="mt-8">
            <ResultCard {...result} />
          </div>
        )}
      </main>
    </div>
  );
};

export default OcrDetection;
