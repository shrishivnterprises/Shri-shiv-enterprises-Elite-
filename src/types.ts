/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  nameHindi?: string;
  category: string;
  description: string;
  descriptionHindi?: string;
  price: string; // "Price on Request"
  sizes: string[];
  pages: number[];
  paperGsm: number[];
  bindingType: string[];
  coverType: string[];
  availableColors: string[];
  moq: number; // Minimum Order Quantity
  packaging: string;
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
  images: string[];
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewsCount: number;
}

export interface Inquiry {
  id: string;
  name: string;
  companyName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  country: string;
  gstNumber?: string;
  selectedProducts: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
  message: string;
  createdAt: string;
  status: "Pending" | "Reviewed" | "Quotation Sent" | "Approved";
  generatedQuotation?: string; // AI generated text
}

export interface DealerApplication {
  id: string;
  name: string;
  companyName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  annualRequirement: string;
  gstNumber: string;
  documentName?: string;
  createdAt: string;
  status: "Pending" | "Under Review" | "Approved" | "Rejected";
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  commentHindi?: string;
  date: string;
  company: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
}
