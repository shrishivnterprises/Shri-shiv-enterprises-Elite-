/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from "./src/data/initialProducts.js";
import { sendInquiryConfirmationEmail, sendInquiryAcceptedEmail } from "./mailer.js";

const isESM = typeof import.meta !== "undefined" && typeof import.meta.url !== "undefined";
const currentFilePath = isESM ? fileURLToPath(import.meta.url) : (typeof __filename !== "undefined" ? __filename : "");
const currentDirPath = isESM ? path.dirname(currentFilePath) : (typeof __dirname !== "undefined" ? __dirname : "");

export const app = express();
const PORT = 3000;

app.use(express.json());

// Local Database Setup
const DB_PATH = path.join(process.cwd(), "db.json");

interface Database {
  products: any[];
  inquiries: any[];
  dealers: any[];
  reviews: any[];
}

let memoryDb: Database | null = null;

function getDatabase(): Database {
  if (memoryDb) {
    return memoryDb;
  }

  if (!fs.existsSync(DB_PATH)) {
    const initialDb: Database = {
      products: INITIAL_PRODUCTS,
      inquiries: [],
      dealers: [],
      reviews: INITIAL_REVIEWS,
    };
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2), "utf-8");
    } catch (e) {
      console.warn("Could not write initial db.json to file system, using in-memory database.", e);
    }
    memoryDb = initialDb;
    return initialDb;
  }
  try {
    const content = fs.readFileSync(DB_PATH, "utf-8");
    memoryDb = JSON.parse(content);
    return memoryDb!;
  } catch (e) {
    console.error("Error reading database, resetting...", e);
    const initialDb: Database = {
      products: INITIAL_PRODUCTS,
      inquiries: [],
      dealers: [],
      reviews: INITIAL_REVIEWS,
    };
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2), "utf-8");
    } catch (err) {
      console.warn("Could not write reset db.json to file system, using in-memory database.", err);
    }
    memoryDb = initialDb;
    return initialDb;
  }
}

function saveDatabase(db: Database) {
  memoryDb = db;
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write db.json to file system (expected on read-only environments like Vercel). Using in-memory fallback.", e);
  }
}

// Lazy Initialize Gemini API Client
let geminiAiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiAiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }
    geminiAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiAiClient;
}

// --- API Endpoints ---

