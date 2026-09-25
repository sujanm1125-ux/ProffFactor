# ProofFactor Architecture

## Components

1. The React/Vite application presents role-specific workflows and discovers injected Midnight wallets.
2. The Compact contract enforces authorization, invoice lifecycle, policy eligibility, and nullifier consumption.
3. Generated contract bindings, ZK IR, prover keys, and verifier keys live under `contract/src/managed/prooffactor`.
4. A local proof server generates proofs for live transactions.
5. Midnight Preprod provides the node and indexer used after deployment.

## Lifecycle

```text
Supplier commits private invoice
        |
        v
Proposed --buyer accepts--> Accepted
   |                           |
   +--buyer rejects--> Rejected|
                               v
                    supplier proves policy
                               |
                               v
                      PendingFinancing
                        |          |
             lender confirms    lender declines
                        |          |
                        v          v
               FinancedConfirmed Accepted
                        |
                  buyer marks paid
                        |
                        v
                       Paid
```

An expired pending request can be released back to `Accepted` by any caller after the policy deadline. This prevents a lender from holding an invoice indefinitely.

## Authentication

The contract never trusts a caller-supplied public key as proof of authority. Admin, buyer, and lender identities are domain-separated hashes derived from private witness secrets. Circuits compare the derived identity with the appropriate public ledger record.

Supplier control is represented by a key derived from the invoice commitment and a private supplier-control secret. A financing request must open both the invoice commitment and that control key.

## Double-financing control

The buyer supplies a canonical invoice reference and nonce at acceptance. Their derived stable nullifier is stored with the invoice. Confirmation consumes that nullifier. Recommitting the same canonical invoice with a different salt changes its commitment but not its nullifier, so a later financing request is rejected.

The nullifier is consumed at lender confirmation, not request time, so a declined or expired request can be retried.

## Transport status

The frontend currently uses a deterministic local state machine for the judgeable demo. Wallet discovery is implemented, but Midnight.js deployment and transaction submission remain a release step requiring a funded user wallet and live Preprod access. The interface never labels demo actions as on-chain.
