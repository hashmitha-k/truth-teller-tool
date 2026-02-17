import Navbar from "@/components/Navbar";
import { ScanSearch } from "lucide-react";

const OcrDetection = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">OCR Detection</h1>
      <p className="text-muted-foreground mb-12">Upload images of news for automated text extraction and analysis.</p>
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-16 text-center bg-card">
        <ScanSearch className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground font-medium">Coming Soon</p>
        <p className="text-sm text-muted-foreground mt-1">OCR detection is under development.</p>
      </div>
    </main>
  </div>
);

export default OcrDetection;
