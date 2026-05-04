// Shared types for ThailandGPT mock POC

export type Tier = "elite" | "pro" | "trusted" | "new" | "flagged";

export type SupplierCategory =
  | "agriculture"
  | "manufacturing"
  | "service"
  | "logistics"
  | "real-estate";

export interface Certification {
  name: string;
  issuer: string;
  validUntil?: string;
}

export interface Supplier {
  id: string;
  businessName: string;
  ownerName: string;
  category: SupplierCategory;
  subCategory: string;
  region: string;
  province: string;
  yearsInOperation: number;
  description: string;
  certifications: Certification[];
  capacity: string;
  pricePerUnit: string;
  tier: Tier;
  starRating: number;
  verifiedAt: string;
  pastDealCount: number;
  totalGmvUsd: number;
  endorsedByPatrick: boolean;
  heroImagePrompt: string; // Used to render gradient placeholder
  hashtags: string[];
}

export interface KbDoc {
  id: string;
  category: SupplierCategory;
  subCategory: string;
  language: "th" | "en";
  sourceType: "law" | "market" | "expert" | "news";
  source: string;
  text: string;
  freshnessDate: string;
}

export interface QueryResult {
  summary: string;
  matchedSuppliers: Array<{
    supplierId: string;
    matchScore: number;
    matchReason: string;
  }>;
  citations: Array<{
    docId: string;
    excerpt: string;
  }>;
  signalDetected: {
    primaryDemand: string;
    cascadingDemand?: string[];
    supplyGap?: string;
  };
  meta: {
    latencyMs: number;
    model: string;
    isMock: boolean;
  };
}

export interface MockDeal {
  id: string;
  buyerName: string;
  buyerCountry: string;
  supplierId: string;
  status: "opened" | "negotiating" | "agreed" | "verifying" | "paid" | "closed";
  amount: number;
  currency: "THB" | "USD" | "AED";
  productDescription: string;
  createdAt: string;
  patrickSignOff: boolean;
}
