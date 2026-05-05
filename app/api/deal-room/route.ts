import { NextRequest, NextResponse } from "next/server";
import { getSupplier, listSuppliers } from "@/lib/db/queries";
import { calculateDealEconomics } from "@/lib/deal-economics";
import type { Supplier } from "@/lib/db/types";

/**
 * POST /api/deal-room
 * Body: { supplierId: string, query: string, product?: string }
 * Returns: full DealEconomics for 3-sided P&L analysis
 */
export async function POST(req: NextRequest) {
  try {
    const { supplierId, query, product } = (await req.json()) as {
      supplierId: string;
      query: string;
      product?: string;
    };

    if (!supplierId || !query) {
      return NextResponse.json({ error: "Missing supplierId or query" }, { status: 400 });
    }

    // Fetch supplier (Supabase or fallback)
    let supplier: Supplier | null = null;
    try {
      supplier = await getSupplier(supplierId);
    } catch {
      // Try fallback by ID match
      const all = await listSuppliers().catch(() => []);
      supplier = all.find(s => s.id === supplierId) ?? null;
    }

    if (!supplier) {
      return NextResponse.json({ error: `Supplier ${supplierId} not found` }, { status: 404 });
    }

    const economics = calculateDealEconomics(query, supplier, product);

    return NextResponse.json({
      supplier: {
        id: supplier.id,
        name: supplier.name_th ?? supplier.name,
        tier: supplier.tier,
        patrick_circle: supplier.patrick_circle,
        category: supplier.category,
        region: supplier.region,
        certifications: supplier.certifications,
        performance_score: supplier.performance_score,
      },
      query,
      economics,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
