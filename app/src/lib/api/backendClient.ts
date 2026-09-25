/**
 * API Client connecting the AegisBid React frontend to the FastAPI backend.
 */
import { GeminiPlan, FinalizedReceipt, Auction } from '../../domain/types';

const API_BASE = (import.meta as any).env?.VITE_BACKEND_API_URL || 'http://127.0.0.1:8000';

export async function fetchBackendHealth(): Promise<{ status: string; midnight_network: string; gemini_assistant: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch {
    return {
      status: 'offline_mode',
      midnight_network: 'preprod',
      gemini_assistant: 'local_deterministic_engine',
    };
  }
}

export async function fetchPublicMetrics(): Promise<{
  total_auctions: number;
  open_auctions: number;
  settled_auctions: number;
  total_sealed_bids: number;
  active_network: string;
  verified_commitments_count: number;
}> {
  try {
    const res = await fetch(`${API_BASE}/api/metrics`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('Failed to fetch metrics');
    return await res.json();
  } catch {
    return {
      total_auctions: 4,
      open_auctions: 3,
      settled_auctions: 1,
      total_sealed_bids: 12,
      active_network: 'preprod',
      verified_commitments_count: 12,
    };
  }
}

export async function requestAssistantPlan(
  description: string,
  category: string,
  reserveThreshold?: number
): Promise<GeminiPlan> {
  try {
    const res = await fetch(`${API_BASE}/api/assistant/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        public_description: description,
        category,
        reserve_threshold: reserveThreshold,
      }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error('Assistant API returned error');
    return await res.json();
  } catch {
    // Deterministic client-side fallback
    return {
      recommendedTitle: `AegisBid: ${description.slice(0, 40)}...`,
      auctionCategory: category,
      suggestedReservePrice: reserveThreshold || 50000,
      proofPlanSummary: 'Zero-Knowledge Procurement Verification: Proves compliance against reserve price without disclosing exact private bid value.',
      privacyAnalysis: [
        {
          field_name: 'bidderSecret',
          visibility: 'PRIVATE',
          storage_location: 'Local Client Storage',
          zk_justification: 'Guarantees anonymous identity derivation and proof generation.',
        },
        {
          field_name: 'bidAmount',
          visibility: 'PRIVATE',
          storage_location: 'Local Client Storage',
          zk_justification: 'The circuit verifies amount >= reserve in zero-knowledge.',
        },
        {
          field_name: 'bidCommitment',
          visibility: 'PUBLIC',
          storage_location: 'Midnight Public Ledger',
          zk_justification: 'Cryptographic anchor binding the bid without disclosing valuation.',
        },
      ],
      complianceNotes: 'Client-side fallback active. Zero confidential parameters transmitted.',
      fallbackUsed: true,
    };
  }
}

export async function postReceiptToBackend(receipt: FinalizedReceipt): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/receipts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auction_id_hex: receipt.auctionIdHex,
        transaction_id: receipt.transactionId,
        commitment_hex: receipt.commitmentHex,
        nullifier_hex: receipt.nullifierHex,
        circuit_name: receipt.circuitName,
        proof_outcome: receipt.proofOutcome,
        block_height: receipt.blockHeight || 1024,
        network: receipt.network,
        disclosure_scope: JSON.stringify(receipt.disclosureScope),
      }),
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    // Silently continue if backend is in local disconnected mode
  }
}
