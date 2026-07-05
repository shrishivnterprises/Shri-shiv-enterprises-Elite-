/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, BookOpen, Heart, ShoppingCart, UserCheck, Sparkles, Bell, Clock, 
  ArrowRight, PhoneCall, Mail, MapPin, CheckCircle2, ChevronRight, MessageSquare,
  Award, ShieldAlert, FileText, CheckCircle, Quote, Star, Users, RefreshCw
} from "lucide-react";

// Components
import MobileFrame from "./components/MobileFrame";
import HeroBanner from "./components/HeroBanner";
import ProductCard from "./components/ProductCard";
import ProductDetailModal from "./components/ProductDetailModal";
import AISearchVoice from "./components/AISearchVoice";
import CompareModal from "./components/CompareModal";
import InquiryForm from "./components/InquiryForm";
import AdminDashboard from "./components/AdminDashboard";

// Types & Seed Data
import { Product, Review, Inquiry, DealerApplication } from "./types";
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from "./data/initialProducts";

export default function App() {
  // Global View Preferences
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("ss_dark_mode");
    return saved ? saved === "true" : false;
  });
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [activeTab, setActiveTab] = useState<"home" | "catalog" | "compare" | "inquiry" | "admin">("home");

  // Database States
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("ss_products");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Product[];
        // Automatically sync and upgrade cached images with the latest GitHub raw URLs
        return parsed.map((p) => {
          const original = INITIAL_PRODUCTS.find((orig) => orig.id === p.id);
          if (original) {
            // Force upgrade default product images to matching latest source code
            return { 
              ...p, 
              images: original.images,
              name: original.name,
              nameHindi: original.nameHindi,
              description: original.description,
              descriptionHindi: original.descriptionHindi
            };
          }
          return p;
        });
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("ss_favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [inquiryCart, setInquiryCart] = useState<{ product: Product; quantity: number }[]>(() => {
    const saved = localStorage.getItem("ss_inquiry_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Selection & Details overlay
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // AI Response states
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiMatchScores, setAiMatchScores] = useState<Record<string, number> | null>(null);

  // Client Feedback Slideshow state
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  // Live Real-Time UTC clock
  const [currentTime, setCurrentTime] = useState("");

  // Broadcast top-floating push notifications
  const [pushNotification, setPushNotification] = useState<{ title: string; body: string } | null>(null);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem("ss_dark_mode", String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("ss_products", JSON.stringify(products));
    setFilteredProducts(products);
  }, [products]);

  useEffect(() => {
    localStorage.setItem("ss_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("ss_inquiry_cart", JSON.stringify(inquiryCart));
  }, [inquiryCart]);

  // Syncing real clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Slider for Reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReviewIdx((prev) => (prev + 1) % INITIAL_REVIEWS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Favorite toggle helper
  const handleFavoriteToggle = (id: string) => {
    setFavorites((prev) => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );

    // Trigger feedback notification
    const matched = products.find(p => p.id === id);
    if (matched) {
      const isFav = !favorites.includes(id);
      handleTriggerPushNotification(
        isFav ? "Added to Wishlist" : "Removed from Wishlist",
        `'${matched.name}' has been updated in your bookmarks.`
      );
    }
  };

  // Inquiry Cart helpers
  const handleAddToCart = (product: Product) => {
    setInquiryCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 100 } : item
        );
      }
      return [...prev, { product, quantity: product.moq }];
    });

    handleTriggerPushNotification(
      "Variety Added to Inquiry",
      `'${product.name}' was added to your wholesale checkout basket.`
    );
  };

  const handleUpdateCartQty = (productId: string, qty: number) => {
    setInquiryCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setInquiryCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Compare List toggles
  const handleToggleCompare = (product: Product) => {
    setCompareList((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        alert("You can compare a maximum of 3 notebooks at the same time.");
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleResetCatalog = () => {
    localStorage.removeItem("ss_products");
    setProducts(INITIAL_PRODUCTS);
    setFilteredProducts(INITIAL_PRODUCTS);
    handleTriggerPushNotification(
      language === "en" ? "Catalog Restored & Synced" : "कैटलॉग सिंक हो गया",
      language === "en" ? "Latest image database successfully synchronized with GitHub server." : "गिटहब सर्वर से नवीनतम उत्पाद छवियों को सफलतापूर्वक सिंक किया गया।"
    );
  };

  // Triggering visual push alerts
  const handleTriggerPushNotification = (title: string, body: string) => {
    setPushNotification({ title, body });
    setTimeout(() => {
      setPushNotification(null);
    }, 4500);
  };

  // Admin database mutation callbacks
  const handleAddProduct = (payload: any) => {
    const newProduct: Product = {
      ...payload,
      id: `nb-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
    };
    setProducts((prev) => [newProduct, ...prev]);
    handleTriggerPushNotification("New Notebook Registered", `Success! '${newProduct.name}' added to real-time catalog.`);
  };

  const handleEditProduct = (id: string, payload: any) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...payload } : p))
    );
    handleTriggerPushNotification("Notebook Variety Updated", `Success! Catalog logs synchronized.`);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    handleTriggerPushNotification("Variety Removed", "Notebook deleted from live server cache.");
  };

  // Handle Search Filtering
  const handleResultsFiltered = (
    filtered: Product[],
    aiMessageResponse?: string,
    matchScores?: Record<string, number>
  ) => {
    setFilteredProducts(filtered);
    if (aiMessageResponse) {
      setAiMessage(aiMessageResponse);
    } else {
      setAiMessage(null);
    }
    if (matchScores) {
      setAiMatchScores(matchScores);
    } else {
      setAiMatchScores(null);
    }
  };

  return (
    <MobileFrame
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
      language={language}
      setLanguage={setLanguage}
    >
      {/* Top Floating Notification Broadcast System */}
      <AnimatePresence>
        {pushNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-14 left-4 right-4 z-50 p-4 rounded-2xl bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-950 shadow-xl border border-white/10 dark:border-black/5 flex items-start space-x-3 backdrop-blur-md"
          >
            <div className="h-8 w-8 bg-brand-blue rounded-xl flex items-center justify-center text-white shrink-0 mt-0.5">
              <Bell className="h-4.5 w-4.5 animate-swing" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold font-display leading-tight">{pushNotification.title}</h4>
              <p className="text-[11px] opacity-80 mt-0.5 leading-snug">{pushNotification.body}</p>
            </div>
            <button 
              onClick={() => setPushNotification(null)}
              className="text-white/40 dark:text-slate-400 hover:text-white dark:hover:text-black transition"
              id="btn-dismiss-noti"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corporate Branding Sub-Header inside Mobile Screen Frame */}
      <div className={`px-6 py-4 flex items-center justify-between border-b ${
        isDarkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"
      }`}>
        <div className="flex items-center space-x-2">
          <img 
            src="https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/shiv-logo.jpg" 
            alt="Shri Shiv Logo" 
            className="h-6 w-6 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
            referrerPolicy="no-referrer"
          />
          <span className="text-[11px] font-display font-semibold tracking-wider text-slate-500 uppercase">
            {language === "en" ? "Shri Shiv HQ" : "श्री शिव मुख्यालय"}
          </span>
        </div>

        {/* Real UTC/GMT live tracker */}
        <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono">
          <Clock className="h-3 w-3" />
          <span>{currentTime || "10:45 AM"}</span>
        </div>
      </div>

      {/* Screen Wrapper Body based on navigation state */}
      <div className="px-6 py-6 pb-24">
        {activeTab === "home" && (
          /* SECTION 1: HOME PREVIEW */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            {/* Sliding Hero Slideshow Banner */}
            <HeroBanner 
              language={language}
              onExploreClick={() => setActiveTab("catalog")}
              onContactClick={() => setActiveTab("inquiry")}
            />

            {/* Quick action corporate highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-tr from-brand-blue/5 to-indigo-500/5 border border-brand-blue/15 text-slate-800 dark:text-slate-200">
                <Award className="h-6 w-6 text-brand-blue mb-3" />
                <h4 className="font-display font-bold text-sm mb-1">{language === "en" ? "Premium 90 GSM Maps" : "प्रीमियम 90 जीएसएम मैप्स"}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {language === "en" 
                    ? "Ethically manufactured wood-free writing paper featuring smooth coating and zero smudge properties."
                    : "नैतिक रूप से निर्मित लकड़ी-मुक्त लेखन कागज जिसमें चिकनी कोटिंग और शून्य धब्बा गुण हैं।"}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-tr from-brand-blue/5 to-indigo-500/5 border border-brand-blue/15 text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="h-6 w-6 text-brand-blue mb-3" />
                <h4 className="font-display font-bold text-sm mb-1">{language === "en" ? "Superlative Binding" : "सर्वोत्कृष्ट बाइंडिंग"}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {language === "en"
                    ? "Equipped with automatic disc bindings, thread sewing, and metallic multi-subject wire spirals."
                    : "स्वचालित डिस्क बाइंडिंग, थ्रेड सिलाई और धातु बहु-विषय वायर स्पाइरल से सुसज्जित।"}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-tr from-brand-blue/5 to-indigo-500/5 border border-brand-blue/15 text-slate-800 dark:text-slate-200">
                <Users className="h-6 w-6 text-brand-blue mb-3" />
                <h4 className="font-display font-bold text-sm mb-1">{language === "en" ? "Dealer Commission" : "डीलर कमीशन"}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {language === "en"
                    ? "Unmatched wholesale profit margins, bulk custom print requests, and priority shipping channels."
                    : "अतुलनीय थोक लाभ मार्जिन, थोक कस्टम प्रिंट अनुरोध और प्राथमिकता शिपिंग चैनल।"}
                </p>
              </div>
            </div>

            {/* Testimonials Review Slider */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-blue">
                  {language === "en" ? "Enterprise Endorsements" : "कॉर्पोरेट समर्थन"}
                </span>
                <Quote className="h-5 w-5 text-brand-blue/20" />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeReviewIdx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                    "{language === "en" ? INITIAL_REVIEWS[activeReviewIdx].comment : INITIAL_REVIEWS[activeReviewIdx].commentHindi}"
                  </p>
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-800 dark:text-slate-100">{INITIAL_REVIEWS[activeReviewIdx].userName}</h5>
                    <p className="text-[9px] text-slate-400 font-mono uppercase">{INITIAL_REVIEWS[activeReviewIdx].company}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Premium Callout Contact Row */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-brand-blue opacity-10 animate-pulse-grad"></div>
              <div className="relative z-10">
                <h4 className="font-display font-bold text-base">
                  {language === "en" ? "Need Custom Exam Copies or Bulk Branding?" : "कस्टम परीक्षा प्रतियों या थोक ब्रांडिंग की आवश्यकता है?"}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  We supply state board examinations and top engineering institutes with verified watermarked ruling.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("inquiry")}
                className="px-5 py-2.5 bg-white text-slate-950 hover:bg-slate-100 font-display font-semibold text-xs rounded-xl shadow-lg shrink-0 flex items-center space-x-1"
                id="btn-home-custom-exam"
              >
                <span>Partner With Us</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === "catalog" && (
          /* SECTION 2: PRODUCT CATALOG BROWSER */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{language === "en" ? "Notebooks & Stationery Catalog" : "नोटबुक और स्टेशनरी कैटलॉग"}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === "en" 
                    ? "Explore our high-quality notebook catalog with real photos." 
                    : "वास्तविक तस्वीरों के साथ हमारे उच्च गुणवत्ता वाले नोटबुक कैटलॉग को देखें।"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleResetCatalog}
                  className="px-3.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-semibold flex items-center space-x-1 border border-indigo-500/20 transition active:scale-95"
                  title="Force Reload & Sync product photos with GitHub server"
                  id="btn-sync-catalog-photos"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>{language === "en" ? "Sync Product Photos" : "उत्पाद फोटो सिंक करें"}</span>
                </button>

                {/* Compare toggle badge */}
                {compareList.length > 0 && (
                  <button
                    onClick={() => setActiveTab("compare")}
                    className="px-3.5 py-1.5 bg-brand-blue text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md animate-pulse"
                    id="btn-goto-compare"
                  >
                    <span>Compare ({compareList.length})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Smart Multimodal search engine panel */}
            <AISearchVoice
              products={products}
              language={language}
              onResultsFiltered={handleResultsFiltered}
              onProductClick={(p) => setSelectedProduct(p)}
            />

            {/* AI Assistant messages display for smart searches */}
            {aiMessage && (
              <div className="p-4 rounded-2xl bg-brand-blue/5 border border-brand-blue/15 text-slate-800 dark:text-slate-300">
                <div className="flex items-center space-x-2 text-brand-blue text-xs font-bold mb-1.5">
                  <Sparkles className="h-4 w-4 fill-brand-blue" />
                  <span>Gemini AI Smart Search Assistant</span>
                </div>
                <p className="text-xs leading-relaxed italic">"{aiMessage}"</p>
              </div>
            )}

            {/* Catalog Grid Listings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div key={p.id} className="relative">
                  {/* Match Scores Overlay if AI Search is active */}
                  {aiMatchScores && aiMatchScores[p.id] !== undefined && (
                    <div className="absolute top-2 left-20 bg-slate-900/90 text-amber-400 border border-amber-400/40 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full z-10 shadow-sm flex items-center space-x-0.5">
                      <Sparkles className="h-2.5 w-2.5 fill-amber-400" />
                      <span>{Math.round(aiMatchScores[p.id])}% Match</span>
                    </div>
                  )}

                  <ProductCard
                    product={p}
                    language={language}
                    isFavorite={favorites.includes(p.id)}
                    onFavoriteToggle={() => handleFavoriteToggle(p.id)}
                    onQuickView={() => setSelectedProduct(p)}
                    onAddToInquiry={() => handleAddToCart(p)}
                  />

                  {/* Manual comparison checklist box */}
                  <div className="absolute bottom-4 left-6 z-20">
                    <label className="flex items-center space-x-1.5 text-[10px] text-slate-400 hover:text-brand-blue transition cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={compareList.some((comp) => comp.id === p.id)}
                        onChange={() => handleToggleCompare(p)}
                        className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue h-3 w-3"
                      />
                      <span>Compare</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state filters */}
            {filteredProducts.length === 0 && (
              <div className="py-24 text-center text-slate-400">
                <p className="font-display font-bold text-sm mb-1">No Notebook Varieties Found</p>
                <p className="text-xs">Adjust your search keyword or selection filters and try again.</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "compare" && (
          /* SECTION 3: PRODUCT COMPARISON */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CompareModal
              compareList={compareList}
              language={language}
              onRemove={(id) => setCompareList((prev) => prev.filter((p) => p.id !== id))}
              onClose={() => setActiveTab("catalog")}
              onAddToInquiry={(p) => handleAddToCart(p)}
            />
          </motion.div>
        )}

        {activeTab === "inquiry" && (
          /* SECTION 4: INQUIRY SYSTEM & DEALER ONBOARDING */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <InquiryForm
              inquiryCart={inquiryCart}
              onUpdateCartQty={handleUpdateCartQty}
              onRemoveFromCart={handleRemoveFromCart}
              language={language}
              onSubmitInquirySuccess={(inq) => {
                // Clear cart on successful checkout
                setInquiryCart([]);
              }}
              onSubmitDealerSuccess={(dlr) => {
                // Application complete callback
              }}
            />
          </motion.div>
        )}

        {activeTab === "admin" && (
          /* SECTION 5: CORPORATE ADMINISTRATION SUITE */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AdminDashboard
              products={products}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              language={language}
              onSendNotification={(title, body) => handleTriggerPushNotification(title, body)}
            />
          </motion.div>
        )}
      </div>

      {/* Selected Product Detail Zoom Overlay Sheet */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          relatedProducts={products
            .filter((p) => p.category === selectedProduct.category && p.id !== selectedProduct.id)
            .slice(0, 2)}
          language={language}
          isFavorite={favorites.includes(selectedProduct.id)}
          onFavoriteToggle={() => handleFavoriteToggle(selectedProduct.id)}
          onClose={() => setSelectedProduct(null)}
          onAddToInquiry={() => {
            handleAddToCart(selectedProduct);
            setSelectedProduct(null);
          }}
          onProductSelect={(p) => setSelectedProduct(p)}
        />
      )}

      {/* Floating Bottom Nav Rail bar tailored like luxury mobile touch bar */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-lg flex justify-around py-2 px-4 ${
        isDarkMode ? "bg-slate-900/90 border-slate-800/80" : "bg-white/90 border-slate-200/80"
      }`}>
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition ${
            activeTab === "home" ? "text-brand-blue scale-105" : "text-slate-400 hover:text-slate-600"
          }`}
          id="btn-nav-home"
        >
          <Home className="h-5 w-5" />
          <span className="text-[9px] font-bold font-display mt-1">Home</span>
        </button>

        <button
          onClick={() => setActiveTab("catalog")}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition ${
            activeTab === "catalog" ? "text-brand-blue scale-105" : "text-slate-400 hover:text-slate-600"
          }`}
          id="btn-nav-catalog"
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-[9px] font-bold font-display mt-1">Catalog</span>
        </button>

        <button
          onClick={() => setActiveTab("inquiry")}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition relative ${
            activeTab === "inquiry" ? "text-brand-blue scale-105" : "text-slate-400 hover:text-slate-600"
          }`}
          id="btn-nav-inquiry"
        >
          <ShoppingCart className="h-5 w-5" />
          {inquiryCart.length > 0 && (
            <span className="absolute top-1 right-2.5 h-4 w-4 bg-rose-500 text-white rounded-full text-[8px] flex items-center justify-center font-bold">
              {inquiryCart.length}
            </span>
          )}
          <span className="text-[9px] font-bold font-display mt-1">Inquiry</span>
        </button>

        <button
          onClick={() => setActiveTab("admin")}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition ${
            activeTab === "admin" ? "text-brand-blue scale-105" : "text-slate-400 hover:text-slate-600"
          }`}
          id="btn-nav-admin"
        >
          <UserCheck className="h-5 w-5" />
          <span className="text-[9px] font-bold font-display mt-1">Admin</span>
        </button>
      </nav>
    </MobileFrame>
  );
}
