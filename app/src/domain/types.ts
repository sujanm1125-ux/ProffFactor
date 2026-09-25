/**
 * Domain types for AegisBid zero-knowledge sealed-bid dApp.
 */

export type AuctionCategory = 'procurement' | 'liquidation' | 'otc-block' | 'spectrum-license';
export type AuctionStatus = 'Open' | 'Closed' | 'Settled' | 'Cancelled';
export type MidnightNetwork = 'preprod' | 'preview';

export interface Auction {
  id: string;
  auctionIdHex: string;
  title: string;
  description: string;
  category: AuctionCategory;
  reservePrice: bigint;
  currency: string;
  biddingDeadlineBlock: bigint;
  sellerIdentityHex: string;
  status: AuctionStatus;
  highestCommitmentHex?: string;
  clearedAmount?: bigint;
  winnerIdentityHex?: string;
  contractAddress?: string;
  network: MidnightNetwork;
  bidsCount: number;
}

export interface LocalBidderSecret {
  id: string;
  label: string;
  secretHex: string;
  derivedIdentityHex: string;
  createdAt: string;
}

export interface StagedBidWitness {
  auctionIdHex: string;
  bidderSecretHex: string;
  amount: bigint;
  saltHex: string;
  commitmentHex: string;
  nullifierHex: string;
  reserveCompliant: boolean;
}

export interface ProofProgressStep {
  id: string;
  title: string;
  detail: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
}

export interface FinalizedReceipt {
  id: string;
  auctionIdHex: string;
  transactionId: string;
  commitmentHex: string;
  nullifierHex: string;
  circuitName: string;
  proofOutcome: 'finalized' | 'simulated_local';
  blockHeight?: number;
  network: MidnightNetwork;
  disclosureScope: {
    disclosedFields: string[];
    hiddenWitnessFields: string[];
    provenPredicates: string[];
  };
  timestamp: string;
  demoMode: boolean;
}

export interface WalletState {
  connected: boolean;
  walletId: string;
  walletName: string;
  is1AM: boolean;
  unshieldedAddress: string;
  network: MidnightNetwork;
  isDemo: boolean;
  error?: string;
}

export interface GeminiPlan {
  recommendedTitle: string;
  auctionCategory: string;
  suggestedReservePrice: number;
  proofPlanSummary: string;
  privacyAnalysis: Array<{
    field_name: string;
    visibility: string;
    storage_location: string;
    zk_justification: string;
  }>;
  complianceNotes: string;
  fallbackUsed: boolean;
}
