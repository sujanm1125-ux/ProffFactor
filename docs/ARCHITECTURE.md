# AegisBid: System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        AEGISBID ARCHITECTURE                           │
└────────────────────────────────────────────────────────────────────────┘

  [ Client Browser Vault ]                     [ Server-Side (FastAPI) ]
  ┌─────────────────────────┐                  ┌────────────────────────┐
  │ Local Secrets & Salts   │                  │  FastAPI REST API      │
  │ WebCrypto Keygen        │                  │  ├─ Health / Diagnostic│
  │ Private Bid Valuations  │                  │  ├─ Aggregate Metrics  │
  └───────────┬─────────────┘                  │  ├─ Proof Receipts     │
              │ (Zero confidential data)       │  └─ Gemini Assistant   │
              │                                └───────────┬────────────┘
              ▼                                            │
  ┌─────────────────────────┐                              ▼
  │ Compact Runtime (ZK IR) │                  ┌────────────────────────┐
  │ ├─ submitSealedBid      │                  │  Neon Postgres DB      │
  │ ├─ createAuction        │                  │  ├─ Public Auctions    │
  │ └─ revealAndSettle      │                  │  ├─ Public Receipts    │
  └───────────┬─────────────┘                  │  └─ Aggregate Stats    │
              │                                └────────────────────────┘
              │ (32-byte Commitment + Nullifier)
              ▼
  ┌─────────────────────────┐                  ┌────────────────────────┐
  │ Midnight Network        │ ◄─────────────── │ Midnight Proof Server  │
  │ (Preprod / Preview)     │   ZK Prover      │ (Docker 8.1.0)         │
  └─────────────────────────┘                  └────────────────────────┘
```

## Architectural Components

1. **Compact 0.31.1 Smart Contract (`contract/src/aegisbid.compact`):**
   - 5 circuits: `createAuction`, `submitSealedBid`, `closeBidding`, `revealAndSettle`, `cancelAuction`.
   - In-memory simulator and compiled ZK-IR with proving keys (`keys/submitSealedBid.prover`).

2. **React + TypeScript Frontend (`app/`):**
   - Swiss Information Design with Framer Motion.
   - Discovers `window.midnight` with 1AM priority and local sandbox fallback.
   - Client-side cryptographic state manager for ephemeral bidder secrets.

3. **FastAPI Backend (`backend/`):**
   - Python 3.12+ async architecture with SQLAlchemy & Alembic.
   - Neon Postgres branch-first workflow (direct URL for migrations, pooled URL for API) with SQLite dev fallback.
   - Gemini GenAI integration with active secret redaction and deterministic fallback.
