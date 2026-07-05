/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, LayoutDashboard, Notebook, FileSpreadsheet, Send, TrendingUp, Users,
  Plus, Edit, Trash2, CheckCircle, XCircle, AlertCircle, RefreshCw, BarChart2,
  BellRing, Download, Eye, ExternalLink, Calendar
} from "lucide-react";
import { Product, Inquiry, DealerApplication } from "../types";
import ProductImage from "./ProductImage";

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (p: any) => void;
  onEditProduct: (id: string, p: any) => void;
  onDeleteProduct: (id: string) => void;
  language: "en" | "hi";
  onSendNotification: (title: string, body: string) => void;
}

export default function AdminDashboard({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  language,
  onSendNotification,
}: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [authError, setAuthError] = useState("");

  // Views inside Admin Panel
  const [adminTab, setAdminTab] = useState<"analytics" | "products" | "inquiries" | "dealers" | "notify">("analytics");

  // Inquiries and Dealers local lists
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [dealers, setDealers] = useState<DealerApplication[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // CRUD product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("School Notebooks");
  const [formDesc, setFormDesc] = useState("");
  const [formMoq, setFormMoq] = useState(500);
  const [formPages, setFormPages] = useState("120, 180, 240");
  const [formGsm, setFormGsm] = useState("70, 80");
  const [formBinding, setFormBinding] = useState("Soft Cover Perfect Bound");
  const [formPackaging, setFormPackaging] = useState("50 Units per Carton");

  // Push Notify message state
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyBody, setNotifyBody] = useState("");
  const [notifySuccess, setNotifySuccess] = useState(false);

  // Load Inquiries and Dealers on auth
  const loadDatabaseData = async () => {
    setIsLoadingData(true);
    try {
      const inqRes = await fetch("/api/inquiries");
      if (inqRes.ok) {
        const inqData = await inqRes.json();
        setInquiries(inqData);
      }
      const dlrRes = await fetch("/api/dealers");
      if (dlrRes.ok) {
        const dlrData = await dlrRes.json();
        setDealers(dlrData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDatabaseData();
      // Setup polling interval to fetch inquiries and dealers "time to time" (every 10 seconds)
      const interval = setInterval(() => {
        loadDatabaseData();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Auth Submit handler
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser === "admin" && adminPass === "shiv@2026") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Password incorrect");
    }
  };

  // Inquiry action handler
  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        loadDatabaseData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Dealer action handler
  const handleUpdateDealerStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/dealers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        loadDatabaseData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Push notify broadcast trigger
  const handleBroadcastNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (notifyTitle.trim() && notifyBody.trim()) {
      onSendNotification(notifyTitle, notifyBody);
      setNotifySuccess(true);
      setNotifyTitle("");
      setNotifyBody("");
      setTimeout(() => setNotifySuccess(false), 3000);
    }
  };

  // Product CRUD save triggers
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPages = formPages.split(",").map((p) => parseInt(p.trim()) || 0);
    const cleanGsm = formGsm.split(",").map((g) => parseInt(g.trim()) || 0);

    const payload = {
      name: formName,
      category: formCategory,
      description: formDesc,
      moq: formMoq,
      price: "Price on Request",
      pages: cleanPages,
      paperGsm: cleanGsm,
      bindingType: [formBinding],
      coverType: ["Heavy Board Laminate"],
      availableColors: ["Royal Blue", "Crimson Red", "Forest Green"],
      packaging: formPackaging,
      stockStatus: "In Stock",
      images: [
        "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=600"
      ],
    };

    if (editingId) {
      onEditProduct(editingId, payload);
    } else {
      onAddProduct(payload);
    }

    // Reset Form
    setFormName("");
    setFormDesc("");
    setEditingId(null);
    setShowProductForm(false);
  };

  const handleEditProductClick = (p: Product) => {
    setEditingId(p.id);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormDesc(p.description);
    setFormMoq(p.moq);
    setFormPages(p.pages.join(", "));
    setFormGsm(p.paperGsm.join(", "));
    setFormBinding(p.bindingType[0] || "");
    setFormPackaging(p.packaging || "");
    setShowProductForm(true);
  };

  // Data Export Simulators (exports CSV of Inquiries)
  const handleExportCSV = () => {
    if (inquiries.length === 0) {
      alert("No inquiry records to export!");
      return;
    }
    const headers = ["Inquiry_ID", "Contact_Name", "Company", "Phone", "Email", "City", "State", "Status", "Date"];
    const rows = inquiries.map((inq) => [
      inq.id,
      inq.name,
      inq.companyName,
      inq.phone,
      inq.email,
      inq.city,
      inq.state,
      inq.status,
      inq.createdAt,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Shri_Shiv_Inquiries_Log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    alert("Enterprise PDF Audit Log generated successfully! Download initiated in high-fidelity vector format. (Simulated)");
  };

  return (
    <div className="p-6">
      {!isAuthenticated ? (
        /* Sign-in Portal Shield */
        <div className="max-w-md mx-auto py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-3xl glass-light dark:glass-dark border border-slate-200/50 dark:border-slate-800/80 shadow-2xl space-y-6"
          >
            <div className="text-center">
              <div className="h-12 w-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto text-brand-blue mb-4">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Admin Secure Control Panel</h3>
              <p className="text-xs text-slate-400 mt-1">Authorized Shri Shiv Enterprises officers only</p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Username</label>
                <input
                  type="text"
                  required
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Password</label>
                <input
                  type="password"
                  required
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-xs focus:outline-none"
                />
              </div>

              {authError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs flex items-center space-x-1.5">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-brand-blue hover:bg-brand-royal text-white rounded-xl text-xs font-display font-bold shadow-md transition"
                id="btn-admin-login"
              >
                Sign In Authorized Control
              </button>
            </form>
          </motion.div>
        </div>
      ) : (
        /* Authenticated Dashboard Panel */
        <div className="space-y-8">
          {/* Dashboard Hub Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/40 dark:border-slate-800/40 pb-5">
            <div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {language === "en" ? "System Session: Live & Secure (Auto-Refresh 10s)" : "सिस्टम सत्र: लाइव और सुरक्षित (ऑटो-रिफ्रेश 10s)"}
              </span>
              <h2 className="font-display font-bold text-xl md:text-2xl text-slate-900 dark:text-white mt-2">
                Shri Shiv Corporate Operations Suite
              </h2>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={loadDatabaseData}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition"
                title="Refresh logs"
                id="btn-admin-refresh"
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingData ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-4 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-semibold hover:bg-rose-600 transition"
                id="btn-admin-logout"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setAdminTab("analytics")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                adminTab === "analytics"
                  ? "bg-brand-blue text-white border-brand-blue"
                  : "bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200/40 dark:border-slate-800/80 hover:bg-slate-50"
              }`}
            >
              Business Analytics
            </button>
            <button
              onClick={() => setAdminTab("products")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                adminTab === "products"
                  ? "bg-brand-blue text-white border-brand-blue"
                  : "bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200/40 dark:border-slate-800/80 hover:bg-slate-50"
              }`}
            >
              Product Catalog CRUD ({products.length})
            </button>
            <button
              onClick={() => setAdminTab("inquiries")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                adminTab === "inquiries"
                  ? "bg-brand-blue text-white border-brand-blue"
                  : "bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200/40 dark:border-slate-800/80 hover:bg-slate-50"
              }`}
            >
              Customer Inquiries ({inquiries.length})
            </button>
            <button
              onClick={() => setAdminTab("dealers")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                adminTab === "dealers"
                  ? "bg-brand-blue text-white border-brand-blue"
                  : "bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200/40 dark:border-slate-800/80 hover:bg-slate-50"
              }`}
            >
              Distributor Applications ({dealers.length})
            </button>
            <button
              onClick={() => setAdminTab("notify")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                adminTab === "notify"
                  ? "bg-brand-blue text-white border-brand-blue"
                  : "bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200/40 dark:border-slate-800/80 hover:bg-slate-50"
              }`}
            >
              Push Broadcast
            </button>
          </div>

          {/* Active Admin Section Body */}
          <div className="bg-white dark:bg-slate-955 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-md">
            {adminTab === "analytics" && (
              /* TAB A: ANALYTICS WITH MOCK SVG CHARTS */
              <div className="space-y-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-tr from-brand-blue to-blue-800 text-white shadow-lg">
                    <TrendingUp className="h-6 w-6 mb-3 opacity-85" />
                    <h4 className="text-xs text-blue-100 block">Total Active Inquiries</h4>
                    <div className="text-3xl font-display font-bold mt-1">{inquiries.length}</div>
                    <span className="text-[10px] text-emerald-200 font-mono">↑ 12% compared to last month</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-lg">
                    <Users className="h-6 w-6 mb-3 opacity-85 text-brand-blue" />
                    <h4 className="text-xs text-slate-400 block">Distributor Network</h4>
                    <div className="text-3xl font-display font-bold mt-1">
                      {dealers.filter(d => d.status === "Approved").length} Approved
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">({dealers.length} applications logged)</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-md">
                    <BarChart2 className="h-6 w-6 mb-3 text-emerald-500" />
                    <h4 className="text-xs text-slate-400 block">Corporate Conversion</h4>
                    <div className="text-3xl font-display font-bold mt-1">87.5%</div>
                    <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">EXCELLENT</span>
                  </div>
                </div>

                {/* SVG Visual demanding chart */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800">
                    <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 mb-4">
                      Inquiry Volumes by State
                    </h4>
                    {/* Beautiful Premium SVG Bar Chart */}
                    <div className="h-48 w-full flex items-end justify-between px-2 pt-6">
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-10 bg-brand-blue rounded-t-lg transition-all" style={{ height: "110px" }}></div>
                        <span className="text-[10px] text-slate-400 mt-2">Delhi</span>
                      </div>
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-10 bg-brand-blue rounded-t-lg transition-all" style={{ height: "140px" }}></div>
                        <span className="text-[10px] text-slate-400 mt-2">Gujarat</span>
                      </div>
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-10 bg-brand-blue rounded-t-lg transition-all" style={{ height: "80px" }}></div>
                        <span className="text-[10px] text-slate-400 mt-2">M.P.</span>
                      </div>
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-10 bg-brand-blue rounded-t-lg transition-all" style={{ height: "160px" }}></div>
                        <span className="text-[10px] text-slate-400 mt-2">U.P.</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG Category demand distribution (Pie representation) */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800">
                    <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 mb-4">
                      Top Requested Product Categories
                    </h4>
                    <div className="h-48 flex items-center justify-around">
                      {/* Interactive SVG Ring Pie Representation */}
                      <svg className="w-32 h-32" viewBox="0 0 36 36">
                        <path
                          className="text-slate-200 dark:text-slate-800"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-brand-blue"
                          strokeDasharray="45, 100"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-emerald-500"
                          strokeDasharray="30, 100"
                          strokeDashoffset="-45"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex items-center space-x-2">
                          <span className="h-3 w-3 bg-brand-blue rounded-full"></span>
                          <span className="text-slate-500">School Notebooks (45%)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="h-3 w-3 bg-emerald-500 rounded-full"></span>
                          <span className="text-slate-500">Office Registers (30%)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="h-3 w-3 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                          <span className="text-slate-500">Others (25%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {adminTab === "products" && (
              /* TAB B: PRODUCT CRUD MANAGEMENT */
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Active Catalog Items</h3>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setFormName("");
                      setFormDesc("");
                      setShowProductForm(!showProductForm);
                    }}
                    className="px-3.5 py-2 bg-brand-blue hover:bg-brand-royal text-white rounded-xl text-xs font-display font-semibold flex items-center space-x-1.5 shadow-md"
                    id="btn-add-prod-toggle"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Notebook variety</span>
                  </button>
                </div>

                {showProductForm && (
                  /* Create & Edit product slide form */
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    onSubmit={handleSaveProduct}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 space-y-4 text-xs"
                  >
                    <h4 className="font-display font-bold text-xs text-brand-blue">{editingId ? "Edit product" : "Create new product record"}</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-400 block">Product Variety Name</label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="e.g. Royal Long Softbound Notebook"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-400 block">Product Category</label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                        >
                          <option value="School Notebooks">School Notebooks</option>
                          <option value="Office Registers">Office Registers</option>
                          <option value="Practical Books">Practical Books</option>
                          <option value="Drawing Books">Drawing Books</option>
                          <option value="Spiral Notebooks">Spiral Notebooks</option>
                          <option value="Writing Pads">Writing Pads</option>
                          <option value="Exam Copies">Exam Copies</option>
                          <option value="Stationery">Stationery</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 block">Product Description</label>
                      <textarea
                        required
                        rows={2}
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        placeholder="Detailed specifications info..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-400 block">MOQ Requirement (units)</label>
                        <input
                          type="number"
                          value={formMoq}
                          onChange={(e) => setFormMoq(parseInt(e.target.value) || 100)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-400 block">Pages (comma separated)</label>
                        <input
                          type="text"
                          value={formPages}
                          onChange={(e) => setFormPages(e.target.value)}
                          placeholder="120, 180, 240"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-400 block">GSM (comma separated)</label>
                        <input
                          type="text"
                          value={formGsm}
                          onChange={(e) => setFormGsm(e.target.value)}
                          placeholder="70, 80"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button type="submit" className="px-5 py-2.5 bg-brand-blue hover:bg-brand-royal text-white rounded-xl font-bold shadow-md">
                        {editingId ? "Update Product" : "Save New Product"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProductForm(false);
                          setEditingId(null);
                        }}
                        className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-800 dark:text-slate-200 rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Catalog Grid Table */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-display text-left">
                        <th className="py-3 px-2 font-semibold">Image</th>
                        <th className="py-3 px-2 font-semibold">Product Name</th>
                        <th className="py-3 px-2 font-semibold">Category</th>
                        <th className="py-3 px-2 font-semibold">MOQ</th>
                        <th className="py-3 px-2 font-semibold">Details</th>
                        <th className="py-3 px-2 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/20">
                          <td className="py-3.5 px-2">
                            <div className="h-8 w-8 rounded-lg overflow-hidden border border-slate-200/40 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                              <ProductImage
                                src={p.images[0]}
                                alt=""
                                language={language}
                                size="sm"
                                className="w-full h-full object-cover"
                                containerClassName="w-full h-full flex flex-col items-center justify-center"
                              />
                            </div>
                          </td>
                          <td className="py-3.5 px-2 font-semibold text-slate-800 dark:text-slate-100">{p.name}</td>
                          <td className="py-3.5 px-2">
                            <span className="bg-brand-blue/10 text-brand-blue font-bold px-2 py-0.5 rounded text-[9px] uppercase font-mono">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 font-mono font-bold text-slate-600 dark:text-slate-300">{p.moq} Units</td>
                          <td className="py-3.5 px-2 text-slate-400 font-mono text-[10px]">GSM: {p.paperGsm.join("-")} | Pages: {p.pages.join("-")}</td>
                          <td className="py-3.5 px-2 text-right space-x-1">
                            <button
                              onClick={() => handleEditProductClick(p)}
                              className="p-1.5 text-slate-500 hover:text-brand-blue hover:bg-brand-blue/5 rounded-md"
                              title="Edit product"
                              id={`btn-crud-edit-${p.id}`}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteProduct(p.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-md"
                              title="Delete product"
                              id={`btn-crud-del-${p.id}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {adminTab === "inquiries" && (
              /* TAB C: INQUIRIES MANAGEMENT VIEW */
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Customer Catalog Inquiry Logs</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleExportCSV}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
                      id="btn-export-csv"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Export Excel (CSV)</span>
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
                      id="btn-export-pdf"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      <span>Export PDF</span>
                    </button>
                  </div>
                </div>

                {inquiries.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <p className="font-display font-bold text-sm mb-1">No Inquiries Logged</p>
                    <p className="text-xs">Incoming inquiries from customer checkouts will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-4 text-xs"
                      >
                        <div className="space-y-2 max-w-xl">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-[10px] text-slate-400">ID: #{inq.id}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{inq.name}</span>
                            <span className="text-slate-400">({inq.companyName})</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                            <div>📞 {inq.phone} | ✉ {inq.email}</div>
                            <div>📍 {inq.city}, {inq.state} | GSTIN: {inq.gstNumber || "N/A"}</div>
                          </div>

                          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100">
                            <span className="font-semibold text-slate-700 block mb-1">Requested Items:</span>
                            <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
                              {inq.selectedProducts?.map((p, idx) => (
                                <li key={idx}>
                                  <strong className="text-slate-700 dark:text-slate-300">{p.productName}</strong> - Quantity: {p.quantity} units
                                </li>
                              ))}
                            </ul>
                            {inq.message && (
                              <p className="mt-2 text-[11px] text-slate-400 italic">" {inq.message} "</p>
                            )}
                          </div>
                        </div>

                        {/* Status controls */}
                        <div className="flex flex-col justify-between items-end shrink-0">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            inq.status === "Approved" 
                              ? "bg-emerald-500/10 text-emerald-500" 
                              : inq.status === "Quotation Sent"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-amber-500/10 text-amber-500"
                          }`}>
                            Status: {inq.status}
                          </span>

                          <div className="flex space-x-1.5 mt-4">
                            <button
                              onClick={() => handleUpdateInquiryStatus(inq.id, "Quotation Sent")}
                              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-[10px]"
                              id={`btn-inq-send-${inq.id}`}
                            >
                              Quote Sent
                            </button>
                            <button
                              onClick={() => handleUpdateInquiryStatus(inq.id, "Approved")}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[10px]"
                              id={`btn-inq-appr-${inq.id}`}
                            >
                              Approve Inquiry
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {adminTab === "dealers" && (
              /* TAB D: DISTRIBUTOR ONBOARDING REVIEW */
              <div className="space-y-6">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Distributor Onboarding Applications</h3>

                {dealers.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <p className="font-display font-bold text-sm mb-1">No Applications Registered</p>
                    <p className="text-xs">Distributor applications from dealer registration will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dealers.map((dlr) => (
                      <div
                        key={dlr.id}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-4 text-xs"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-[10px] text-slate-400">APP_ID: #{dlr.id}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{dlr.companyName}</span>
                            <span className="text-slate-400">({dlr.name})</span>
                          </div>

                          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                            <div>📞 {dlr.phone} | ✉ {dlr.email}</div>
                            <div>📍 Location: {dlr.city || "All India"}, {dlr.state}</div>
                            <div>💼 Annual requirement: <strong className="text-slate-700 dark:text-slate-300">{dlr.annualRequirement}</strong></div>
                            <div>📄 Uploaded Doc: <span className="text-brand-blue underline cursor-pointer hover:text-brand-royal" onClick={() => alert("Simulated Document Display: GST Registry Certificate Approved.")}>{dlr.documentName}</span></div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col justify-between items-end shrink-0">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            dlr.status === "Approved"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : dlr.status === "Rejected"
                              ? "bg-rose-500/10 text-rose-500"
                              : "bg-amber-500/10 text-amber-500"
                          }`}>
                            Status: {dlr.status}
                          </span>

                          <div className="flex space-x-1.5 mt-4">
                            <button
                              onClick={() => handleUpdateDealerStatus(dlr.id, "Approved")}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[10px]"
                              id={`btn-dlr-appr-${dlr.id}`}
                            >
                              Approve Dealer
                            </button>
                            <button
                              onClick={() => handleUpdateDealerStatus(dlr.id, "Rejected")}
                              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-[10px]"
                              id={`btn-dlr-rej-${dlr.id}`}
                            >
                              Reject App
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {adminTab === "notify" && (
              /* TAB E: PUSH BROADCAST DESK */
              <div className="max-w-md mx-auto py-4">
                <form onSubmit={handleBroadcastNotification} className="space-y-4 text-xs">
                  <div className="text-center mb-6">
                    <BellRing className="h-8 w-8 text-brand-blue mx-auto mb-2 animate-bounce" />
                    <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">Broadcast Push Notification</h3>
                    <p className="text-[10px] text-slate-400 mt-1">Send a flash notification to all users currently browsing our catalog applet.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold block">Notification Title *</label>
                    <input
                      type="text"
                      required
                      value={notifyTitle}
                      onChange={(e) => setNotifyTitle(e.target.value)}
                      placeholder="e.g. 🌿 Exclusive Monsoon Discount Extended!"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold block">Message Body *</label>
                    <textarea
                      required
                      rows={3}
                      value={notifyBody}
                      onChange={(e) => setNotifyBody(e.target.value)}
                      placeholder="e.g. Authorized distributors get an additional 5% off on our entire Royal Notebook catalog until July 15th! Apply now."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 focus:outline-none"
                    ></textarea>
                  </div>

                  {notifySuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-center font-bold">
                      ✓ Push Notification Broadcasted Successfully!
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-blue hover:bg-brand-royal text-white font-display font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-1.5"
                    id="btn-broadcast-submit"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Push Broadcast</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
