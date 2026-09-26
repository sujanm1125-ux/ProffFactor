# AegisBid: Cryptographic Privacy Model

## 1. Information Observation Matrix

| Observer Entity | What They CAN Learn | What They CANNOT Learn |
|---|---|---|
| **Public Observer / Explorer** | 32-byte commitment hash, 32-byte nullifier, auction ID, block timestamp, reserve compliance boolean (`true`) | Exact bid amount, bidder secret identity, random salt, losing bidder valuations |
| **Auction Seller / Verifier** | Mathematical proof that submitted bids satisfy the reserve price, total bids count, winning bid after settlement | Non-winning bid amounts, bidder financial reserves, unselected strategies |
| **Gemini AI Assistant** | Public RFP description, category, minimum reserve price threshold | Private witnesses, holder secrets, seed phrases, wallet addresses, raw bids |
| **Central Database (Neon/SQLite)** | Public auction metadata, finalized transaction IDs, public proof receipts | Confidential witness parameters, user private keys, unshielded values |
| **Local Client Device** | Everything (private witness, secret key, salt, exact bid, generated proof) | Other participants' private witnesses |

---

## 2. Deliberate Disclosure Analysis

In the Compact smart contract (`contract/src/aegisbid.compact`), `disclose()` is used strictly with documented cryptographic justification:

1. `disclose(deriveUserIdentity(sellerSecret))`:
   - *Justification:* Establishes the public identity of the auction creator so bidders know who created the tender.
2. `disclose(nullifier)`:
   - *Justification:* Nullifiers must be recorded in the public ledger's `spentNullifiers` set to prevent replay attacks and double-bidding by the same secret identity.
3. `disclose(commitment)`:
   - *Justification:* The 32-byte persistent hash is recorded in `bidCommitments` to anchor the bid on-chain without revealing the bid amount.
4. `disclose(witnessData.amount)` and `disclose(bidderIdentity)` during `revealAndSettle`:
   - *Justification:* Only executed when settling the auction to publicly announce the winning price and award recipient. All losing bids remain confidential forever.

---

## 3. Gemini Privacy Boundary

The backend service (`backend/src/gemini_service.py`) enforces strict zero-knowledge isolation:
1. **Server-side only:** The `GEMINI_API_KEY` is never transmitted to the frontend.
2. **Regex Redaction:** Active sanitization scrubs 64-character hex tokens, secret clauses (`seed:`, `private:`), and confidential valuation tokens before calling the API.
3. **Structured Pydantic Validation:** The AI output is parsed into strict schemas with zero acceptance of private witness fields.
4. **Deterministic Fallback:** If Gemini is unreachable or unconfigured, an offline proof-planning engine generates the exact schema deterministically.
