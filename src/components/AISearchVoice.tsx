/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Mic, MicOff, QrCode, ScanLine, Sparkles, Filter, X, ArrowRight,
  RefreshCw, CheckCircle, Smartphone, SlidersHorizontal, BookMarked
} from "lucide-react";
import { Product } from "../types";

// Standardizing Web Speech API interface for TypeScript
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onend: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

interface AISearchVoiceProps {
  products: Product[];
  language: "en" | "hi";
  onResultsFiltered: (filtered: Product[], aiMessage?: string, aiMatchScores?: Record<string, number>) => void;
  onProductClick: (product: Product) => void;
}

export default function AISearchVoice({
  products,
  language,
  onResultsFiltered,
  onProductClick,
}: AISearchVoiceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Barcode / QR Scanner Simulation
  const [showScanner, setShowScanner] = useState(false);
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success">("idle");
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);

  const categories = ["All", "School Notebooks", "Office Registers", "Drawing Books", "Practical Books", "Spiral Notebooks", "Writing Pads", "Exam Copies", "Stationery"];

  // Voice Search Web Speech API
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice Search is not fully supported in this browser environment. We will simulate listening now!");
      simulateVoiceListening();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = language === "en" ? "en-IN" : "hi-IN";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      triggerKeywordFilter(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech Recognition Error", event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const simulateVoiceListening = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const simulatedQueries = language === "en"
        ? ["school notebook", "premium registers", "drawing book for artists", "spiral notepad"]
        : ["स्कूल नोटबुक", "प्रीमियम रजिस्टर", "ड्राइंग बुक", "स्पाइरल नोटबुक"];
      const randomQuery = simulatedQueries[Math.floor(Math.random() * simulatedQueries.length)];
      setSearchQuery(randomQuery);
      triggerKeywordFilter(randomQuery);
    }, 2800);
  };

  // Keyword filter logic
  const triggerKeywordFilter = (query: string, category: string = activeCategory) => {
    let results = [...products];

    // Category filter
    if (category !== "All") {
      results = results.filter((p) => p.category === category);
    }

    // Text search filter
    if (query.trim() !== "") {
      const term = query.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          (p.nameHindi && p.nameHindi.toLowerCase().includes(term)) ||
          p.category.toLowerCase().includes(term)
      );
    }

    onResultsFiltered(results);
  };

  // Trigger keyword filtering on search query edit
  useEffect(() => {
    triggerKeywordFilter(searchQuery, activeCategory);
  }, [searchQuery, activeCategory]);

  // AI-Powered Smart Search using server-side Gemini API
  const handleAiSmartSearch = async () => {
    if (!searchQuery.trim()) {
      alert(language === "en" ? "Please enter a search phrase first." : "कृपया पहले कोई खोज वाक्यांश दर्ज करें।");
      return;
    }

    setIsAiLoading(true);
    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!res.ok) {
        throw new Error("AI Search responded with an error");
      }

      const data = await res.json();
      const matchScores: Record<string, number> = {};
      const aiMatchedIds: string[] = [];

      if (data.matches && Array.isArray(data.matches)) {
        data.matches.forEach((m: { productId: string; score: number }) => {
          matchScores[m.productId] = m.score;
          if (m.score > 30) {
            aiMatchedIds.push(m.productId);
          }
        });
      }

      // Filter catalog products based on matched IDs or scores
      let filtered = products.filter((p) => aiMatchedIds.includes(p.id) || (matchScores[p.id] && matchScores[p.id] > 30));
      
      // Fallback to keyword search if Gemini found nothing
      if (filtered.length === 0) {
        filtered = products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      onResultsFiltered(filtered, data.aiMessage, matchScores);
    } catch (error) {
      console.error("AI Search Failed", error);
      // Fallback
      triggerKeywordFilter(searchQuery, activeCategory);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Barcode / QR Scan Simulation
  const triggerBarcodeScanner = () => {
    setShowScanner(true);
    setScanStatus("scanning");
    setScannedProduct(null);

    // Simulate scanning camera focus and find match in 3 seconds
    setTimeout(() => {
      const matchIndex = Math.floor(Math.random() * products.length);
      const productFound = products[matchIndex];
      setScannedProduct(productFound);
      setScanStatus("success");
    }, 3200);
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Search Input Box */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === "en" ? "Search notebooks, registers, pages..." : "नोटबुक, रजिस्टर, पेजों की खोज करें..."}
            className="w-full pl-11 pr-24 py-3.5 rounded-2xl glass-light dark:glass-dark border border-slate-200/50 dark:border-slate-800/80 shadow-md focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-sm"
          />
          <Search className="absolute left-4 top-4 h-4 w-4 text-slate-400" />

          {/* End Buttons: Voice and Barcode */}
          <div className="absolute right-2 top-2 flex items-center space-x-1">
            <button
              onClick={handleVoiceSearch}
              className={`p-2 rounded-xl transition ${
                isListening 
                  ? "bg-rose-500 text-white animate-pulse" 
                  : "text-slate-400 hover:text-brand-blue hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Voice Search"
              id="btn-voice-search"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <button
              onClick={triggerBarcodeScanner}
              className="p-2 text-slate-400 hover:text-brand-blue hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              title="Scan Barcode / QR Code"
              id="btn-barcode-scan"
            >
              <QrCode className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* AI-powered Search Button */}
        <button
          onClick={handleAiSmartSearch}
          disabled={isAiLoading}
          className="px-4 py-3.5 bg-gradient-to-r from-brand-blue to-indigo-700 text-white rounded-2xl font-display font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-brand-blue/15 hover:opacity-90 active:scale-95 transition disabled:opacity-50"
          id="btn-ai-search"
        >
          {isAiLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 fill-white" />
          )}
          <span>{language === "en" ? "AI Search" : "एआई खोज"}</span>
        </button>
      </div>

      {/* Category Horizontal list filters */}
      <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-thin">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-xl border flex items-center justify-center transition shrink-0 ${
            showFilters 
              ? "bg-brand-blue text-white border-brand-blue" 
              : "bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800 text-slate-500 hover:bg-slate-100"
          }`}
          title="Toggle Detailed Filters"
          id="btn-filter-toggle"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              activeCategory === cat
                ? "bg-brand-blue/10 text-brand-blue border-brand-blue/30 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/60"
                : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200/40 dark:border-slate-800/80 hover:bg-slate-50"
            }`}
          >
            {cat === "All" && (language === "en" ? "All Products" : "सभी उत्पाद")}
            {cat !== "All" && cat}
          </button>
        ))}
      </div>

      {/* Voice listening status indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center space-x-3 text-rose-600 dark:text-rose-400 font-display text-xs font-semibold"
          >
            <div className="flex space-x-1 items-center">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping delay-100"></span>
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping delay-200"></span>
            </div>
            <span>{language === "en" ? "Listening to voice input... Speak now!" : "आवाज सुन रहा है... अब बोलें!"}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Barcode/QR code visual viewport */}
      <AnimatePresence>
        {showScanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowScanner(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-slate-950 text-white rounded-[32px] overflow-hidden border border-slate-800 shadow-2xl z-10"
            >
              <button
                onClick={() => setShowScanner(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/15 hover:bg-white/20 text-white transition z-20"
                id="btn-close-scanner"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="p-6 text-center">
                <Smartphone className="h-6 w-6 mx-auto text-brand-blue mb-2" />
                <h3 className="font-display font-bold text-sm">Enterprise Barcode Scan</h3>
                <p className="text-[10px] text-slate-400">Aim your camera at the notebook back-cover barcode sticker</p>
              </div>

              {/* Animated scanning viewport stage */}
              <div className="relative h-60 w-full bg-slate-900 border-t border-b border-slate-800 flex items-center justify-center overflow-hidden">
                {scanStatus === "scanning" && (
                  <>
                    {/* Pulsing focal brackets */}
                    <div className="absolute top-10 left-10 w-8 h-8 border-t-4 border-l-4 border-brand-blue rounded-tl-md"></div>
                    <div className="absolute top-10 right-10 w-8 h-8 border-t-4 border-r-4 border-brand-blue rounded-tr-md"></div>
                    <div className="absolute bottom-10 left-10 w-8 h-8 border-b-4 border-l-4 border-brand-blue rounded-bl-md"></div>
                    <div className="absolute bottom-10 right-10 w-8 h-8 border-b-4 border-r-4 border-brand-blue rounded-br-md"></div>

                    {/* Animated moving laser beam */}
                    <motion.div
                      animate={{ top: ["15%", "85%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                      className="absolute left-[12%] right-[12%] h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] z-10"
                    ></motion.div>

                    {/* Fake barcode block graphic */}
                    <div className="opacity-25 flex space-x-1">
                      <div className="h-20 w-1 bg-white"></div>
                      <div className="h-20 w-3 bg-white"></div>
                      <div className="h-20 w-1 bg-white"></div>
                      <div className="h-20 w-2 bg-white"></div>
                      <div className="h-20 w-4 bg-white"></div>
                      <div className="h-20 w-1 bg-white"></div>
                      <div className="h-20 w-3 bg-white"></div>
                    </div>
                  </>
                )}

                {scanStatus === "success" && scannedProduct && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 text-center space-y-3"
                  >
                    <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
                    <div>
                      <span className="text-[9px] text-brand-blue font-bold tracking-widest uppercase font-mono">MATCH FOUND</span>
                      <h4 className="font-display font-bold text-sm text-white">{scannedProduct.name}</h4>
                      <p className="text-[10px] text-slate-400">MOQ: {scannedProduct.moq} Units</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowScanner(false);
                        onProductClick(scannedProduct);
                      }}
                      className="px-4 py-2 bg-brand-blue hover:bg-brand-royal text-white rounded-xl text-xs font-semibold shadow-md flex items-center space-x-1 mx-auto"
                      id="btn-scan-view"
                    >
                      <span>View Specifications</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                )}
              </div>

              <div className="p-6 flex justify-between items-center text-[10px] text-slate-400">
                <span>SIMULATED WEBCAM</span>
                {scanStatus === "scanning" && (
                  <button
                    onClick={() => setScanStatus("success")}
                    className="text-brand-blue hover:underline font-semibold"
                    id="btn-scan-force"
                  >
                    Force Match Success
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
