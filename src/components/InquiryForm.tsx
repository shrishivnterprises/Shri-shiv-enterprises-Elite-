/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Phone, Mail, MapPin, Landmark, FileText, Send, ShoppingCart, 
  Trash2, Sparkles, CheckCircle, Clock, Download, Printer, Copy, AlertTriangle, CloudUpload, Info
} from "lucide-react";
import { Product, Inquiry, DealerApplication } from "../types";
import { generateInquiryPDF } from "../utils/pdfGenerator";

interface InquiryFormProps {
  inquiryCart: { product: Product; quantity: number }[];
  onUpdateCartQty: (productId: string, qty: number) => void;
  onRemoveFromCart: (productId: string) => void;
  language: "en" | "hi";
  onSubmitInquirySuccess: (inquiry: Inquiry) => void;
  onSubmitDealerSuccess: (dealer: DealerApplication) => void;
}

export default function InquiryForm({
  inquiryCart,
  onUpdateCartQty,
  onRemoveFromCart,
  language,
  onSubmitInquirySuccess,
  onSubmitDealerSuccess,
}: InquiryFormProps) {
  const [activeTab, setActiveTab] = useState<"inquiry" | "dealer">("inquiry");

  // Form states for Inquiry
  const [inqName, setInqName] = useState("");
  const [inqCompany, setInqCompany] = useState("");
  const [inqPhone, setInqPhone] = useState("");
  const [inqEmail, setInqEmail] = useState("");
  const [inqCity, setInqCity] = useState("");
  const [inqState, setInqState] = useState("");
  const [inqGst, setInqGst] = useState("");
  const [inqMessage, setInqMessage] = useState("");

  const [isInqSubmitting, setIsInqSubmitting] = useState(false);
  const [generatedQuotation, setGeneratedQuotation] = useState<string | null>(null);
  const [successInquiry, setSuccessInquiry] = useState<Inquiry | null>(null);

  // Form states for Dealer Onboarding
  const [dlrName, setDlrName] = useState("");
  const [dlrCompany, setDlrCompany] = useState("");
  const [dlrPhone, setDlrPhone] = useState("");
  const [dlrEmail, setDlrEmail] = useState("");
  const [dlrCity, setDlrCity] = useState("");
  const [dlrState, setDlrState] = useState("");
  const [dlrAnnual, setDlrAnnual] = useState("");
  const [dlrGst, setDlrGst] = useState("");
  const [dlrFile, setDlrFile] = useState<File | null>(null);
  const [dlrDragOver, setDlrDragOver] = useState(false);

  const [isDlrSubmitting, setIsDlrSubmitting] = useState(false);
  const [successDealer, setSuccessDealer] = useState<DealerApplication | null>(null);

  // AI Estimate Gen loader
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Inquiry form submit
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inquiryCart.length === 0) {
      alert(language === "en" ? "Your inquiry cart is empty! Add products first." : "आपकी पूछताछ कार्ट खाली है! पहले उत्पाद जोड़ें।");
      return;
    }

    setIsInqSubmitting(true);
    setIsAiLoading(true);

    const selectedProducts = inquiryCart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
    }));

    const payload = {
      name: inqName,
      companyName: inqCompany,
      phone: inqPhone,
      email: inqEmail,
      city: inqCity,
      state: inqState,
      country: "India",
      gstNumber: inqGst,
      selectedProducts,
      message: inqMessage,
    };

    try {
      // Step A: Trigger server-side Gemini Quotation generator
      const quoteRes = await fetch("/api/ai/quote-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let quoteMarkdown = "";
      if (quoteRes.ok) {
        const quoteData = await quoteRes.json();
        quoteMarkdown = quoteData.quotationMarkdown || "";
        setGeneratedQuotation(quoteMarkdown);
      } else {
        quoteMarkdown = "Standard system quotation generated. Price on request finalized.";
      }

      // Step B: Submit actual inquiry details to local database
      const dbRes = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          generatedQuotation: quoteMarkdown,
        }),
      });

      if (dbRes.ok) {
        const createdInquiry = await dbRes.json();
        setSuccessInquiry(createdInquiry);
        onSubmitInquirySuccess(createdInquiry);
      }
    } catch (err) {
      console.error("Inquiry submission error:", err);
    } finally {
      setIsInqSubmitting(false);
      setIsAiLoading(false);
    }
  };

  // Dealer Application submit
  const handleDealerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDlrSubmitting(true);

    const payload = {
      name: dlrName,
      companyName: dlrCompany,
      phone: dlrPhone,
      email: dlrEmail,
      city: dlrCity,
      state: dlrState,
      annualRequirement: dlrAnnual,
      gstNumber: dlrGst,
      documentName: dlrFile ? dlrFile.name : "Simulated_GST_Certificate.pdf",
    };

    try {
      const res = await fetch("/api/dealers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const createdDealer = await res.json();
        setSuccessDealer(createdDealer);
        onSubmitDealerSuccess(createdDealer);
      }
    } catch (err) {
      console.error("Dealer onboarding submission error:", err);
    } finally {
      setIsDlrSubmitting(false);
    }
  };

  // Drag-and-drop file upload helpers
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDlrDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setDlrFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDlrFile(e.target.files[0]);
    }
  };

  // Clipboard copy helper
  const copyQuoteToClipboard = () => {
    if (generatedQuotation) {
      navigator.clipboard.writeText(generatedQuotation);
      alert("Proforma Quotation copied to clipboard successfully!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-200/50 dark:border-slate-800/80 mb-8 font-display">
        <button
          onClick={() => {
            setActiveTab("inquiry");
            setSuccessInquiry(null);
            setGeneratedQuotation(null);
          }}
          className={`flex items-center space-x-2 pb-4 px-6 border-b-2 font-bold text-sm transition ${
            activeTab === "inquiry"
              ? "border-brand-blue text-brand-blue"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
          id="tab-inquiry-select"
        >
          <ShoppingCart className="h-4.5 w-4.5" />
          <span>{language === "en" ? "Bulk Quotation Inquiry" : "थोक कोटेशन पूछताछ"}</span>
          {inquiryCart.length > 0 && (
            <span className="h-5 w-5 bg-brand-blue text-white rounded-full text-[10px] flex items-center justify-center font-bold">
              {inquiryCart.length}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab("dealer");
            setSuccessDealer(null);
          }}
          className={`flex items-center space-x-2 pb-4 px-6 border-b-2 font-bold text-sm transition ${
            activeTab === "dealer"
              ? "border-brand-blue text-brand-blue"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
          id="tab-dealer-select"
        >
          <Building2 className="h-4.5 w-4.5" />
          <span>{language === "en" ? "Distributor & Dealer Registration" : "वितरक और डीलर पंजीकरण"}</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "inquiry" ? (
        /* PANEL A: INQUIRY checkout & Quote generation */
        <div>
          {successInquiry ? (
            /* Inquiry Success & AI Quote Screen View */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-3xl glass-light dark:glass-dark border border-slate-200/40 dark:border-slate-800/60 shadow-xl space-y-6"
            >
              <div className="flex items-center space-x-3 text-emerald-500">
                <CheckCircle className="h-8 w-8" />
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Inquiry Submitted Successfully</h3>
                  <p className="text-xs text-slate-400">Reference: #{successInquiry.id}</p>
                </div>
              </div>

              {generatedQuotation ? (
                /* Gemini Generated Quotation Viewbox */
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-brand-blue/5 p-4 rounded-2xl border border-brand-blue/10">
                    <div className="flex items-center space-x-2 text-brand-blue text-xs font-bold font-display">
                      <Sparkles className="h-4 w-4 fill-brand-blue" />
                      <span>AI Proforma Estimate Instantly Generated!</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={copyQuoteToClipboard}
                        className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition text-slate-600 dark:text-slate-300 cursor-pointer"
                        title="Copy Quote"
                        id="btn-quote-copy"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          const clients = {
                            name: inqName,
                            company: inqCompany,
                            phone: inqPhone,
                            email: inqEmail,
                            city: inqCity,
                            state: inqState,
                            gst: inqGst,
                            message: inqMessage
                          };
                          // Pass successInquiry selectedProducts if available, otherwise reconstruct from inquiryCart
                          const items = successInquiry && successInquiry.selectedProducts 
                            ? successInquiry.selectedProducts.map(sp => {
                                // Find product from cart or just construct a mock Product object
                                const found = inquiryCart.find(c => c.product.id === sp.productId)?.product || {
                                  id: sp.productId,
                                  name: sp.productName,
                                  category: "Stationery",
                                  description: "",
                                  price: "Price on Request",
                                  sizes: [],
                                  pages: [],
                                  paperGsm: [],
                                  bindingType: [],
                                  coverType: [],
                                  availableColors: [],
                                  moq: 100,
                                  packaging: "",
                                  stockStatus: "In Stock" as const,
                                  images: [],
                                  rating: 5,
                                  reviewsCount: 1
                                };
                                return { product: found, quantity: sp.quantity };
                              })
                            : inquiryCart;

                          generateInquiryPDF(items, clients, generatedQuotation);
                        }}
                        className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition text-slate-600 dark:text-slate-300 cursor-pointer"
                        title="Download PDF"
                        id="btn-quote-download-pdf"
                      >
                        <Download className="h-3.5 w-3.5 text-brand-blue" />
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition text-slate-600 dark:text-slate-300 cursor-pointer"
                        title="Print Quote"
                        id="btn-quote-print"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Explanation Banner */}
                  <div className="p-5 bg-brand-blue/5 dark:bg-brand-blue/10 border border-brand-blue/20 rounded-2xl space-y-2.5">
                    <p className="text-[11.5px] text-brand-blue dark:text-blue-300 font-medium leading-relaxed">
                      💡 <strong>Instant AI Proforma Quotation:</strong> Since you have requested a quote, our automated system has calculated these tentative wholesale prices based on your quantities. You can copy this estimate, print it, or download the official PDF copy using the buttons above.
                    </p>
                    <p className="text-[11.5px] text-brand-blue/80 dark:text-blue-300/80 font-medium leading-relaxed border-t border-brand-blue/10 pt-2">
                      💡 <strong>त्वरित एआई-जनित प्रोफ़ार्मा कोटेशन:</strong> चूंकि आपने कोटेशन का अनुरोध किया है, हमारे सिस्टम ने आपके द्वारा चुने गए नोटबुक और उनकी मात्रा के अनुसार थोक दरों का अनुमान लगाया है। आप इसे कॉपी या प्रिंट कर सकते हैं, या ऊपर दिए गए बटन से इसकी आधिकारिक PDF डाउनलोड कर सकते हैं!
                    </p>
                  </div>

                  {/* Render quotation as a Professional Letterhead Document */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">
                      {language === "en" ? "Official Estimate Sheet Preview" : "आधिकारिक अनुमान पत्र का पूर्वावलोकन"}
                    </span>
                    <div className="p-8 bg-amber-50/15 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 font-sans text-xs overflow-x-auto leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap select-text text-slate-800 dark:text-slate-100 shadow-inner">
                      {generatedQuotation ? generatedQuotation.replace(/```/g, "") : ""}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl text-xs flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Your catalog inquiry is in review. Shri Shiv sales desk will contact you with wholesale pricing details shortly.</span>
                </div>
              )}

              <button
                onClick={() => {
                  setSuccessInquiry(null);
                  setGeneratedQuotation(null);
                }}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
                id="btn-quote-done"
              >
                Back to catalog
              </button>
            </motion.div>
          ) : (
            /* Inquiry Shopping Cart and Form Details */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column: Cart List */}
              <div className="md:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                    <span>Inquiry Items Basket</span>
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full text-slate-500">
                      {inquiryCart.length} Items
                    </span>
                  </h3>
                  {inquiryCart.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const clientDetails = {
                          name: inqName || "Guest User",
                          company: inqCompany || "Individual/General Store",
                          phone: inqPhone || "N/A",
                          email: inqEmail || "N/A",
                          city: inqCity || "N/A",
                          state: inqState || "N/A",
                          gst: inqGst,
                          message: inqMessage
                        };
                        generateInquiryPDF(inquiryCart, clientDetails, null);
                      }}
                      className="px-2.5 py-1 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue dark:bg-brand-blue/20 dark:text-blue-300 rounded-lg text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition active:scale-95"
                      id="btn-basket-download-pdf"
                      title="Download active inquiry items list as PDF"
                    >
                      <Download className="h-3 w-3" />
                      <span>Export PDF</span>
                    </button>
                  )}
                </div>

                {inquiryCart.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
                    <p className="font-semibold mb-1">Your Basket is Empty</p>
                    <p>Go to the product catalog and click 'Add to Inquiry' on any stationery product.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                    {inquiryCart.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="p-3.5 rounded-2xl glass-light dark:glass-dark border border-slate-200/30 dark:border-slate-800/40 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={product.images[0]}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover border border-slate-200/40"
                          />
                          <div className="min-w-0">
                            <h4 className="text-[11px] font-semibold text-slate-800 dark:text-slate-100 truncate pr-2" title={product.name}>
                              {product.name}
                            </h4>
                            <span className="text-[9px] text-brand-blue uppercase font-mono tracking-wider">MOQ: {product.moq}</span>
                          </div>
                        </div>

                        {/* Quantity management input field */}
                        <div className="flex items-center space-x-2.5">
                          <input
                            type="number"
                            min={product.moq}
                            value={quantity}
                            onChange={(e) => onUpdateCartQty(product.id, Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                            className="w-16 text-center py-1 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-bold font-mono"
                          />
                          <button
                            onClick={() => onRemoveFromCart(product.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition"
                            title="Remove product"
                            id={`btn-cart-rem-${product.id}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Inquiry Form Sheet */}
              <div className="md:col-span-7">
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">Contact Person Name *</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={inqName}
                          onChange={(e) => setInqName(e.target.value)}
                          placeholder="e.g. Ramesh Patel"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-blue"
                        />
                        <FileText className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">Business / School Name *</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={inqCompany}
                          onChange={(e) => setInqCompany(e.target.value)}
                          placeholder="e.g. Patel Books & Co"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-blue"
                        />
                        <Building2 className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">Phone Number *</label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={inqPhone}
                          onChange={(e) => setInqPhone(e.target.value)}
                          placeholder="e.g. +91 9876543210"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-blue"
                        />
                        <Phone className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">Email ID *</label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={inqEmail}
                          onChange={(e) => setInqEmail(e.target.value)}
                          placeholder="e.g. contact@patelbooks.com"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-blue"
                        />
                        <Mail className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5 col-span-1">
                      <label className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">City *</label>
                      <input
                        type="text"
                        required
                        value={inqCity}
                        onChange={(e) => setInqCity(e.target.value)}
                        placeholder="e.g. Surat"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-blue"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-1">
                      <label className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">State *</label>
                      <input
                        type="text"
                        required
                        value={inqState}
                        onChange={(e) => setInqState(e.target.value)}
                        placeholder="e.g. Gujarat"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-blue"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-1">
                      <label className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">GSTIN (Optional)</label>
                      <input
                        type="text"
                        value={inqGst}
                        onChange={(e) => setInqGst(e.target.value)}
                        placeholder="24AAAAA1111A1Z1"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-brand-blue"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">Requirements Message</label>
                    <textarea
                      rows={3}
                      value={inqMessage}
                      onChange={(e) => setInqMessage(e.target.value)}
                      placeholder="e.g. We require specific double ruling registers for school boards, with customized high-gloss laminate front covers with school emblem."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isInqSubmitting || inquiryCart.length === 0}
                    className="w-full py-3.5 bg-brand-blue hover:bg-brand-royal text-white rounded-xl font-display font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-brand-blue/20 transition disabled:opacity-50"
                    id="btn-inquiry-submit"
                  >
                    {isAiLoading ? (
                      <>
                        <Sparkles className="h-4 w-4 fill-white animate-spin" />
                        <span>AI Generating Proforma Quotation... Please wait</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Inquiry & Generate AI Estimate</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* PANEL B: DISTRIBUTOR ONBOARDING */
        <div className="max-w-2xl mx-auto">
          {successDealer ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-3xl glass-light dark:glass-dark border border-slate-200/40 dark:border-slate-800/60 shadow-xl space-y-6 text-center"
            >
              <Clock className="h-12 w-12 text-brand-blue mx-auto animate-pulse" />
              <div>
                <span className="text-[10px] text-brand-blue font-bold font-mono uppercase tracking-widest bg-brand-blue/10 px-3 py-1 rounded-full">
                  Pending Verification
                </span>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mt-4">Dealer Application Submitted</h3>
                <p className="text-xs text-slate-400 mt-1">Reference application: #{successDealer.id}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-md mx-auto mt-4">
                  Shri Shiv Enterprises executive corporate review desk is validating your business tax registrations and GST documents. You will receive an SMS and email authorization code within 24-48 working hours.
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-emerald-500 font-bold bg-emerald-500/10 p-3 rounded-xl max-w-sm mx-auto">
                <CheckCircle className="h-4 w-4" />
                <span>Simulated GST verification complete!</span>
              </div>

              <button
                onClick={() => setSuccessDealer(null)}
                className="px-6 py-2.5 bg-brand-blue hover:bg-brand-royal text-white rounded-xl text-xs font-semibold transition shadow-md"
                id="btn-dealer-done"
              >
                Onboard another business
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleDealerSubmit} className="space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 rounded-2xl text-[11px] flex items-start space-x-2">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <span>By registering as an authorized dealer, your enterprise is added to our primary shipping log and unlocked for bulk wholesale tier discount cards up to 45% off catalog prices.</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">Authorized Proprietor Name *</label>
                  <input
                    type="text"
                    required
                    value={dlrName}
                    onChange={(e) => setDlrName(e.target.value)}
                    placeholder="e.g. Anand Sharma"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">Registered Company Name *</label>
                  <input
                    type="text"
                    required
                    value={dlrCompany}
                    onChange={(e) => setDlrCompany(e.target.value)}
                    placeholder="e.g. Sharma Stationery Hub"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">Phone Contact *</label>
                  <input
                    type="tel"
                    required
                    value={dlrPhone}
                    onChange={(e) => setDlrPhone(e.target.value)}
                    placeholder="+91 9999888877"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">Corporate Email ID *</label>
                  <input
                    type="email"
                    required
                    value={dlrEmail}
                    onChange={(e) => setDlrEmail(e.target.value)}
                    placeholder="office@sharmastationery.co.in"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">GSTIN *</label>
                  <input
                    type="text"
                    required
                    value={dlrGst}
                    onChange={(e) => setDlrGst(e.target.value)}
                    placeholder="07AAAAA1111A1Z1"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">Annual Requirement *</label>
                  <select
                    required
                    value={dlrAnnual}
                    onChange={(e) => setDlrAnnual(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  >
                    <option value="">Select Bracket</option>
                    <option value="Under ₹5 Lakhs">Under ₹5 Lakhs</option>
                    <option value="₹5 - ₹20 Lakhs">₹5 - ₹20 Lakhs</option>
                    <option value="₹20 - ₹50 Lakhs">₹20 - ₹50 Lakhs</option>
                    <option value="₹50 Lakhs+">₹50 Lakhs+</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">Supply Location *</label>
                  <input
                    type="text"
                    required
                    value={dlrState}
                    onChange={(e) => setDlrState(e.target.value)}
                    placeholder="e.g. Uttar Pradesh"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>
              </div>

              {/* Drag and Drop Upload Area */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-semibold">Business Proof Document (GST/Trade License) *</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDlrDragOver(true); }}
                  onDragLeave={() => setDlrDragOver(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer relative ${
                    dlrDragOver 
                      ? "border-brand-blue bg-brand-blue/5" 
                      : dlrFile 
                      ? "border-emerald-500 bg-emerald-500/5" 
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <CloudUpload className={`h-8 w-8 mx-auto mb-2 ${dlrFile ? "text-emerald-500" : "text-slate-400"}`} />
                  <div className="text-xs">
                    {dlrFile ? (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{dlrFile.name} (Ready)</span>
                    ) : (
                      <span>Drag and drop your GST Certificate or <strong className="text-brand-blue">browse file</strong></span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Accepts PDF, JPG, PNG up to 10MB</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isDlrSubmitting}
                className="w-full py-3.5 bg-brand-blue hover:bg-brand-royal text-white rounded-xl font-display font-bold text-xs shadow-lg shadow-brand-blue/20 transition disabled:opacity-50"
                id="btn-dealer-submit"
              >
                {isDlrSubmitting ? "Onboarding, checking database..." : "Submit Registered Application"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Official Factory & Corporate Office Addresses Block */}
      <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/60 flex items-start space-x-3.5">
          <div className="p-2.5 bg-brand-blue/10 rounded-xl text-brand-blue">
            <MapPin className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 mb-1">
              {language === "en" ? "Corporate Head Office" : "पंजीकृत प्रधान कार्यालय"}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-light">
              41/1, Bajrang Vihar, Khadepur,<br />
              Kanpur, Uttar Pradesh 208021, India
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/60 flex items-start space-x-3.5">
          <div className="p-2.5 bg-brand-blue/10 rounded-xl text-brand-blue">
            <Landmark className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 mb-1">
              {language === "en" ? "Manufacturing Campus" : "विनिर्माण कारखाना परिसर"}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-light">
              41/1, Bajrang Vihar, Khadepur,<br />
              Kanpur, Uttar Pradesh 208021, India
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/60 flex items-start space-x-3.5">
          <div className="p-2.5 bg-brand-blue/10 rounded-xl text-brand-blue">
            <Phone className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 mb-1">
              {language === "en" ? "Corporate Communications & Sales" : "कॉर्पोरेट संचार और बिक्री"}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-light">
              <strong>Hotline Desk:</strong> +91 63935 39533<br />
              <strong>Official Mail:</strong> shrishiventerprises2025@gmail.com<br />
              <strong>Website:</strong> www.shrishiventerprises.in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
