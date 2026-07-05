/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Heart, Share2, PhoneCall, Mail, MessageSquare, Download, CheckCircle, 
  RotateCw, RefreshCw, ZoomIn, ShoppingBag, Truck, Info, HelpCircle, Star
} from "lucide-react";
import { Product } from "../types";
import { generateProductPDF } from "../utils/pdfGenerator";
import ProductImage from "./ProductImage";

interface ProductDetailModalProps {
  product: Product;
  relatedProducts: Product[];
  language: "en" | "hi";
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onClose: () => void;
  onAddToInquiry: () => void;
  onProductSelect: (p: Product) => void;
}

export default function ProductDetailModal({
  product,
  relatedProducts,
  language,
  isFavorite,
  onFavoriteToggle,
  onClose,
  onAddToInquiry,
  onProductSelect,
}: ProductDetailModalProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [viewMode, setViewMode] = useState<"gallery" | "360">("gallery");
  const [rotationAngle, setRotationAngle] = useState(0); // 0 to 360 degrees
  const [isZoomed, setIsZoomed] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out this premium notebook from Shri Shiv Enterprises: ${product.name} - Price on Request.`);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  // Simulated 360-degree rotation dragging
  const handleRotationSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRotationAngle(parseInt(e.target.value));
  };

  // Dynamic style for 360 notebook mockup
  const getMockup3dStyle = () => {
    return {
      transform: `perspective(800px) rotateY(${rotationAngle}deg) rotateX(10deg)`,
      transition: "transform 0.1s ease-out",
    };
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        ></motion.div>

        {/* Modal Sheet container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl z-10 border border-slate-200/50 dark:border-slate-800/80 flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close trigger button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition z-30"
            title="Close Detail"
            id="btn-detail-close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Left Media Deck (Gallery or 360 View) */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-slate-200/50 dark:border-slate-800/60 overflow-y-auto">
            {/* View switcher buttons */}
            <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800/70 text-xs font-semibold mb-6 w-fit border border-slate-200/20">
              <button
                onClick={() => setViewMode("gallery")}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition ${
                  viewMode === "gallery" ? "bg-white dark:bg-slate-700 shadow-sm text-brand-blue" : "text-slate-400"
                }`}
              >
                <span>Gallery View</span>
              </button>
              <button
                onClick={() => setViewMode("360")}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition ${
                  viewMode === "360" ? "bg-white dark:bg-slate-700 shadow-sm text-brand-blue" : "text-slate-400"
                }`}
              >
                <RotateCw className="h-3 w-3" />
                <span>360° Studio</span>
              </button>
            </div>

            {/* Media presentation stage */}
            <div className="flex-1 min-h-[300px] flex items-center justify-center relative bg-slate-50 dark:bg-slate-950 rounded-3xl p-6 overflow-hidden border border-slate-200/20">
              {viewMode === "gallery" ? (
                /* Standard Zoomable Gallery View */
                <div className="relative w-full h-full flex flex-col justify-center items-center">
                  <div 
                    onClick={() => setIsZoomed(!isZoomed)}
                    className={`cursor-zoom-in overflow-hidden rounded-2xl transition-all duration-300 max-h-[300px] flex items-center ${
                      isZoomed ? "scale-125" : ""
                    }`}
                  >
                    <ProductImage
                      src={product.images[activeImageIdx]}
                      alt={product.name}
                      language={language}
                      size="lg"
                      className="w-full h-full object-contain max-h-[300px]"
                      containerClassName="w-full h-full flex flex-col items-center justify-center"
                    />
                  </div>
                  <div className="absolute top-2 right-2 p-1.5 bg-black/40 text-white rounded-md text-[10px] flex items-center space-x-1 pointer-events-none">
                    <ZoomIn className="h-3.5 w-3.5" />
                    <span>{isZoomed ? "Click to shrink" : "Click to zoom"}</span>
                  </div>
                </div>
              ) : (
                /* Interactive Simulated 360-Degree Mockup */
                <div className="w-full flex flex-col items-center justify-center py-8">
                  {/* Rotating 3D card layout */}
                  <div
                    style={getMockup3dStyle()}
                    className="relative w-44 h-60 bg-gradient-to-tr from-brand-blue to-indigo-900 rounded-2xl shadow-2xl flex flex-col justify-between p-5 border-l-8 border-slate-900 select-none overflow-hidden"
                  >
                    {/* Spine strip, page lines, branding */}
                    <div className="absolute inset-y-0 right-0 w-1.5 bg-slate-200/20 flex flex-col justify-between py-2 border-r border-slate-100/10"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-5 w-5 bg-white/20 rounded-full flex items-center justify-center text-white text-[8px] font-bold">SS</div>
                      <span className="text-[7px] text-blue-200 tracking-wider uppercase font-mono">Premium 360° Studio</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-16 bg-white/30 rounded"></div>
                      <h5 className="font-display font-bold text-[11px] text-white tracking-wide uppercase leading-tight line-clamp-2">
                        {product.name.replace(" - Premium Quality", "")}
                      </h5>
                      <div className="h-1 w-24 bg-amber-400/80 rounded"></div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-[7px] text-slate-300 font-mono">
                        <div>GSM: {product.paperGsm[0]}</div>
                        <div>PAGES: {product.pages[0]}</div>
                      </div>
                      <div className="h-5 w-10 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[7px] flex items-center justify-center font-bold">
                        ORIGINAL
                      </div>
                    </div>
                  </div>

                  {/* Rotational controls */}
                  <div className="w-full max-w-xs mt-8 space-y-2 z-10">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center space-x-1">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        <span>Drag to rotate</span>
                      </span>
                      <span>{rotationAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={rotationAngle}
                      onChange={handleRotationSlider}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Thumbnail Selector (only in gallery mode) */}
            {viewMode === "gallery" && (
              <div className="flex space-x-3 mt-4 overflow-x-auto py-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-16 w-16 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                      activeImageIdx === idx ? "border-brand-blue scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <ProductImage
                      src={img}
                      alt=""
                      language={language}
                      size="sm"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Content/Specifications Panel */}
          <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between h-full max-h-[85vh]">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-blue">
                  {product.category}
                </span>
                <div className="flex items-center space-x-1 text-xs">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-slate-800 dark:text-slate-100">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewsCount})</span>
                </div>
              </div>

              {/* Title & Price on Request banner */}
              <h3 className="font-display font-bold text-xl md:text-2xl text-slate-900 dark:text-white leading-snug tracking-tight mb-2">
                {language === "en" ? product.name : product.nameHindi || product.name}
              </h3>

              <div className="inline-block px-3.5 py-1.5 bg-gradient-to-r from-brand-blue/10 to-indigo-500/10 border border-brand-blue/20 text-brand-blue dark:text-blue-300 font-display font-bold text-xs rounded-xl mb-4">
                {product.price}
              </div>

              {/* Description */}
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6">
                {language === "en" ? product.description : product.descriptionHindi || product.description}
              </p>

              {/* Technical Specifications list */}
              <h4 className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
                {language === "en" ? "Technical Specifications" : "तकनीकी निर्देश"}
              </h4>

              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs mb-6 border-b border-slate-200/30 dark:border-slate-800/50 pb-5">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-light">Available Sizes</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 text-right truncate max-w-[130px]">{product.sizes.join(", ")}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-light">Pages Range</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{product.pages.filter(p => p > 0).join("-")} Pages</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-light">Paper Quality</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{product.paperGsm.filter(g => g > 0).join("-")} GSM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-light">Binding Styles</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[130px]" title={product.bindingType.join(", ")}>{product.bindingType[0]}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-light">Cover Details</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[130px]" title={product.coverType.join(", ")}>{product.coverType[0]}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-light">Min. Order (MOQ)</span>
                  <span className="font-semibold text-brand-blue font-mono">{product.moq} Units</span>
                </div>
                <div className="col-span-2 flex justify-between py-1">
                  <span className="text-slate-400 font-light">Bulk Packaging</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[240px]">{product.packaging}</span>
                </div>
              </div>
            </div>

            {/* Inquiries & Export actions */}
            <div className="space-y-3 pt-4 border-t border-slate-200/40 dark:border-slate-800/40 mt-auto">
              <div className="flex space-x-3">
                <button
                  onClick={onAddToInquiry}
                  className="flex-1 py-3 bg-brand-blue hover:bg-brand-royal text-white rounded-xl font-display font-bold text-xs shadow-lg flex items-center justify-center space-x-2 transition active:scale-95"
                  id="btn-detail-add-inquiry"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>{language === "en" ? "Add to Quotation Inquiry" : "कोटेशन पूछताछ में जोड़ें"}</span>
                </button>

                <button
                  onClick={onFavoriteToggle}
                  className={`p-3 rounded-xl border transition-all ${
                    isFavorite 
                      ? "bg-rose-500 text-white border-rose-500" 
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                  title={isFavorite ? "Remove Favorite" : "Add Favorite"}
                  id="btn-detail-fav-toggle"
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-white" : ""}`} />
                </button>
              </div>

              {/* Direct Wholesale Contact lines */}
              <div className="flex flex-wrap gap-2 pt-2 justify-center">
                <a
                  href={`https://wa.me/916393539533?text=Hello%20Shri%20Shiv%20Enterprises,%20I%20am%20interested%20in%20a%20bulk%20quote%20for%20the%20${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                  id="btn-detail-wa"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>WhatsApp Inquiry</span>
                </a>
                <a
                  href={`mailto:shrishiventerprises2025@gmail.com?subject=Wholesale%20Inquiry%20for%20${encodeURIComponent(product.name)}&body=Dear%20Sales%20Team,%0A%0AWe%20would%20like%20to%20receive%20a%20wholesale%20quotation%20estimate%20for%20the%20following%20product:%0A-%20Product%20Name:%20${product.name}%0A-%20MOQ%20Requested:%20${product.moq}%2520units%0A%0ACompany%20Details:%0AName:%0ACity:`}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold shadow-sm transition"
                  id="btn-detail-email"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Email Inquiry</span>
                </a>
                <a
                  href="tel:+916393539533"
                  className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold shadow-sm transition"
                  id="btn-detail-call"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>Call Now</span>
                </a>
              </div>

              {/* Utility actions: PDF Download, Share */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/60 gap-2">
                <button
                  onClick={handleShare}
                  className="hover:text-brand-blue flex items-center space-x-1.5 transition justify-center sm:justify-start cursor-pointer"
                  id="btn-detail-share"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>{shareSuccess ? "Link Copied!" : "Share Product"}</span>
                </button>
                <div className="flex space-x-4 justify-center sm:justify-end">
                  <button
                    onClick={() => generateProductPDF(product, language)}
                    className="hover:text-brand-blue flex items-center space-x-1.5 transition text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                    id="btn-detail-generate-pdf"
                  >
                    <Download className="h-3.5 w-3.5 text-brand-blue" />
                    <span>Download Spec PDF</span>
                  </button>
                  <a
                    href="/assets/Shri_Shiv_Catalogue_2026.pdf"
                    download
                    onClick={(e) => {
                      // Simulate brochure file download
                      e.preventDefault();
                      alert("Shri Shiv Enterprises Premium Stationery Catalogue Brochure PDF is downloading successfully! (Simulated)");
                    }}
                    className="hover:text-brand-blue flex items-center space-x-1.5 transition"
                    id="btn-detail-download"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Catalog Brochure</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Related products panel */}
            {relatedProducts.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                <h4 className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
                  {language === "en" ? "Related Products" : "संबंधित उत्पाद"}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {relatedProducts.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onProductSelect(rel)}
                      className="flex items-center space-x-2.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 cursor-pointer border border-slate-200/20 transition"
                    >
                      <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                        <ProductImage
                          src={rel.images[0]}
                          alt=""
                          language={language}
                          size="sm"
                          className="w-full h-full object-cover"
                          containerClassName="w-full h-full flex flex-col items-center justify-center"
                        />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-[11px] font-semibold text-slate-800 dark:text-slate-100 truncate">{rel.name}</h5>
                        <span className="text-[9px] text-brand-blue uppercase tracking-wider font-mono">MOQ: {rel.moq}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