// 1. Products Management
app.get("/api/products", (req, res) => {
  try {
    const db = getDatabase();
    res.json(db.products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/api/products", (req, res) => {
  try {
    const db = getDatabase();
    const newProduct = {
      ...req.body,
      id: req.body.id || `nb-${Date.now()}`,
      rating: req.body.rating || 5.0,
      reviewsCount: req.body.reviewsCount || 0,
    };
    db.products.push(newProduct);
    saveDatabase(db);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

app.put("/api/products/:id", (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Product not found" });
    }
    db.products[index] = { ...db.products[index], ...req.body };
    saveDatabase(db);
    res.json(db.products[index]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete("/api/products/:id", (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    db.products = db.products.filter((p) => p.id !== id);
    saveDatabase(db);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// 2. Inquiries Management
app.get("/api/inquiries", (req, res) => {
  try {
    const db = getDatabase();
    res.json(db.inquiries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

app.post("/api/inquiries", (req, res) => {
  try {
    const db = getDatabase();
    const newInquiry = {
      ...req.body,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "Pending",
    };
    db.inquiries.push(newInquiry);
    saveDatabase(db);

    // Send order confirmation / inquiry email in the background
    if (newInquiry.email) {
      sendInquiryConfirmationEmail({
        to: newInquiry.email,
        customerName: newInquiry.name,
        inquiryId: newInquiry.id,
        items: newInquiry.selectedProducts || [],
      }).catch((err) => {
        console.error("❌ Failed to trigger automatic confirmation email in background:", err);
      });
    }

    res.status(201).json(newInquiry);
  } catch (error) {
    res.status(500).json({ error: "Failed to create inquiry" });
  }
});

app.put("/api/inquiries/:id", (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const index = db.inquiries.findIndex((i) => i.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Inquiry not found" });
    }
    const previousStatus = db.inquiries[index].status;
    const newStatus = req.body.status;

    db.inquiries[index] = { ...db.inquiries[index], ...req.body };
    saveDatabase(db);

    // If inquiry got approved/accepted, trigger confirmation email
    if (newStatus === "Approved" && previousStatus !== "Approved" && db.inquiries[index].email) {
      sendInquiryAcceptedEmail({
        to: db.inquiries[index].email,
        customerName: db.inquiries[index].name,
        inquiryId: db.inquiries[index].id,
        items: db.inquiries[index].selectedProducts || [],
      }).catch((err) => {
        console.error("❌ Failed to trigger automatic accepted email in background:", err);
      });
    }

    res.json(db.inquiries[index]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update inquiry" });
  }
});

// 3. Dealer Onboarding
app.get("/api/dealers", (req, res) => {
  try {
    const db = getDatabase();
    res.json(db.dealers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dealers" });
  }
});

app.post("/api/dealers", (req, res) => {
  try {
    const db = getDatabase();
    const newDealer = {
      ...req.body,
      id: `dlr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "Pending",
    };
    db.dealers.push(newDealer);
    saveDatabase(db);
    res.status(201).json(newDealer);
  } catch (error) {
    res.status(500).json({ error: "Failed to submit dealer application" });
  }
});

app.put("/api/dealers/:id", (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const index = db.dealers.findIndex((d) => d.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Dealer application not found" });
    }
    db.dealers[index] = { ...db.dealers[index], ...req.body };
    saveDatabase(db);
    res.json(db.dealers[index]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update dealer status" });
  }
});

// 4. Reviews Management
app.get("/api/reviews", (req, res) => {
  try {
    const db = getDatabase();
    res.json(db.reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// --- AI (Gemini) Smart Features ---

// A. AI-powered Smart Search
app.post("/api/ai/search", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const db = getDatabase();
    const productsBrief = db.products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      moq: p.moq,
    }));

    const ai = getGeminiClient();
    const prompt = `
      You are an expert procurement assistant for Shri Shiv Enterprises, India's leading school/office notebooks and stationery manufacturer.
      The user is searching for products with the following search request: "${query}".
      
      Here is our product catalog list:
      ${JSON.stringify(productsBrief, null, 2)}
      
      Analyze the query and determine which of our products best fit the request. 
      Return a JSON response mapping product IDs to a matching confidence score (0 to 100) and a brief elegant explanation (in English) of why it's a great match.
      Provide a "recommendedSearchQuery" which is an optimized keyword search based on their intent, and a warm "aiMessage" summarizing your findings.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiMessage: {
              type: Type.STRING,
              description: "A friendly, premium AI message summarizing the search outcome and guidance.",
            },
            recommendedSearchQuery: {
              type: Type.STRING,
              description: "An optimized refined search term.",
            },
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  productId: { type: Type.STRING },
                  score: { type: Type.INTEGER, description: "Match percentage out of 100." },
                  reason: { type: Type.STRING, description: "Elegant explanation of why this product matches the intent." },
                },
                required: ["productId", "score", "reason"],
              },
            },
          },
          required: ["aiMessage", "matches"],
        },
      },
    });

    const aiResult = JSON.parse(response.text || "{}");
    res.json(aiResult);
  } catch (error) {
    console.error("AI Search Error:", error);
    res.status(500).json({ error: "AI search failed", details: error instanceof Error ? error.message : String(error) });
  }
});

// B. AI Product Recommendations
app.post("/api/ai/recommend", async (req, res) => {
  try {
    const { viewedProductIds } = req.body;
    const db = getDatabase();

    const viewedProducts = db.products.filter((p) => viewedProductIds?.includes(p.id));
    const allProductsBrief = db.products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      moq: p.moq,
      rating: p.rating,
    }));

    const ai = getGeminiClient();
    const prompt = `
      You are a professional retail and wholesale consultant at Shri Shiv Enterprises.
      The customer has been browsing these specific products:
      ${JSON.stringify(viewedProducts, null, 2)}
      
      Here is our entire catalog list:
      ${JSON.stringify(allProductsBrief, null, 2)}
      
      Recommend 3 complementary or upgraded products that would interest this client for wholesale or retail distribution.
      Return a JSON response containing an array of recommendations, and a personalized "recommendationReasoning" explaining the strategy.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendationReasoning: {
              type: Type.STRING,
              description: "Elegant professional feedback on why these items complement their current browsing history.",
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  productId: { type: Type.STRING },
                  confidence: { type: Type.INTEGER, description: "0-100 match rating" },
                  highlight: { type: Type.STRING, description: "Brief bullet point highlighting why this complements the set" },
                },
                required: ["productId", "confidence", "highlight"],
              },
            },
          },
          required: ["recommendationReasoning", "recommendations"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    res.status(500).json({ error: "AI recommendation failed" });
  }
});

// C. Professional Quotation Generation
app.post("/api/ai/quote-generate", async (req, res) => {
  try {
    const { name, companyName, city, state, selectedProducts, message, gstNumber } = req.body;

    const ai = getGeminiClient();
    const prompt = `
      You are the Lead Automated Billing & Commercial Quotation Engine of Shri Shiv Enterprises, India.
      Generate a professional, luxury-tier official wholesale pricing quotation in Markdown based on the customer details below:
      
      Customer Name: ${name}
      Company: ${companyName}
      Location: ${city}, ${state}, India
      GST: ${gstNumber || "Not Provided"}
      Requested Products with quantities:
      ${JSON.stringify(selectedProducts, null, 2)}
      
      Special Customer Message: "${message || "No special message."}"
      
      The quotation should be designed beautifully using rich Markdown.
      Structure it with:
      1. Letterhead of "Shri Shiv Enterprises"
         - Corporate Office & Factory: 41/1, Bajrang Vihar, Khadepur, Kanpur, Uttar Pradesh 208021, India
         - Hotline Helpline: +91 63935 39533
         - Official Email: shrishiventerprises2025@gmail.com
         - Website: www.shrishiventerprises.in
      2. Document Title: "OFFICIAL COMMERCIAL ESTIMATE / PROFORMA QUOTATION"
      3. Reference Number, Date (today), and validity (30 days)
      4. Customer Details block
      5. Itemized pricing table. Since notebooks are "Price on Request", list realistic professional wholesale estimates (e.g., standard school notebooks at ₹20 - ₹45 per unit depending on pages, and registers at ₹60 - ₹120 per unit). Compute subtotal, estimated SGST (9%), CGST (9%), and final estimated total.
      6. Standard professional commercial terms: Payment (50% advance, 50% on dispatch), Lead Time (7-10 working days), Dispatch via trusted Indian logistics partners, MOQ requirements, and validation.
      7. Closing message with premium enterprise greetings.
      
      Render strictly valid, stunning Markdown without raw HTML tags inside code blocks.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ quotationMarkdown: response.text });
  } catch (error) {
    console.error("Quotation Generation Error:", error);
    res.status(500).json({ error: "Quotation generation failed" });
  }
});

// Serving Client SPA in Dev / Production modes
async function startServer() {
  const isProduction = 
    process.env.NODE_ENV === "production" || 
    currentFilePath.endsWith("server.cjs") || 
    !fs.existsSync(path.join(process.cwd(), "server.ts"));

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = currentFilePath.endsWith("server.cjs")
      ? currentDirPath
      : path.join(currentDirPath, "dist");

    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

startServer();
