import nodemailer from "nodemailer";

interface EmailPayload {
  to: string;
  customerName: string;
  inquiryId: string;
  items: Array<{ productName: string; quantity: number }>;
}

let transporter: nodemailer.Transporter | null = null;

// Lazy initialization of SMTP transporter
function getTransporter(): nodemailer.Transporter | null {
  const user = process.env.SMTP_USER || "shrishiventerprises2025@gmail.com";
  const pass = (process.env.SMTP_PASS || "lktw ornh irnd ctsx").replace(/\s+/g, "");
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);

  if (!user || !pass) {
    console.log("ℹ️ [Mailer] SMTP_USER or SMTP_PASS not configured. Emails will be logged to the console.");
    return null;
  }

  if (!transporter) {
    try {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });
      console.log("✅ [Mailer] Nodemailer SMTP Transporter initialized successfully.");
    } catch (error) {
      console.error("❌ [Mailer] Failed to initialize SMTP Transporter:", error);
    }
  }

  return transporter;
}

// 1. Initial Inquiry Receipt Confirmation Email
export async function sendInquiryConfirmationEmail(payload: EmailPayload) {
  const { to, customerName, inquiryId, items } = payload;
  
  const itemsHtml = items && items.length > 0 
    ? items.map(item => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 0; font-weight: 600; color: #1e293b;">${item.productName}</td>
        <td style="padding: 10px 0; text-align: right; color: #64748b;">${item.quantity} units</td>
      </tr>
    `).join("")
    : `<tr><td colspan="2" style="padding: 10px 0; text-align: center; color: #64748b;">No items listed</td></tr>`;

  const emailSubject = `🙏 Thank You for Your Inquiry! - Shri Shiv Enterprises (Ref: ${inquiryId})`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thank You for Your Inquiry - Shri Shiv Enterprises</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02); border: 1px solid #e2e8f0; }
        .header { background-color: #1e3a8a; padding: 32px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em; }
        .header p { margin: 4px 0 0 0; font-size: 13px; color: #93c5fd; text-transform: uppercase; letter-spacing: 0.05em; }
        .content { padding: 32px 24px; color: #334155; }
        .greeting { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 16px; }
        .message { font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 24px; }
        .order-details { background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
        .order-details h3 { margin-top: 0; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; }
        .order-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .divider { height: 1px; background-color: #cbd5e1; margin: 24px 0; }
        .footer { padding: 24px; text-align: center; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
        .footer p { margin: 4px 0; }
        .badge { display: inline-block; padding: 6px 12px; background-color: #e0f2fe; color: #0369a1; border-radius: 9999px; font-weight: 600; font-size: 12px; margin-bottom: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Brand Header -->
        <div class="header">
          <h1>SHRI SHIV ENTERPRISES</h1>
          <p>Premium Notebooks & Stationery Manufacturers</p>
        </div>

        <!-- Body Content -->
        <div class="content">
          <div style="text-align: center;">
            <span class="badge">🙏 Thank You for Your Inquiry!</span>
          </div>

          <div class="greeting">Dear ${customerName || "Customer"},</div>

          <div class="message">
            Thank you for contacting <strong>Shri Shiv Enterprises</strong>.
          </div>

          <div class="message">
            We have successfully received your inquiry. Our team will carefully review your requirements and get back to you as soon as possible with the best quotation and product details.
          </div>

          <div class="message">
            We are committed to delivering premium-quality notebooks and stationery products, competitive pricing, and reliable service to meet your business needs.
          </div>

          <div class="message">
            We appreciate your trust in Shri Shiv Enterprises and look forward to serving you.
          </div>

          <div class="divider"></div>

          <!-- Summary Card of Inquired Items -->
          <div class="order-details">
            <h3>Inquired Products (Ref: ${inquiryId})</h3>
            <table class="order-table">
              <thead>
                <tr style="border-bottom: 2px solid #cbd5e1; text-align: left; color: #475569;">
                  <th style="padding-bottom: 8px;">Product Description</th>
                  <th style="padding-bottom: 8px; text-align: right;">Quantity</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <p style="margin: 24px 0 0 0; font-size: 14px; font-weight: 600; color: #0f172a;">
            Best Regards,<br />
            <span style="color: #1e3a8a; font-size: 15px;">Shri Shiv Enterprises</span><br />
            <span style="font-size: 12px; font-weight: normal; color: #64748b;">Premium Notebooks & Stationery Manufacturer, Wholesaler, Supplier & Distributor</span>
          </p>
        </div>

        <!-- Corporate Footer -->
        <div class="footer">
          <p style="font-weight: 600; color: #334155;">Shri Shiv Enterprises</p>
          <p>Office & Factory: 41/1, Bajrang Vihar, Khadepur, Kanpur, UP - 208021</p>
          <p>Helpline Support: +91 63935 39533 | shrishiventerprises2025@gmail.com</p>
          <p style="font-size: 11px; margin-top: 12px; color: #94a3b8;">© 2026 Shri Shiv Enterprises. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textAlternative = `
Thank You for Your Inquiry! 🙏

Dear ${customerName || "Customer"},

Thank you for contacting Shri Shiv Enterprises.

We have successfully received your inquiry (Reference ID: ${inquiryId}). Our team will carefully review your requirements and get back to you as soon as possible with the best quotation and product details.

Inquired Products:
${items && items.length > 0 ? items.map(item => `- ${item.productName}: ${item.quantity} units`).join("\n") : "No items listed"}

We are committed to delivering premium-quality notebooks and stationery products, competitive pricing, and reliable service to meet your business needs.

We appreciate your trust in Shri Shiv Enterprises and look forward to serving you.

Shri Shiv Enterprises
Premium Notebooks & Stationery Manufacturer, Wholesaler, Supplier & Distributor

--------------------------------------------------
Office & Factory: 41/1, Bajrang Vihar, Khadepur, Kanpur, UP - 208021
Hotline Helpline: +91 63935 39533
Official Email: shrishiventerprises2025@gmail.com
Website: www.shrishiventerprises.in
  `;

  const mailOptions = {
    from: `"Shri Shiv Enterprises" <${process.env.SMTP_USER || "shrishiventerprises2025@gmail.com"}>`,
    to,
    subject: emailSubject,
    text: textAlternative,
    html: emailHtml,
  };

  const smtpTransporter = getTransporter();

  if (smtpTransporter) {
    try {
      const info = await smtpTransporter.sendMail(mailOptions);
      console.log(`✉️ [Mailer] Inquiry received email sent successfully to ${to}. Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ [Mailer] Failed to send email to ${to}:`, error);
      return { success: false, error };
    }
  } else {
    console.log(`📝 [Mailer Simulated Inquiry received Email Logs]:
========================================
TO: ${to}
SUBJECT: ${emailSubject}
BODY:
${textAlternative}
========================================`);
    return { success: true, simulated: true };
  }
}

// 2. Inquiry Accepted Confirmation Email
export async function sendInquiryAcceptedEmail(payload: EmailPayload) {
  const { to, customerName, inquiryId, items } = payload;
  
  const itemsHtml = items && items.length > 0 
    ? items.map(item => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 0; font-weight: 600; color: #1e293b;">${item.productName}</td>
        <td style="padding: 10px 0; text-align: right; color: #64748b;">${item.quantity} units</td>
      </tr>
    `).join("")
    : `<tr><td colspan="2" style="padding: 10px 0; text-align: center; color: #64748b;">No items listed</td></tr>`;

  const emailSubject = `🎉 Inquiry Accepted! - Shri Shiv Enterprises (Ref: ${inquiryId})`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Inquiry Accepted - Shri Shiv Enterprises</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02); border: 1px solid #e2e8f0; }
        .header { background-color: #1e3a8a; padding: 32px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em; }
        .header p { margin: 4px 0 0 0; font-size: 13px; color: #93c5fd; text-transform: uppercase; letter-spacing: 0.05em; }
        .content { padding: 32px 24px; color: #334155; }
        .greeting { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 16px; }
        .message { font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 24px; }
        .order-details { background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
        .order-details h3 { margin-top: 0; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; }
        .order-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .divider { height: 1px; background-color: #cbd5e1; margin: 24px 0; }
        .footer { padding: 24px; text-align: center; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
        .footer p { margin: 4px 0; }
        .badge { display: inline-block; padding: 6px 12px; background-color: #dcfce7; color: #15803d; border-radius: 9999px; font-weight: 600; font-size: 12px; margin-bottom: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Brand Header -->
        <div class="header">
          <h1>SHRI SHIV ENTERPRISES</h1>
          <p>Premium Notebooks & Stationery Manufacturers</p>
        </div>

        <!-- Body Content -->
        <div class="content">
          <div style="text-align: center;">
            <span class="badge">🎉 Inquiry Accepted!</span>
          </div>

          <div class="greeting">Dear ${customerName || "Customer"},</div>

          <div class="message">
            Thank you for choosing <strong>Shri Shiv Enterprises</strong>.
          </div>

          <div class="message">
            We are pleased to inform you that your inquiry has been accepted. Our team is now preparing the best quotation and processing your request.
          </div>

          <div class="message">
            A dedicated representative will contact you shortly to confirm the product details, pricing, quantity, and delivery schedule.
          </div>

          <div class="message">
            Thank you for your trust. We look forward to building a long-term business relationship with you.
          </div>

          <div class="divider"></div>

          <!-- Summary Card of Inquired Items -->
          <div class="order-details">
            <h3>Accepted Inquiry Details (Ref: ${inquiryId})</h3>
            <table class="order-table">
              <thead>
                <tr style="border-bottom: 2px solid #cbd5e1; text-align: left; color: #475569;">
                  <th style="padding-bottom: 8px;">Product Description</th>
                  <th style="padding-bottom: 8px; text-align: right;">Quantity</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <p style="margin: 24px 0 0 0; font-size: 14px; font-weight: 600; color: #0f172a;">
            Best Regards,<br />
            <span style="color: #1e3a8a; font-size: 15px;">Shri Shiv Enterprises</span><br />
            <span style="font-size: 12px; font-weight: normal; color: #64748b;">Premium Notebooks & Stationery Manufacturer, Wholesaler, Supplier & Distributor</span>
          </p>
        </div>

        <!-- Corporate Footer -->
        <div class="footer">
          <p style="font-weight: 600; color: #334155;">Shri Shiv Enterprises</p>
          <p>Office & Factory: 41/1, Bajrang Vihar, Khadepur, Kanpur, UP - 208021</p>
          <p>Helpline Support: +91 63935 39533 | shrishiventerprises2025@gmail.com</p>
          <p style="font-size: 11px; margin-top: 12px; color: #94a3b8;">© 2026 Shri Shiv Enterprises. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textAlternative = `
🎉 Inquiry Accepted!

Dear ${customerName || "Customer"},

Thank you for choosing Shri Shiv Enterprises.

We are pleased to inform you that your inquiry (Reference ID: ${inquiryId}) has been accepted. Our team is now preparing the best quotation and processing your request.

Products:
${items && items.length > 0 ? items.map(item => `- ${item.productName}: ${item.quantity} units`).join("\n") : "No items listed"}

A dedicated representative will contact you shortly to confirm the product details, pricing, quantity, and delivery schedule.

Thank you for your trust. We look forward to building a long-term business relationship with you.

Shri Shiv Enterprises
Premium Notebooks & Stationery Manufacturer, Wholesaler, Supplier & Distributor

--------------------------------------------------
Office & Factory: 41/1, Bajrang Vihar, Khadepur, Kanpur, UP - 208021
Hotline Helpline: +91 63935 39533
Official Email: shrishiventerprises2025@gmail.com
Website: www.shrishiventerprises.in
  `;

  const mailOptions = {
    from: `"Shri Shiv Enterprises" <${process.env.SMTP_USER || "shrishiventerprises2025@gmail.com"}>`,
    to,
    subject: emailSubject,
    text: textAlternative,
    html: emailHtml,
  };

  const smtpTransporter = getTransporter();

  if (smtpTransporter) {
    try {
      const info = await smtpTransporter.sendMail(mailOptions);
      console.log(`✉️ [Mailer] Inquiry accepted email sent successfully to ${to}. Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ [Mailer] Failed to send email to ${to}:`, error);
      return { success: false, error };
    }
  } else {
    console.log(`📝 [Mailer Simulated Inquiry Accepted Email Logs]:
========================================
TO: ${to}
SUBJECT: ${emailSubject}
BODY:
${textAlternative}
========================================`);
    return { success: true, simulated: true };
  }
}
