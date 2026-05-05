export type Tier = "Trusted" | "Pro" | "Elite";
export type SupplierCategory =
  | "agriculture"
  | "craft"
  | "manufacturing"
  | "seafood"
  | "textile"
  | "beverage"
  | "wellness";
export type BuyerSize = "SME" | "Mid-Market" | "Enterprise";
export type DealStatus =
  | "opened"
  | "negotiating"
  | "agreed"
  | "verifying"
  | "paid"
  | "closed"
  | "cancelled"
  | "disputed";

export interface Supplier {
  id: string;
  name: string;
  name_th: string | null;
  category: SupplierCategory;
  region: string;
  description: string | null;
  description_th: string | null;
  tier: Tier;
  patrick_circle: boolean;
  verified: boolean;
  verified_at: string | null;
  performance_score: number;
  review_count: number;
  review_avg: number;
  past_deals_count: number;
  past_gmv_usd: number;
  certifications: string[];
  tags: string[];
  hero_image_prompt: string | null;
  created_at: string;
}

export interface Buyer {
  id: string;
  name: string;
  country: string;
  country_code: string | null;
  industry: string;
  size: BuyerSize;
  contact_role: string | null;
  description: string | null;
  verified: boolean;
  verified_at: string | null;
  performance_score: number;
  review_count: number;
  review_avg: number;
  past_deals_count: number;
  past_spend_usd: number;
  preferred_categories: SupplierCategory[] | null;
  budget_usd_typical_min: number | null;
  budget_usd_typical_max: number | null;
  created_at: string;
}

export interface Demand {
  id: string;
  buyer_id: string;
  title: string;
  category: SupplierCategory;
  quantity_text: string | null;
  budget_usd_min: number | null;
  budget_usd_max: number | null;
  needed_by: string | null;
  description: string | null;
  status: string;
  created_at: string;
}

export interface Deal {
  id: string;
  supplier_id: string;
  buyer_id: string;
  demand_id: string | null;
  status: DealStatus;
  amount_usd: number;
  commission_rate: number;
  commission_usd: number;
  notes: string | null;
  opened_at: string;
  agreed_at: string | null;
  paid_at: string | null;
  closed_at: string | null;
  cancelled_at: string | null;
}

export interface DealEvent {
  id: number;
  deal_id: string;
  event_type: string;
  actor: string;
  message: string | null;
  payload: Record<string, unknown> | null;
  occurred_at: string;
}
