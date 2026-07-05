/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from "jspdf";
import { Product } from "../types";

/**
 * Generates a professional PDF catalog datasheet for a specific product.
 */
export function generateProductPDF(product: Product, language: "en" | "hi") {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const primaryColor = [15, 23, 42]; // Slate 900
  const accentColor = [29, 78, 216]; // Brand Blue (Royal)
  const textColor = [51, 65, 85]; // Slate 700
  const lightBg = [248, 250, 252]; // Slate 50
  const borderColor = [226, 232, 240]; // Slate 200

  // --- HEADER SECTION ---
  // Draw primary color header block
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 40, "F");

  // Accent thin line
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(0, 40, pageWidth, 2, "F");

  // Header Typography
  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(20);
  doc.text("SHRI SHIV ENTERPRISES", margin, 16);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(219, 234, 254); // Blue 100
  doc.text("PREMIUM NOTEBOOKS & STATIONERY MANUFACTURERS", margin, 23);

  // Corporate Details on Right
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("Mob: +91 63935 39533", pageWidth - margin, 15, { align: "right" });
  doc.text("Email: shrishiventerprises2025@gmail.com", pageWidth - margin, 21, { align: "right" });
  doc.text("Office: 41/1, Bajrang Vihar, Kanpur", pageWidth - margin, 27, { align: "right" });
  doc.text("Website: www.shrishiventerprises.in", pageWidth - margin, 33, { align: "right" });

  let yPos = 55;

  // --- DOCUMENT TITLE ---
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.text("PRODUCT TECHNICAL DATASHEET", margin, yPos);
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  const now = new Date();
  doc.text(`Generated: ${now.toLocaleDateString("en-US")} | Time: ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} UTC`, pageWidth - margin, yPos, { align: "right" });

  // Draw thin separator line
  yPos += 4;
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  yPos += 10;

  // --- PRODUCT TITLE & CATEGORY ---
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.text(product.name, margin, yPos, { maxWidth: contentWidth });
  
  // Calculate text height for name
  const nameLines = doc.splitTextToSize(product.name, contentWidth);
  yPos += nameLines.length * 7;

  // Category & Price
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`Category: ${product.category.toUpperCase()}`, margin, yPos);
  
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(16, 185, 129); // Emerald 500
  doc.text(product.price, pageWidth - margin, yPos, { align: "right" });

  yPos += 8;

  // Hindi name if available
  if (product.nameHindi) {
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Catalog Ref (Hindi): ${product.nameHindi}`, margin, yPos);
    yPos += 6;
  }

  yPos += 4;

  // --- TECHNICAL SPECIFICATIONS GRID ---
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(margin, yPos, contentWidth, 80, "F");
  doc.rect(margin, yPos, contentWidth, 80, "S");

  // Grid inner line
  doc.line(pageWidth / 2, yPos, pageWidth / 2, yPos + 80);

  // Grid Heading
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, yPos, contentWidth, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("OFFICIAL TECHNICAL SPECIFICATIONS", margin + 4, yPos + 5.5);

  yPos += 8;

  // Utility to write grid row
  const drawSpecRow = (label: string, value: string, rowY: number, onRightColumn = false) => {
    const startX = onRightColumn ? (pageWidth / 2) + 4 : margin + 4;
    doc.setTextColor(100, 116, 139); // Gray 500
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.text(label, startX, rowY + 6);

    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("Helvetica", "bold");
    const valX = onRightColumn ? pageWidth - margin - 4 : (pageWidth / 2) - 4;
    doc.text(value, valX, rowY + 6, { align: "right" });

    // Row separator
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.line(
      onRightColumn ? (pageWidth / 2) : margin,
      rowY + 10,
      onRightColumn ? pageWidth - margin : (pageWidth / 2),
      rowY + 10
    );
  };

  // Row heights are 10mm each
  drawSpecRow("Standard Sizes", product.sizes.join(", "), yPos, false);
  drawSpecRow("Min. Order Qty (MOQ)", `${product.moq} Units`, yPos, true);

  yPos += 10;
  drawSpecRow("Pages Range", `${product.pages.filter(p => p > 0).join("-")} Pages`, yPos, false);
  drawSpecRow("Bulk Packaging", product.packaging.length > 20 ? `${product.packaging.substring(0, 18)}...` : product.packaging, yPos, true);

  yPos += 10;
  drawSpecRow("Paper Quality", `${product.paperGsm.filter(g => g > 0).join("-")} GSM`, yPos, false);
  drawSpecRow("Stock Status", product.stockStatus, yPos, true);

  yPos += 10;
  drawSpecRow("Binding Style", product.bindingType[0] || "Standard", yPos, false);
  drawSpecRow("Cover Variant", product.coverType[0] || "Hardcover", yPos, true);

  yPos += 10;
  drawSpecRow("Colors Available", product.availableColors.slice(0, 3).join(", "), yPos, false);
  drawSpecRow("Quality Rating", `${product.rating} / 5.0 Stars`, yPos, true);

  yPos += 30; // Move past the specification box

  // --- DESCRIPTION SECTION ---
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.text("PRODUCT OVERVIEW & CHARACTERISTICS", margin, yPos);

  yPos += 5;
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9.5);
  
  const descText = language === "en" ? product.description : product.descriptionHindi || product.description;
  const splitDesc = doc.splitTextToSize(descText, contentWidth);
  doc.text(splitDesc, margin, yPos);

  yPos += (splitDesc.length * 5) + 12;

  // --- COMPLIANCE & ACCREDITATIONS ---
  if (yPos < pageHeight - 65) {
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.rect(margin, yPos, contentWidth, 22, "F");
    doc.rect(margin, yPos, contentWidth, 22, "S");

    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Corporate Manufacturing Standards Compliance", margin + 4, yPos + 6);

    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.text("- 100% Eco-conscious wood-free writing paper raw material.", margin + 4, yPos + 11);
    doc.text("- Manufactured on automated high-precision disc bindings and metallic spiral loops.", margin + 4, yPos + 15.5);
    doc.text("- Zero-smudge and high ink-retention coating guarantees supreme legibility.", margin + 4, yPos + 20);
  }

  // --- FOOTER SECTION ---
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(0, pageHeight - 30, pageWidth, 30, "F");
  
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.line(0, pageHeight - 30, pageWidth, pageHeight - 30);

  doc.setTextColor(148, 163, 184); // Slate 400
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(
    "Office/Factory: 41/1, Bajrang Vihar, Khadepur, Kanpur, UP - 208021 | Mob: +91 63935 39533 | shrishiventerprises2025@gmail.com",
    pageWidth / 2,
    pageHeight - 20,
    { align: "center" }
  );
  doc.text(
    "This product data document is officially certified by Shri Shiv Enterprises. All specifications are standard.",
    pageWidth / 2,
    pageHeight - 15,
    { align: "center" }
  );

  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("SHRI SHIV ENTERPRISES - QUALITY COMMITTED SINCE INCEPTION", pageWidth / 2, pageHeight - 8, { align: "center" });

  // Save PDF
  const filename = `${product.name.replace(/\s+/g, "_")}_Datasheet.pdf`;
  doc.save(filename);
}

/**
 * Generates a professional PDF for the current inquiry items and proforma estimation sheet.
 */
export function generateInquiryPDF(
  inquiryCart: { product: Product; quantity: number }[],
  clientDetails?: {
    name: string;
    company: string;
    phone: string;
    email: string;
    city: string;
    state: string;
    gst?: string;
    message?: string;
  },
  aiQuotation?: string | null
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const primaryColor = [15, 23, 42]; // Slate 900
  const accentColor = [29, 78, 216]; // Brand Blue (Royal)
  const textColor = [51, 65, 85]; // Slate 700
  const lightBg = [248, 250, 252]; // Slate 50
  const borderColor = [226, 232, 240]; // Slate 200

  // --- HEADER SECTION ---
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(0, 40, pageWidth, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(20);
  doc.text("SHRI SHIV ENTERPRISES", margin, 16);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(219, 234, 254);
  doc.text("PREMIUM NOTEBOOKS & STATIONERY MANUFACTURERS", margin, 23);

  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("Mob: +91 63935 39533", pageWidth - margin, 15, { align: "right" });
  doc.text("Email: shrishiventerprises2025@gmail.com", pageWidth - margin, 21, { align: "right" });
  doc.text("Office: 41/1, Bajrang Vihar, Kanpur", pageWidth - margin, 27, { align: "right" });
  doc.text("Website: www.shrishiventerprises.in", pageWidth - margin, 33, { align: "right" });

  let yPos = 55;

  // --- DOCUMENT TITLE ---
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.text("OFFICIAL QUOTATION INQUIRY SHEET", margin, yPos);
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  const now = new Date();
  doc.text(`Date: ${now.toLocaleDateString("en-US")} | Ref: SSE-INQ-${Math.floor(100000 + Math.random() * 900000)}`, pageWidth - margin, yPos, { align: "right" });

  yPos += 4;
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  yPos += 8;

  // --- CLIENT DETAILS BLOCK ---
  if (clientDetails && clientDetails.name) {
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.rect(margin, yPos, contentWidth, 32, "F");
    doc.rect(margin, yPos, contentWidth, 32, "S");

    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text("INQUIRER BUSINESS DETAILS", margin + 4, yPos + 6);

    // Business Data columns
    doc.setFontSize(8.5);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFont("Helvetica", "normal");

    doc.text(`Proprietor: ${clientDetails.name}`, margin + 4, yPos + 13);
    doc.text(`Company: ${clientDetails.company}`, margin + 4, yPos + 19);
    doc.text(`Phone No: ${clientDetails.phone}`, margin + 4, yPos + 25);

    const startRightX = (pageWidth / 2) + 10;
    doc.text(`Email: ${clientDetails.email}`, startRightX, yPos + 13);
    doc.text(`Location: ${clientDetails.city}, ${clientDetails.state}`, startRightX, yPos + 19);
    doc.text(`GSTIN No: ${clientDetails.gst || "Not Provided"}`, startRightX, yPos + 25);

    yPos += 38;
  }

  // --- TABLE OF ITEMS ---
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.text("SELECTED CATALOG ITEMS & REQUIREMENTS", margin, yPos);

  yPos += 5;

  // Draw Table Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, yPos, contentWidth, 8, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("S.No", margin + 3, yPos + 5.5);
  doc.text("Notebook Variety & Product Description", margin + 15, yPos + 5.5);
  doc.text("Min. MOQ", pageWidth - margin - 45, yPos + 5.5, { align: "right" });
  doc.text("Target Qty", pageWidth - margin - 5, yPos + 5.5, { align: "right" });

  yPos += 8;

  // Draw Table Rows
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);

  inquiryCart.forEach((item, index) => {
    // Row background toggle
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, yPos, contentWidth, 10, "F");
    }

    doc.setFont("Helvetica", "bold");
    doc.text(String(index + 1), margin + 3, yPos + 6.5);
    doc.text(item.product.name.replace(" - Premium Quality", ""), margin + 15, yPos + 6.5, { maxWidth: 100 });
    
    doc.setFont("Helvetica", "normal");
    doc.text(`${item.product.moq} units`, pageWidth - margin - 45, yPos + 6.5, { align: "right" });
    doc.setFont("Helvetica", "bold");
    doc.text(`${item.quantity} units`, pageWidth - margin - 5, yPos + 6.5, { align: "right" });

    // Thin row border
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.line(margin, yPos + 10, pageWidth - margin, yPos + 10);
    yPos += 10;
  });

  yPos += 5;

  // Message if present
  if (clientDetails && clientDetails.message) {
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Custom Customization Message:", margin, yPos);
    
    yPos += 4;
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    const splitMsg = doc.splitTextToSize(`"${clientDetails.message}"`, contentWidth);
    doc.text(splitMsg, margin, yPos);
    yPos += (splitMsg.length * 4) + 6;
  }

  // AI Generated Quotation markdown if available
  if (aiQuotation) {
    // If running out of space, add a new page
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }

    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("INSTANT AI PROFORMA ESTIMATION DETAILS", margin, yPos);

    yPos += 5;

    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    const remainingHeight = pageHeight - yPos - 35;
    const boxHeight = Math.min(100, remainingHeight);
    doc.rect(margin, yPos, contentWidth, boxHeight, "F");
    doc.rect(margin, yPos, contentWidth, boxHeight, "S");

    doc.setTextColor(30, 41, 59);
    doc.setFont("Courier", "normal");
    doc.setFontSize(7.5);

    // Filter markdown chars briefly for plain display
    const cleanedQuote = aiQuotation
      .replace(/[#*`_-]/g, "")
      .split("\n")
      .slice(0, 16) // limit lines to fit
      .join("\n");

    const splitQuote = doc.splitTextToSize(cleanedQuote, contentWidth - 8);
    doc.text(splitQuote, margin + 4, yPos + 6);

    yPos += boxHeight + 10;
  }

  // Footer Placement
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(0, pageHeight - 30, pageWidth, 30, "F");
  doc.line(0, pageHeight - 30, pageWidth, pageHeight - 30);

  doc.setTextColor(148, 163, 184);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(
    "Office/Factory: 41/1, Bajrang Vihar, Khadepur, Kanpur, UP - 208021 | Mob: +91 63935 39533 | shrishiventerprises2025@gmail.com",
    pageWidth / 2,
    pageHeight - 20,
    { align: "center" }
  );
  doc.text(
    "Our corporate offices will inspect this requirement sheet and dispatch legal tax proforma invoices via WhatsApp.",
    pageWidth / 2,
    pageHeight - 15,
    { align: "center" }
  );

  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("SHRI SHIV ENTERPRISES - QUALITY SELLS ITSELF", pageWidth / 2, pageHeight - 8, { align: "center" });

  const filename = `Shri_Shiv_Quotation_Inquiry_${Date.now().toString().slice(-6)}.pdf`;
  doc.save(filename);
}
