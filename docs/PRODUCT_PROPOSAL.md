# AegisBid: Product Proposal & Discovery Report

## 1. Product Discovery & Concept Evaluation

During discovery, three original product concepts were designed for the Midnight privacy network:

### Concept 1: AegisBid (Sealed-Bid Procurement & Liquidation Engine) — **SELECTED**
- **Category:** Sealed-Bid Auction / Procurement
- **One-sentence pitch:** A zero-knowledge sealed-bid procurement engine where bidders prove eligibility and reserve-price compliance without disclosing their exact valuations or bidding strategies.
- **Target users:** Government & defense procurement agencies, institutional liquidation desks, OTC token block traders.
- **Real-world problem:** In public smart contract auctions, bids are transparent, enabling front-running, bid sniping, and value extraction. In centralized sealed-bid auctions, the auctioneer can cheat or leak bids to favored participants.
- **What remains private:** Exact bid amount, bidder secret identity, random salt entropy.
- **What becomes public:** 32-byte bid commitment hash, 32-byte anti-replay nullifier, reserve compliance predicate.
- **Why Midnight is essential:** Midnight executes zero-knowledge SNARK circuits on private witnesses, enforcing business rules on-chain without exposing the data.
- **What Gemini contributes:** Analyzes natural language procurement RFQs and formulates a structured zero-knowledge proof plan without receiving confidential data.
- **Design direction:** Swiss Information Design & Neo-Industrial Financial Terminal.

### Concept 2: CivicPulse (Confidential Whistleblower & Tenancy Governance)
- **Category:** Anonymous Feedback / Survey
- **One-sentence pitch:** Zero-knowledge whistleblower sentiment protocol where organization members prove valid tenancy and credential tier above a required threshold without exposing their personal identity.
- **Target users:** Corporate audit committees, DAO contributors, whistleblower protection networks.
- **Why not selected:** Lower commercial velocity and less quantifiable one-minute demonstration compared to sealed-bid procurement.

### Concept 3: EquiSplit (Private Milestone Compensation Gate)
- **Category:** Private Payroll / Splits
- **One-sentence pitch:** Milestone bonus distribution protocol where contributors prove qualification for pooled incentive tiers without revealing individual compensation figures.
- **Target users:** Distributed developer guilds, venture contributors.
- **Why not selected:** Harder to verify external business milestones within a standalone privacy circuit without external oracles.

---

## 2. Selection Rationale

**AegisBid was selected as the strongest concept because:**
1. **Midnight privacy is essential:** Public blockchains inherently fail at sealed-bid procurement due to transparency. Midnight's ZK execution is fundamentally required.
2. **Selective disclosure creates immediate value:** The verifier receives mathematical certainty that a bid exceeds the reserve price, while losing bidders never expose their valuations.
3. **60-Second Demo:** In one minute, a judge can inspect an RFQ, generate a proof, verify that the commitment is recorded on Midnight, and inspect the resulting cryptographic receipt.
4. **Complete Implementation:** Features a 5-circuit Compact contract, FastAPI backend with Neon schema & Gemini proof planner, 1AM wallet discovery, and 35+ automated tests.
