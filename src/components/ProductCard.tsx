/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Star, Eye, ClipboardList, Heart, Sparkles, AlertCircle } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  language: "en" | "hi";
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onQuickView: () => void;
  onAddToInquiry: () => void;
}

export default function ProductCard({
  product,
  language,
  isFavorite,
  onFavoriteToggle,
  onQuickView,
  onAddToInquiry,
}: ProductCardProps) {
  const stockColorClass = 
    product.stockStatus === "In Stock" 
      ? "text-emerald-500 bg-emerald-500/10" 
      : product.stockStatus === "Low Stock"
      ? "text-amber-500 bg-amber-500/10"
      : "text-rose-500 bg-rose-500/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col rounded-3xl overflow-hidden glass-light dark:glass-dark border border-slate-200/50 dark:border-slate-800/60 shadow-xl hover:shadow-2xl transition-all"
    >
      {/* Upper Media Deck */}
      <div className="relative h-56 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350"></div>

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
          {product.isBestSeller && (
            <span className="flex items-center space-x-1 text-[10px] font-bold bg-amber-500 text-slate-950 px-2.5 py-1 rounded-full shadow-md tracking-wider uppercase font-display">
              <Sparkles className="h-3 w-3 fill-slate-950" />
              <span>{language === "en" ? "Best Seller" : "बेस्ट सेलर"}</span>
            </span>
          )}
          {product.isNewArrival && (
            <span className="text-[10px] font-bold bg-blue-600 text-white px-2.5 py-1 rounded-full shadow-md tracking-wider uppercase font-display">
              {language === "en" ? "New Arrival" : "नया उत्पाद"}
            </span>
          )}
        </div>

        {/* Favorite Wishlist Icon Trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle();
          }}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md z-10 ${
            isFavorite 
              ? "bg-rose-500 text-white hover:bg-rose-600" 
              : "bg-white/80 hover:bg-white text-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800"
          }`}
          title="Add to Wishlist"
          id={`btn-fav-${product.id}`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-white" : ""}`} />
        </button>

        {/* Stock Status Badge */}
        <span className={`absolute bottom-4 left-4 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${stockColorClass}`}>
          {product.stockStatus}
        </span>

        {/* Hover Action Overlay Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950/20 backdrop-blur-[2px] z-20">
          <button
            onClick={onQuickView}
            className="px-4 py-2.5 bg-white text-brand-blue rounded-xl font-display font-semibold text-xs shadow-xl flex items-center space-x-1.5 hover:scale-105 active:scale-95 transition"
            id={`btn-quick-view-${product.id}`}
          >
            <Eye className="h-4 w-4" />
            <span>{language === "en" ? "Quick View" : "त्वरित देखें"}</span>
          </button>
        </div>
      </div>

      {/* Product Information Card Deck */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Label */}
          <span className="text-[10px] font-semibold text-brand-blue uppercase tracking-widest block mb-1">
            {product.category}
          </span>

          {/* Product Title */}
          <h4 className="font-display font-bold text-base text-slate-900 dark:text-white leading-tight group-hover:text-brand-blue transition duration-200">
            {language === "en" ? product.name : product.nameHindi || product.name}
          </h4>

          {/* Core Specifications Row */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 my-4 text-[11px] border-t border-b border-slate-200/40 dark:border-slate-800/60 py-3 text-slate-500 dark:text-slate-400">
            <div>
              <span className="font-mono text-slate-400">GSM: </span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {product.paperGsm.filter(g => g > 0).join("-") || "Premium"}
              </span>
            </div>
            <div>
              <span className="font-mono text-slate-400">Pages: </span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {product.pages.filter(p => p > 0).join("-") || "Custom"}
              </span>
            </div>
            <div className="col-span-2 mt-1">
              <span className="font-mono text-slate-400">Binding: </span>
              <span className="font-semibold text-slate-700 dark:text-slate-200 truncate inline-block max-w-[140px]" title={product.bindingType[0]}>
                {product.bindingType[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing and Action Deck */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <span className="text-[10px] text-slate-400 block tracking-wider uppercase font-mono">MOQ</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {product.moq} Units
            </span>
          </div>

          <button
            onClick={onAddToInquiry}
            className="px-3.5 py-2 bg-brand-blue hover:bg-brand-royal text-white rounded-xl font-display font-semibold text-xs transition-colors flex items-center space-x-1 shadow-md hover:shadow-lg"
            id={`btn-inq-${product.id}`}
          >
            <ClipboardList className="h-3.5 w-3.5" />
            <span>{language === "en" ? "Add to Inquiry" : "पूछताछ में जोड़ें"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
