/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, ShieldCheck, ShoppingBag, ArrowRight } from "lucide-react";
import { Product } from "../types";
import ProductImage from "./ProductImage";

interface CompareModalProps {
  compareList: Product[];
  language: "en" | "hi";
  onRemove: (id: string) => void;
  onClose: () => void;
  onAddToInquiry: (p: Product) => void;
}

export default function CompareModal({
  compareList,
  language,
  onRemove,
  onClose,
  onAddToInquiry,
}: CompareModalProps) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 25 }}
          className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl z-10 border border-slate-200/50 dark:border-slate-800/80 flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200/40 dark:border-slate-800/60 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
            <div className="flex items-center space-x-2">
              <span className="h-5 w-5 bg-brand-blue rounded-lg flex items-center justify-center text-white text-[10px] font-bold">VS</span>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                {language === "en" ? "Product Comparison Studio" : "उत्पाद तुलना स्टूडियो"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 dark:hover:text-white transition"
              id="btn-close-compare"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Comparison Matrix Table */}
          <div className="p-6 overflow-x-auto">
            {compareList.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <p className="font-display font-bold text-sm mb-2">No Products Selected</p>
                <p className="text-xs">Add products from the catalog to compare them side-by-side.</p>
              </div>
            ) : (
              <table className="w-full min-w-[650px] border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200/50 dark:border-slate-800/50">
                    <th className="w-1/4 text-left py-4 px-2 font-display font-bold text-slate-400 uppercase tracking-widest text-[9px]">Features Matrix</th>
                    {compareList.map((product) => (
                      <th key={product.id} className="w-1/4 text-left py-4 px-4 font-display font-bold text-slate-900 dark:text-white relative">
                        <button
                          onClick={() => onRemove(product.id)}
                          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition"
                          title="Remove from comparison"
                          id={`btn-rem-comp-${product.id}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="flex flex-col space-y-2 pr-4">
                          <div className="h-24 w-24 rounded-xl overflow-hidden shadow-md border border-slate-200/30 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                            <ProductImage
                              src={product.images[0]}
                              alt=""
                              language={language}
                              size="md"
                              className="w-full h-full object-cover"
                              containerClassName="w-full h-full flex flex-col items-center justify-center"
                            />
                          </div>
                          <span className="text-[10px] text-brand-blue uppercase font-mono font-bold">{product.category}</span>
                          <span className="font-bold line-clamp-1">{product.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {/* Category */}
                  <tr>
                    <td className="py-3 px-2 font-medium text-slate-400">Main Category</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{p.category}</td>
                    ))}
                  </tr>

                  {/* GSM */}
                  <tr>
                    <td className="py-3 px-2 font-medium text-slate-400">Paper GSM Weight</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-mono font-bold text-brand-blue">{p.paperGsm.join("-")} GSM</td>
                    ))}
                  </tr>

                  {/* Pages */}
                  <tr>
                    <td className="py-3 px-2 font-medium text-slate-400">Pages Count Options</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-mono text-slate-700 dark:text-slate-200">{p.pages.join("-")} Sheets</td>
                    ))}
                  </tr>

                  {/* Binding */}
                  <tr>
                    <td className="py-3 px-2 font-medium text-slate-400">Binding Styles</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium truncate max-w-[160px]" title={p.bindingType.join(", ")}>
                        {p.bindingType.join(", ")}
                      </td>
                    ))}
                  </tr>

                  {/* Cover */}
                  <tr>
                    <td className="py-3 px-2 font-medium text-slate-400">Cover Thickness / Stock</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium truncate max-w-[160px]" title={p.coverType.join(", ")}>
                        {p.coverType.join(", ")}
                      </td>
                    ))}
                  </tr>

                  {/* MOQ */}
                  <tr>
                    <td className="py-3 px-2 font-medium text-slate-400">Wholesale MOQ (Units)</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-mono font-bold text-emerald-500">{p.moq} Units</td>
                    ))}
                  </tr>

                  {/* Packaging */}
                  <tr>
                    <td className="py-3 px-2 font-medium text-slate-400">Standard Packaging</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-slate-500 dark:text-slate-400 leading-snug">{p.packaging}</td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr>
                    <td className="py-3 px-2 font-medium text-slate-400">Quality Rating</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-1">
                        <span>★ {p.rating}</span>
                        <span className="text-slate-400 font-normal">({p.reviewsCount} reviews)</span>
                      </td>
                    ))}
                  </tr>

                  {/* Actions Row */}
                  <tr>
                    <td className="py-4 px-2 font-medium text-slate-400">Selection actions</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="py-4 px-4">
                        <button
                          onClick={() => onAddToInquiry(p)}
                          className="px-3 py-2 bg-brand-blue hover:bg-brand-royal text-white rounded-lg font-display font-semibold text-[11px] flex items-center space-x-1 shadow-md transition"
                          id={`btn-comp-add-${p.id}`}
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>Add to inquiry</span>
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          {/* Table footer / certified strip */}
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950/40 text-center text-[10px] text-slate-400 flex items-center justify-center space-x-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Specifications represent current production logs from Shri Shiv Enterprises, India.</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
