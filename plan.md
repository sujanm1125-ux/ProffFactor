# ProofFactor Project Plan

> Finance the invoice, not the company's secrets.

Last updated: 2026-09-25 (interactive MVP, compiled contract, tests, documentation, and CI scaffold completed)  
Project status: Local MVP verified; live wallet transactions, proof-server engine validation, Preprod deployment, and signed-in Rise In criteria remain open  
Target platform: Midnight Network  
Working directory: `D:\MidnightMoon`

## 1. Purpose of This Document

This is the living source of truth for ProofFactor. It records the product decision, scope, privacy boundary, contract invariants, technical architecture, competition requirements, milestones, risks, testing plan, and current progress.

Update this file whenever:

- A product or architecture decision changes.
- A milestone begins or is completed.
- A Rise In requirement is confirmed.
- A new risk or blocker is discovered.
- A contract circuit, public field, or private field changes.
- A deployment address, transaction ID, demo link, or submission artifact is created.

Do not silently change the privacy model. Any change that discloses additional information must be recorded in the Decision Log.

## 2. Project Summary

### Name

**ProofFactor**

### Tagline

**Finance the invoice, not the company's secrets.**

### One-sentence pitch

ProofFactor lets a supplier prove that an invoice is authentic, accepted by its buyer, unpaid, unexpired, within a lender's permitted funding range, and not previously financed without revealing the invoice amount, customer relationship, line items, prices, or commercial margins.

### Product category

- Primary: Smart Compliance
- Secondary: Privacy-Enhancing Technology
- Official Midnight use case alignment: Private B2B Invoice Verifier

### Core differentiation

ProofFactor is not a private allowlist or a generic eligibility credential. It is a multi-party invoice lifecycle with role authorization, private predicates, public commitments, state transitions, and anti-double-financing protection.

## 3. Problem Statement

Small and medium-sized businesses often finance unpaid invoices to obtain working capital. A lender needs evidence that an invoice:

- Exists and has not been altered.
- Was acknowledged by the buyer.
- Is still unpaid.
- Has not expired.
- Falls within the lender's financing policy.
- Has not already been financed elsewhere in the system.

Traditional verification requires sharing the complete invoice and related business records. Those documents expose sensitive commercial information, including customer identities, supplier networks, prices, products, volumes, payment terms, and margins.

ProofFactor uses Midnight's public/private state model and zero-knowledge proofs to verify the required facts while keeping the underlying invoice private.

## 4. Goals and Non-goals

### MVP goals

- Create a deterministic commitment to private invoice data.
- Allow an authorized buyer to accept or reject an invoice commitment.
- Prove that the private invoice opens the registered commitment.
- Prove that the exact amount is within a lender-defined range without revealing it.
- Prove that the invoice is unexpired and unpaid.
- Prevent concurrent financing requests and prevent a confirmed invoice from being financed more than once inside ProofFactor.
- Allow the authorized buyer to record payment.
- Provide a clear supplier, buyer, lender, and public-explorer experience.
- Deploy a working contract and frontend to the competition-required Midnight environment.
- Include automated contract, integration, and UI tests.
- Maintain reproducible setup, deployment, and demo documentation.

### Non-goals for the first MVP

- Sending or custodying real fiat loan funds.
- Acting as a licensed lender or financial adviser.
- Determining creditworthiness.
- Enforcing invoice payment in law.
- Integrating with real banks, accounting systems, or tax authorities.
- Supporting every invoice format or jurisdiction.
- Cross-chain settlement.
- AI underwriting or autonomous lending.
- Hiding information from an intentionally selected auditor after explicit user disclosure.

## 5. Actors and Permissions

### Supplier

- Creates and privately stores invoice data.
- Computes the invoice commitment.
- Registers or proposes an invoice commitment.
- Requests buyer acknowledgement.
- Generates a private financing-eligibility proof.
- Requests that a verified invoice be locked for financing.

### Buyer

- Reviews the real invoice through an off-chain business process.
- Accepts or rejects the matching on-chain commitment.
- Marks an accepted invoice as paid.
- Cannot read private invoice data from Midnight unless the supplier shares it separately.

### Lender

- Defines or selects a funding policy.
- Receives only an on-chain pending request created by a successful proof.
- Confirms or declines that request without receiving the private invoice.
- Understands that confirmation is an attestation in the MVP, not an on-chain transfer of loan funds.
- Learns only the facts explicitly disclosed by the proof.

### Contract administrator

- Manages supported policy versions and emergency controls if required.
- Cannot edit private invoice contents.
- Must not be able to fabricate buyer acceptance or reset financed invoices.

### Public observer

- Can see commitments, lifecycle states, timestamps, policy identifiers, and aggregate statistics.
- Cannot reconstruct the invoice or identify its parties from the commitment alone.

## 6. Primary User Journey

1. The supplier enters invoice data locally.
2. The application generates a random secret and an invoice commitment.
3. The supplier registers the commitment on Midnight.
4. The buyer reviews the original invoice off-chain.
5. The authorized buyer accepts the registered commitment.
6. A lender publishes a versioned financing policy.
7. The supplier generates a proof against that policy that the private invoice:
   - Matches the registered commitment.
   - Was accepted by the buyer.
   - Is unpaid.
   - Has not expired.
   - Falls within the lender's amount range.
   - Has not already been financed.
8. The proof and a pending-financing lock are applied atomically, preventing a second concurrent request.
9. The selected lender confirms or declines the locked request without receiving the private invoice.
10. Confirmation consumes the stable nullifier and records `FINANCED_CONFIRMED`. It is a lender attestation, not proof that the MVP transferred money.
11. Any later financing attempt is rejected.
12. After the underlying invoice is settled, the buyer marks the commitment as paid.

### Off-chain opening and acknowledgement handoff

Midnight proves statements about private inputs, but it does not by itself deliver the original invoice from supplier to buyer. Buyer acknowledgement therefore requires an explicit off-chain handoff:

1. The supplier sends the real invoice through the parties' existing secure business channel.
2. The supplier also provides a canonical verification package containing the encoded invoice fields and commitment salt.
3. The buyer's ProofFactor client recomputes the commitment locally and requires an exact match with the registered value.
4. Only after the match does the buyer accept on-chain and generate the buyer-controlled nonce/nullifier binding.
5. The buyer returns the acceptance opening needed by the supplier through the same secure channel so the supplier can prove against the accepted nullifier.

For the competition, this handoff uses synthetic data and may be demonstrated with local import/export. ProofFactor must not introduce a backend relay that silently receives the raw invoice. A production handoff would require authenticated encryption and organizational integration, which is outside the first MVP.

### Buyer acceptance is the invoice attestation

Private witness values are supplied by the prover and are not trustworthy merely because they are hidden inside a zero-knowledge proof. ProofFactor therefore treats the authenticated buyer's on-chain acceptance as the authoritative MVP attestation that the buyer reviewed an invoice whose canonical fields match the registered commitment.

- The buyer client recomputes the invoice commitment locally before it allows acceptance.
- The authorized `acceptInvoice` circuit records the accepted commitment, buyer identity, schema/domain version, and buyer-issued nullifier binding.
- `requestFinancing` must prove that its private invoice fields recompute to that exact accepted commitment and nullifier; a supplier-provided `accepted` flag is never evidence.
- A separate buyer signature is not required for the first MVP because the authenticated on-chain acceptance is the attestation. If a later design permits offline acceptance, the buyer must sign a domain-separated message binding the commitment, nullifier, buyer identity, network/contract, schema version, and expiry, and the circuit must verify that signature.

This proves that an authorized buyer acknowledged the committed invoice claim. It still does not prove delivery of goods, legal enforceability, or absence of buyer-supplier collusion.

## 7. Data and Privacy Model

### Private data

- Invoice number.
- Supplier identifier.
- Buyer identifier, unless explicitly public by product decision.
- Exact invoice amount.
- Currency where disclosure is unnecessary.
- Issue date and due date where exact dates are unnecessary.
- Line items, quantities, and unit prices.
- Tax information.
- Payment instructions and bank information.
- Commercial margins.
- Original invoice document.
- Commitment salt/secret.
- Private witness state.

### Public data

- Invoice commitment.
- Lifecycle state: proposed, accepted, rejected, pending financing, financing confirmed, paid, cancelled, or expired as implemented.
- Policy identifier or policy commitment.
- Selected lender and request deadline while a financing request is pending.
- Proof verification result represented by the valid state transition.
- Registration, acceptance, financing, and payment timestamps where required.
- Aggregate counts that do not expose private commercial values.
- Contract version and network deployment information.

### Selectively disclosed facts

- The invoice amount is within an approved range.
- The invoice due date satisfies a policy window.
- The invoice was accepted by an authorized buyer.
- The invoice is currently unpaid.
- The invoice has not been financed previously.
- The invoice data matches the original registered commitment.

### Initial commitment design

Conceptual structure:

```text
invoiceCommitment = hash(
  domainSeparator,
  contractOrNetworkId,
  invoiceNumber,
  supplierId,
  buyerId,
  amount,
  currency,
  issueDate,
  dueDate,
  lineItemsHash,
  salt
)
```

The final field encoding and hash primitive must be chosen only after checking the installed Compact compiler and standard library. The domain separator must prevent reuse across applications or networks.

### Stable invoice nullifier

A salted commitment alone is not sufficient to prevent double financing. A dishonest supplier could create a second commitment for the same invoice with a different salt. ProofFactor therefore needs two distinct values with different domain separators:

1. **Private-data commitment** — binds all private invoice fields and a high-entropy supplier salt.
2. **Stable invoice nullifier** — a buyer-issued, one-time identifier for the accepted receivable, derived from a buyer-controlled random nonce and canonical invoice reference.
3. **Per-invoice supplier control key** — a one-time public identity derived from a supplier-only control secret, preventing the buyer or a copied verification package from requesting financing.

Conceptually:

```text
invoiceCommitment = persistentHash("prooffactor:invoice:v1", encodedInvoice, supplierSalt)

invoiceNullifier = persistentHash(
  "prooffactor:nullifier:v1",
  buyerIdentity,
  canonicalInvoiceReference,
  buyerIssuedNonce
)

supplierControlKey = persistentHash(
  "prooffactor:supplier-control:v1",
  invoiceCommitment,
  supplierControlSecret
)
```

The supplier control secret is never included in the buyer verification package. The buyer must refuse to issue more than one active nullifier for the same invoice in its source system. `requestFinancing` re-derives the supplier control key and atomically locks the invoice in a pending state; the selected lender later consumes the stable nullifier atomically when confirming financing. Commitment, nullifier, role identity, and supplier-control domain separators must all differ.

This prevents repeat financing inside the ProofFactor registry. It cannot prove that the invoice was not financed in an unrelated external system; that limitation must appear in the UI and pitch.

### Metadata leakage budget

Zero-knowledge proofs hide witness values, not all transaction metadata. A chain observer can still see:

- The contract and exported circuit being called.
- Transaction timing.
- Public circuit arguments and returns.
- Keys and values used in public `Map`, `Set`, and `Counter` operations.
- The public lifecycle transition and any disclosed value.

The design must minimize public identifiers, avoid public company names, avoid exposing amount buckets unless the lender needs them, and never claim transaction-level anonymity. A later privacy review must document possible timing correlation between supplier, buyer, and lender actions.

### Canonical MVP data model

All encodings must be fixed-width or length-prefixed and documented so different clients cannot hash ambiguous representations. JSON stringification is not a consensus encoding.

#### Private invoice preimage

| Field | Conceptual representation | Validation |
|---|---|---|
| Schema version | Small unsigned integer | Must equal supported version |
| Invoice reference | Fixed 32-byte normalized hash | Non-zero; domain-separated source normalization |
| Supplier private identifier | 32 bytes | Non-zero commitment/identifier |
| Buyer private identifier | 32 bytes | Must correspond to intended buyer route/attestation |
| Amount | Unsigned 64-bit integer in minor currency units | Greater than zero; no floating-point values |
| Currency | Fixed numeric/byte code | Must equal the selected policy currency |
| Issue time | Unsigned 64-bit Unix seconds | Within documented bounds |
| Due time | Unsigned 64-bit Unix seconds | Greater than issue time |
| Line-items digest | 32 bytes | Hash of canonical local line-item representation |
| Supplier salt | 32 cryptographically random bytes | Generated with a secure random source |

#### Public lender policy

| Field | Purpose |
|---|---|
| Policy ID and version | Immutable lookup key |
| Lender derived identity | Authorizes confirmation/decline |
| Currency code | Prevents cross-currency range comparisons |
| Minimum amount | Inclusive integer minor-unit lower bound |
| Maximum amount | Inclusive integer minor-unit upper bound |
| Maximum remaining term | Bounds acceptable due date |
| Request timeout/deadline | Releases abandoned pending locks |
| Active/revoked flag | Stops new requests without mutating historical proofs |

The public amount bounds reveal the lender's product policy but never the invoice amount. If later requirements demand private policy bounds, that is a separate protocol revision and must not be improvised inside the MVP.

## 8. Trust Assumptions

- Midnight correctly verifies proofs produced for the deployed contract.
- A buyer only accepts a commitment after reviewing the matching invoice off-chain.
- Authorization keys are controlled by their intended organizations.
- Private state remains on the user's device or approved wallet/provider.
- A commitment hides its contents because it includes sufficient random salt and uses an approved hash primitive.
- ProofFactor proves facts about recorded invoice claims; it does not independently prove that physical goods were delivered.
- The MVP uses demo organizations and test data and must not be represented as production-ready financial infrastructure.
- Role authentication is based on knowledge of domain-separated secret keys or verified attestations, not on an unconstrained frontend claim or `ownPublicKey()` witness.
- The buyer is responsible for issuing only one canonical nullifier for a real invoice. Buyer/supplier collusion remains outside the MVP guarantee.
- Any proof service that receives witness inputs is part of the privacy trust boundary. The chosen wallet/prover configuration must be documented before real use.

## 9. Threat Model

### Threats the MVP must address

- Supplier changes invoice data after buyer acceptance.
- Supplier invents buyer acceptance.
- Unauthorized account accepts or pays an invoice.
- Supplier finances the same invoice more than once.
- A paid, rejected, cancelled, or expired invoice is financed.
- A proof uses private data that does not match the registered commitment.
- Commitment is replayed across networks or contracts.
- The same invoice is recommitted using a different salt.
- Low-entropy invoice data is guessed from a public commitment.
- Administrator rewrites lifecycle history.
- Frontend logs or transmits private invoice fields accidentally.
- Private data is included in analytics, error reporting, or AI requests.
- Generated proof artifacts do not match the deployed contract.
- A separate proof-then-lock flow is front-run or becomes stale before financing.
- A malicious prover supplies forged witness values or a forged caller identity.
- Public transaction timing and circuit names correlate the participating companies.

### Threats documented but outside MVP guarantees

- Buyer and supplier collude to create a fraudulent invoice.
- A legal entity's signing key is stolen.
- The off-chain invoice document contains malware.
- A user loses local private state or the commitment secret.
- Financing occurs outside ProofFactor and is not registered on-chain.
- Legal disputes over delivery, quality, or contract performance.
- A buyer and supplier collude to obtain financing for a fabricated invoice.

## 10. Contract Design

The names below are conceptual. Exact Compact syntax will be finalized after toolchain validation.

### Public ledger state

Potential structures:

- Contract owner or maintenance authority.
- Authorized buyer registry or buyer public keys.
- Invoice commitment to lifecycle-state mapping.
- Invoice commitment to policy identifier mapping where needed.
- Set of consumed stable invoice nullifiers.
- Pending request fields: selected lender identity, policy identifier, and request-expiry deadline.
- Aggregate counters.
- Pause or version state if supported and justified.
- Domain/version identifier used by commitment and nullifier derivations.

### Private state

- Invoice opening fields.
- Commitment salt.
- Buyer-issued canonical invoice reference and nonce/nullifier opening.
- Per-invoice supplier control secret.
- Locally stored supplier records.
- Any proof inputs that must never reach the ledger.

### Proposed circuits

#### `registerBuyer`

- Restricted administrative operation authenticated by a domain-separated secret-derived identity or reviewed access-control module.
- Adds, rotates, revokes, or activates an authorized buyer identity through explicit circuits.

#### `registerInvoiceCommitment`

- Registers a new commitment.
- Rejects zero/invalid commitments.
- Rejects duplicate registration.
- Initializes the lifecycle to proposed.
- Stores a one-time supplier control key derived from a supplier-only secret.
- Associates only the minimum public routing data needed for the correct buyer to respond.

#### `acceptInvoice`

- Requires the authorized buyer.
- Only transitions proposed to accepted.
- Registers the buyer-issued stable invoice nullifier or its commitment.
- Binds acceptance to the invoice commitment and buyer identity.

#### `rejectInvoice`

- Requires the authorized buyer.
- Only transitions proposed to rejected.

#### `registerPolicy`

- Requires an authenticated lender identity.
- Stores a versioned public policy containing lender identity, currency code, minimum and maximum amount in integer minor units, permitted due-date window, request-expiry duration, and active/revoked status.
- Validates `minimum <= maximum`, supported currency, sensible non-zero bounds, and deadline limits.
- Treats a used policy as immutable; policy changes create a new version.

#### `requestFinancing`

Proof verification and the pending lock must be one atomic circuit call. A separate eligibility-proof transaction followed by a lock would create a time-of-check/time-of-use race.

- Reads private invoice fields and nullifier opening from witnesses or private circuit arguments.
- Recomputes and checks the registered invoice commitment.
- Recomputes the stable nullifier and checks that it matches buyer acceptance.
- Re-derives and verifies the per-invoice supplier control key, preventing the buyer or another holder of the verification package from requesting financing.
- Requires the invoice lifecycle to be accepted with no active request.
- Checks the private amount against the selected policy bounds.
- Checks the committed currency matches the policy currency.
- Uses Compact block-time predicates to check invoice and request deadlines; it does not trust a browser clock or raw caller-supplied current time.
- Checks that the stable nullifier has not been consumed.
- Stores the selected lender/policy and transitions to `PENDING_FINANCING` in the same transaction.
- Does not return or write private invoice fields.

The frontend may run a local preflight for UX, but the preflight is advisory and never replaces this atomic circuit.

#### `confirmFinancing`

- Requires the lender identity that owns the pending policy.
- Requires an unexpired `PENDING_FINANCING` state.
- Rechecks that the stable nullifier remains unused.
- Consumes the nullifier and transitions to `FINANCED_CONFIRMED` atomically.
- Records a lender confirmation only; it does not claim or prove that fiat or tokens were transferred.

#### `declineFinancing`

- Requires the selected lender, or an explicitly tested timeout path.
- Returns an unconfirmed pending request to `ACCEPTED` without consuming the stable nullifier.
- Clears the pending lender/policy fields.
- Cannot reopen an already confirmed financing.

#### `markInvoicePaid`

- Requires the authorized buyer.
- Transitions an accepted or financing-confirmed invoice to paid according to the finalized state machine.

#### `cancelExpiredInvoice`

- Applies explicit authorization and Compact block-time predicates.
- Must not enable resetting a financed invoice for reuse.

### Mandatory invariants

- A commitment is registered at most once.
- Invoice contents cannot change without changing the commitment.
- Only the correct authorized buyer can accept, reject, or mark the invoice paid.
- Privileged identity checks are derived from secrets or verified signatures; they never trust `ownPublicKey()` as authentication.
- Only the holder of the per-invoice supplier control secret can create a financing request for that commitment.
- Only an accepted invoice can become finance-eligible.
- A rejected, paid, cancelled, or expired invoice cannot be newly financed.
- A stable invoice nullifier can be consumed at most once.
- Eligibility verification and the pending request lock occur atomically.
- Only the selected lender can confirm or decline its pending request.
- Lender confirmation and nullifier consumption occur atomically.
- Declining or expiring an unconfirmed request may reopen the invoice but cannot replace its stable nullifier.
- Financing cannot be reset by an administrator.
- The private amount and dates used in a proof must be bound to the accepted commitment.
- A policy result is computed in the circuit and is never trusted as a caller-provided boolean.
- No raw invoice field is disclosed unless explicitly approved and documented.
- All integer inputs have explicit non-zero, range, and boundary assertions.
- All commitment, identity, and nullifier hashes use distinct domain separators and a documented encoding.
- Deadlines use protocol block-time predicates and are treated as block-scale, not second-precise.
- Every key-rotation or revocation path preserves already-consumed nullifiers and invoice history.

## 11. Lifecycle State Machine

Initial proposed state model:

```text
PROPOSED --buyer accepts--> ACCEPTED
PROPOSED --buyer rejects--> REJECTED

ACCEPTED --valid private proof + atomic lock--> PENDING_FINANCING
ACCEPTED --buyer records settlement--> PAID
ACCEPTED --valid cancellation/expiry rule--> CANCELLED_OR_EXPIRED

PENDING_FINANCING --selected lender confirms--> FINANCED_CONFIRMED
PENDING_FINANCING --selected lender declines--> ACCEPTED
PENDING_FINANCING --request times out--> ACCEPTED

FINANCED_CONFIRMED --buyer records invoice settlement--> PAID
```

The finalized implementation must use explicit transition checks rather than relying only on frontend logic.

## 12. Application Architecture

### Planned components

```text
proof-factor/
  app/ or src/
    supplier/
    buyer/
    lender/
    explorer/
    components/
    services/
  contract/
    src/
      proof-factor.compact
    witnesses/
    tests/
  generated/ or managed/
    contract bindings
    proving and verification artifacts
  public/
    required browser proof assets
  tests/
    integration/
    ui/
  docs/
    architecture.md
    privacy-model.md
    threat-model.md
    deployment.md
    demo-script.md
    user-testing.md
  .github/workflows/
  README.md
  plan.md
```

The actual structure may change to match the selected official Midnight starter and SDK version.

### Technology assumptions to validate

- TypeScript frontend using React and Vite unless the approved starter requires otherwise.
- Compact smart contract. The official Preprod compatibility matrix checked on 2026-09-25 pins Compact devtools `0.5.1`, compiler `0.31.1`, Compact runtime `0.16.0`, Compact JS `2.5.1`, Platform JS `2.2.4`, on-chain runtime `3.0.0`, Midnight.js `4.1.1`, DApp Connector API `4.0.1`, and proof server `8.1.0`. These exact versions are recorded in `VERSIONS.md` and must be re-checked before deployment.
- Midnight.js providers with exact compatible versions.
- DApp Connector API wallet integration. The public Rise In Level 2 requirement names Lace on Preprod; the implementation should still enumerate injected wallets and let the user choose when multiple compatible wallets are present rather than hard-coding a UUID or silently selecting the first.
- Preview/Preprod first; Mainnet only when the applicable level requires it.
- Node.js, proof service, indexer, ledger/runtime packages, wallet connector, and compiler versions aligned through the official compatibility matrix.
- Exact dependency versions without `^` or `~`, a committed lockfile, `npm ci`, and a root `VERSIONS.md` recording the verified matrix.
- Windows development must follow the official WSL guidance for the Compact toolchain. Before scaffolding, record whether the canonical checkout can compile reliably from the workspace path or whether an approved native-WSL workflow is required.
- CI using GitHub Actions.

### Authentication design rule

Midnight's security guidance treats the prover as malicious: witness values, including `ownPublicKey()`, can be chosen by the caller. ProofFactor will derive role identities from private secrets using domain-separated hashes, or verify a supported signature/attestation inside the circuit. Copying a public identity into forged private state must not pass authorization tests.

### Time design rule

Compact exposes block-time predicates such as `blockTimeLt`, `blockTimeLte`, `blockTimeGt`, and `blockTimeGte`; it does not expose raw block time. Invoice expiry and financing deadlines must use those predicates against committed/public cutoff values. Browser time is display-only and cannot authorize a transition.

### Private-data storage rule

- Synthetic invoice data may be held in memory for the competition demo.
- Raw invoices, salts, organization secrets, and witness state must not be written to logs, analytics, crash reports, URLs, or unencrypted application storage.
- If persistence is required, use the selected Midnight private-state provider and document its backup/recovery behavior. Any optional export must be encrypted and explicitly initiated by the user.
- Never bundle shared production role secrets in frontend assets or the repository. Demo secrets must be clearly synthetic and isolated from deployed administrative identities.

### Proving boundary rule

Before deployment, document whether proofs are generated locally, by the wallet's configured/delegated provider, or by a remote proof service. If private witnesses leave the user's device for proving, the UI and privacy documentation must say so plainly. The app must not claim that data "never leaves the device" unless verified for the actual configuration.

Do not copy VeilPass application code or reuse its contract. Official Midnight examples may be used as documented integration references, with attribution where required.

## 13. UX Plan

### Supplier dashboard

- Create a demo invoice locally.
- Explain which information remains private.
- Generate and register its commitment.
- Track buyer acknowledgement.
- Select a lender policy.
- Generate a financing proof and create a locked pending request.
- Track pending, lender-confirmed, declined, and paid states.

### Buyer portal

- View pending commitments associated with the demo buyer.
- Compare a commitment with locally supplied invoice data.
- Accept or reject the commitment.
- Mark an accepted or financing-confirmed invoice paid.

### Lender console

- Create or select a policy.
- Set amount range, currency, due-date window, and request timeout.
- Review proof-verified pending requests without seeing invoice fields.
- Confirm or decline a pending request.
- Receive clear failure reasons without exposing private values.

### Public explorer

- Show lifecycle events by commitment.
- Show aggregate accepted, pending, financing-confirmed, and paid counts.
- Explain what observers can and cannot learn.
- Never display mock private fields as if they came from the chain.

### UX principles

- Clearly label local/private, selectively disclosed, and public/on-chain information.
- Show the user exactly what will become public before submitting a transaction.
- Separate proof generation, wallet approval, transaction submission, and finalization states.
- Provide actionable errors for wrong network, missing wallet, missing funds, proof failure, and stale state.
- Keep an explorable demo mode, but never imply simulated actions are real chain transactions.

## 14. Testing Strategy

### Contract unit tests

- Register a unique invoice successfully.
- Reject a duplicate commitment.
- Reject reuse of a stable invoice nullifier even when the attacker changes the commitment salt.
- Authorized buyer accepts a proposed invoice.
- Unauthorized actor cannot accept it.
- A supplier-provided boolean or fabricated private witness cannot substitute for an authenticated buyer acceptance ledger entry.
- Forging an `ownPublicKey()` or copying a public role identity into private state does not bypass authorization.
- Buyer or verification-package holder cannot request financing without the supplier's per-invoice control secret.
- Rejected invoice cannot be financed.
- Altered private invoice fields fail the commitment check.
- Amount below policy minimum fails.
- Amount above policy maximum fails.
- Amount at both boundaries behaves as specified.
- Expired invoice fails.
- Browser-supplied time cannot override the block-time predicate.
- Unpaid accepted invoice succeeds.
- A valid request moves the invoice to pending and blocks a concurrent request.
- Only the selected lender can confirm or decline the pending request.
- A declined or timed-out request returns to accepted without consuming the nullifier.
- Lender confirmation consumes the nullifier exactly once.
- A second confirmed-financing attempt fails.
- Concurrent or stale confirmations cannot both consume the same nullifier.
- Paid invoice cannot be newly financed.
- Unauthorized actor cannot mark paid.
- Invalid state transitions fail.
- Cross-contract/network replay is prevented by domain separation where implemented.
- Identity, commitment, and nullifier domains produce distinct values for the same secret material.
- Different invoices use unlinkable supplier control keys even when controlled by the same supplier.
- Buyer/lender key rotation and revocation behave according to the finalized policy.

### Witness and privacy tests

- Witness inputs are not accidentally logged.
- Private values are never returned as public circuit outputs.
- Test fixtures use synthetic data only.
- Commitment recomputation is deterministic with the same inputs.
- Different salts produce different commitments for identical invoices.
- The stable buyer-issued nullifier remains consistent for the same canonical invoice and changes across domain/network versions as designed.
- No exported circuit returns a private invoice field.
- Public `Map`/`Set` keys are reviewed as intentionally visible metadata.
- Proof-service fixtures demonstrate exactly which private values cross the local process boundary.

### Frontend tests

- Every role can complete its intended happy path.
- Wallet/network errors are handled.
- Private fields are not rendered in the public explorer.
- Transaction progress and finality are visible.
- Demo mode is visually distinct from live mode.
- Keyboard navigation and essential accessibility labels work.
- Multiple injected wallets trigger an explicit wallet choice.
- Wallet names/icons are rendered safely and untrusted wallet metadata cannot inject markup.
- Private invoice data never appears in URLs, browser console output, analytics payloads, or public error messages.

### Integration tests

- Supplier registration through buyer acceptance.
- Accepted invoice through private eligibility proof, pending lock, and lender confirmation.
- Financing-confirmed invoice through buyer payment.
- State remains consistent after page reload/reconnection.
- Deployed artifacts match frontend configuration.

### CI quality gates

- Contract source validation/compilation.
- Type checking.
- Linting.
- Unit and integration tests.
- Production frontend build.
- Generated-artifact presence checks.
- Secret scanning or equivalent repository hygiene check where practical.
- Version-matrix verification and exact-version enforcement.
- A check that generated bindings/proving artifacts were produced from the committed Compact source.

## 15. Rise In Level Plan

The public requirements below are confirmed from the program page. Detailed signed-in acceptance criteria remain pending and must be added before submission.

### Level 1: New Moon — Setup and first contract

- [ ] Confirm current Compact compiler and SDK versions.
- [ ] Initialize repository and base project.
- [ ] Implement the smallest invoice commitment contract.
- [ ] Compile the Compact contract.
- [ ] Deploy to the required Preview/Preprod environment.
- [ ] Record contract address and deployment transaction.
- [ ] Document the initial idea and privacy boundary.

### Level 2: Waxing Crescent — Frontend integration

- [ ] Build the initial supplier and buyer interface.
- [ ] Integrate Lace on Preprod as stated by the public requirement; re-confirm the signed-in task and retain DApp Connector compatibility with other supported wallets.
- [ ] Register and query an invoice commitment.
- [ ] Accept an invoice through a live wallet transaction.
- [ ] Handle network and wallet errors.

### Level 3: First Quarter — Production-grade dApp

- [ ] Confirm ProofFactor against the provided problem list.
- [ ] Complete supplier, buyer, and lender roles.
- [ ] Implement authorization and state invariants.
- [ ] Add automated tests.
- [ ] Add CI/CD.
- [ ] Create reproducible local-development instructions.
- [ ] Add security, privacy, and architecture documentation.

### Idea Submission: The Turn

- [ ] Submit the approved title: ProofFactor.
- [ ] Submit problem category: Private B2B Invoice Verifier / Smart Compliance.
- [ ] Submit the one-sentence pitch and problem statement.
- [ ] Submit public/private data model.
- [ ] Submit MVP scope and technical approach.
- [ ] Record reviewer feedback and approval status here.
- [ ] Do not materially change the approved product without recording the reason.

### Level 4: Waxing Gibbous — Live MVP

- [ ] Deploy the complete MVP to Preprod.
- [ ] Publish the frontend.
- [ ] Publish documentation.
- [ ] Confirm CI/CD passes on the submitted commit.
- [ ] Create the public product/X profile if required.
- [ ] Record live demo, repository, video, contract, and transaction links.

### Level 5: Full Moon — Users and feedback

- [ ] Keep the same approved MVP and contract purpose.
- [ ] Create a guided test scenario for supplier, buyer, and lender roles.
- [ ] Establish a structured feedback form/process.
- [ ] Onboard 50 Preprod users if confirmed by the detailed requirement.
- [ ] Store non-sensitive evidence of completed test sessions.
- [ ] Summarize feedback themes.
- [ ] Implement and document selected improvements.

### Level 6: Supermoon — Mainnet launch

- [ ] Complete a deployment-readiness review.
- [ ] Resolve critical security and reliability findings.
- [ ] Deploy the approved version to Mainnet when required and safe.
- [ ] Record Mainnet contract and transaction details.
- [ ] Produce brand assets.
- [ ] Onboard 20 real users if confirmed by the detailed requirement.
- [ ] Publish the feedback-to-improvement report.

## 16. Competition Evidence Register

Fill this table as artifacts are produced.

| Artifact | Status | Link or value |
|---|---|---|
| Git repository | Pending | — |
| Product proposal | Pending | — |
| Privacy model | Planned in this file | — |
| Threat model | Planned in this file | — |
| Preview contract address | Pending | — |
| Preview deployment transaction | Pending | — |
| Preprod contract address | Pending | — |
| Preprod deployment transaction | Pending | — |
| Mainnet contract address | Not started | — |
| Live frontend | Pending | — |
| CI run | Pending | — |
| Test report | Pending | — |
| Demo video | Pending | — |
| Product/X profile | Pending | — |
| User feedback report | Pending | — |
| User onboarding evidence | Pending | — |

## 17. Milestones

### M0: Requirements and feasibility

- [x] Research public Rise In program structure.
- [x] Review VeilPass as a delivery reference.
- [x] Identify weaknesses in generic allowlist/eligibility designs.
- [x] Cross-check crowded Midnight project categories.
- [x] Select ProofFactor as the working concept.
- [x] Audit the design against current Midnight security, wallet, time, and compatibility guidance.
- [x] Correct the commitment/nullifier, authorization, attestation, and financing-state model.
- [ ] Obtain detailed signed-in Rise In task requirements.
- [ ] Confirm the exact permitted problem statement.
- [ ] Validate current Midnight toolchain on the development machine.

Validated so far: WSL2 Ubuntu 22.04, Compact devtools `0.5.1`, and compiler `0.31.1`. Docker Desktop/proof server verification remains open.

Exit condition: requirements matrix and toolchain versions are confirmed.

### M1: Contract proof of concept

- [ ] Initialize source control and project structure.
- [ ] Implement commitment registration.
- [ ] Implement authorized acceptance.
- [ ] Implement minimal eligibility proof.
- [ ] Implement atomic pending lock, lender confirmation, decline, and timeout behavior.
- [ ] Add invariant tests.

Exit condition: the complete lifecycle passes locally with synthetic data.

### M2: Connected application

- [ ] Implement wallet connection.
- [ ] Implement supplier flow.
- [ ] Implement buyer flow.
- [ ] Implement lender flow.
- [ ] Implement public explorer.

Exit condition: all roles complete the happy path using the same deployed contract.

### M3: Preprod MVP

- [ ] Deploy contract and proof artifacts.
- [ ] Deploy frontend.
- [ ] Complete integration tests.
- [ ] Complete documentation.
- [ ] Enable CI/CD.

Exit condition: a new tester can complete the demo from written instructions.

### M4: User validation

- [ ] Run structured tests with target participants.
- [ ] Track failures and feedback.
- [ ] Prioritize improvements.
- [ ] Release an updated MVP.

Exit condition: required user count and feedback evidence are complete.

### M5: Mainnet and submission

- [ ] Complete security checklist.
- [ ] Freeze the release candidate.
- [ ] Deploy according to the final competition requirement.
- [ ] Complete branding, pitch, demo video, and submission package.

Exit condition: all required evidence is recorded and independently verified.

## 18. Success Metrics

### Technical

- 100% of mandatory contract invariant tests pass.
- No known path finances one commitment twice.
- No raw private invoice fields appear in public ledger state or public UI.
- CI succeeds from a clean checkout.
- A live wallet completes the end-to-end Preprod flow.

### Product

- A first-time tester understands the value proposition in under one minute.
- A tester can distinguish private and public information before signing.
- The primary demo completes without developer intervention.
- Required user targets and feedback evidence are achieved.

### Competition

- Every detailed level requirement has a linked artifact.
- Contract address and transaction IDs are real and reproducible.
- The demo does not claim mock operations are live blockchain behavior.
- The final submission explains why Midnight is necessary.

## 19. Key Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Detailed Rise In task differs from public summary | High | Obtain screenshots/text before locking submission scope |
| Current Compact APIs differ from reference repositories | High | Validate compiler and official examples before contract design |
| Invoice authenticity depends on buyer honesty | Medium | State the trust assumption; require buyer authorization and acceptance |
| Double financing outside ProofFactor remains possible | Medium | Describe the guarantee as system-scoped, not universal |
| Private state loss prevents future proofs | High | Add backup/recovery guidance without exporting secrets insecurely |
| Commitment can be guessed from predictable data | High | Use strong random salt and domain separation |
| Same invoice is recommitted with a new salt | Critical | Use a buyer-issued stable nullifier and consume it atomically |
| Proof succeeds but request lock races or becomes stale | Critical | Combine verification and pending lock in one `requestFinancing` circuit; authorize confirmation separately |
| Prover forges witness identity or `ownPublicKey()` | Critical | Authenticate via secret-derived identity or in-circuit signature verification |
| Frontend leaks private fields | High | Keep processing local; prohibit analytics/logging of invoice contents |
| Remote proof provider observes private witnesses | High | Prefer verified local/wallet proving; document actual provider and obtain informed user choice |
| Public transaction timing links business participants | Medium | Minimize public identifiers, disclose metadata limits, and avoid anonymity claims |
| Proof generation is slow or unreliable | Medium | Measure early, show progress, minimize circuit scope |
| Wallet/network compatibility changes | High | Pin supported versions and document the tested environment |
| Version mismatch breaks compilation or proving | High | Use official compatibility matrix, exact versions, lockfile, `VERSIONS.md`, and CI checks |
| Secret or private-state loss blocks future actions | High | Define backup, recovery, and key-rotation procedures before Mainnet |
| User onboarding target is difficult | Medium | Build an easy role-based sandbox and start recruitment early |
| Financial wording creates regulatory confusion | Medium | Position MVP as verification infrastructure, not lending or advice |
| Scope expands into a full lending marketplace | High | Enforce MVP non-goals and milestone exit conditions |

## 20. Open Questions

- [ ] What exact problem statements appear in the signed-in Rise In task?
- [ ] What are the exact deadlines for this participant/cohort?
- [ ] Which wallet is mandatory for each level: Lace, 1AM, or another connector?
- [ ] Which network is required at each level?
- [ ] Which exact release-support-matrix row will be pinned for Compact, runtime, Midnight.js, connector, proof provider, indexer, and wallet? Current docs show language 0.26.0/compiler 0.34.0/runtime 0.19.0 as baselines.
- [ ] Can organization roles be represented cleanly with the current Compact/OpenZeppelin access modules?
- [ ] Which date representation is safest and easiest to prove in the circuit?
- [ ] Should the amount range policy be public values or a committed lender policy?
- [ ] Should buyer identity be public, pseudonymous, or selectively disclosed in the MVP?
- [ ] Do `registerPolicy` and `confirmFinancing` require an explicit lender registry for the approved MVP?
- [ ] What buyer-controlled canonical reference and nonce issuance process prevents the same real invoice receiving two nullifiers?
- [ ] Will proving be local, wallet-delegated, or remote, and what data is visible to that provider?
- [ ] What recovery and key-rotation policy is required before Preprod and before Mainnet?
- [ ] Which public metadata is acceptable for routing an invoice to its buyer without publishing company identity?
- [ ] What evidence is accepted for the 50-user and 20-user requirements?
- [ ] Are product social-profile and branding requirements mandatory for this cohort?

## 21. Decision Log

### 2026-09-25 — Use ProofFactor as the working project

Decision: Build a confidential B2B invoice verification and anti-double-financing dApp.

Reasoning:

- Strong official Midnight use-case alignment.
- Less crowded than voting, auctions, whistleblowing, and generic identity proofs.
- Privacy is necessary because invoices reveal commercially sensitive relationships and margins.
- Supports a richer state machine and stronger contract invariants than VeilPass.
- Can be demonstrated without transferring real funds.

### 2026-09-25 — Do not copy VeilPass

Decision: Use VeilPass only as a reference for submission completeness, deployment evidence, documentation, testing, and user experience.

Prohibited reuse:

- Its allowlist product concept.
- Its Compact contract.
- Its branding, copy, interface, or AI workspace.
- Unattributed application code.

### 2026-09-25 — Keep financing settlement outside the first MVP

Decision: The first MVP verifies and locks invoice eligibility but does not issue loans or move fiat.

Reasoning: This reduces legal, financial, integration, and smart-contract risk while preserving the central Midnight privacy demonstration.

### 2026-09-25 — Make proof and pending-request lock atomic

Decision: Use `requestFinancing` to verify all private predicates and lock the invoice to one lender/policy atomically. The selected lender later confirms or declines; confirmation consumes the stable nullifier atomically.

Reasoning: A proof without a pending lock permits stale proofs and time-of-check/time-of-use races. Separating lender confirmation keeps the business decision explicit without exposing invoice data.

### 2026-09-25 — Add a buyer-issued stable invoice nullifier

Decision: Use a stable, domain-separated nullifier in addition to the salted private-data commitment.

Reasoning: Changing a commitment salt must not allow the same invoice to be financed twice. The guarantee is limited to the ProofFactor registry and depends on buyer issuance discipline.

### 2026-09-25 — Treat every prover as malicious

Decision: Role authentication will use secret-derived identities or verified signatures/attestations. The contract will not trust `ownPublicKey()` or any caller-provided eligibility boolean.

Reasoning: Official Midnight security guidance states that witnesses are prover-controlled unless circuit assertions constrain them.

### 2026-09-25 — Use protocol block-time predicates

Decision: Deadline and expiry checks will use Compact block-time predicates. Browser timestamps are informational only.

Reasoning: This prevents callers from supplying a favorable current time and matches the current Compact execution model.

### 2026-09-25 — Adopt a technical-minimalist operations UI

Decision: Use a role-first financial-operations interface with paper-white surfaces, forest-green trust cues, hairline structure, restrained semantic status colors, and explicit privacy/disclosure labels. Avoid decorative crypto imagery, gradients, glass effects, and vanity analytics.

Reasoning: Invoice financing is consequential operational work. The UI must prioritize the next decision, make privacy boundaries visible, and distinguish proof generation, wallet approval, submission, and finality. The first Superdesign supplier-dashboard draft is recorded in `.superdesign/resume.json`.

## 22. Current Task Board

### Now

- [ ] Obtain detailed Rise In level requirements from the signed-in pages.
- [ ] Create a requirements-to-evidence matrix.
- [ ] Finish local environment validation by installing Docker Desktop and verifying proof server `8.1.0`.
- [x] Inspect the installed WSL and Compact toolchain.
- [x] Select and record the official Preprod compatibility-matrix row in `VERSIONS.md`.
- [x] Create the ProofFactor design system and first supplier-dashboard draft.
- [ ] Obtain visual approval for the supplier-dashboard direction.
- [ ] Prototype buyer identity, stable nullifier, block-time, atomic pending lock, and lender confirmation in isolated contract tests before UI work.
- [ ] Select the official starter architecture.

### Next

- [ ] Initialize Git.
- [ ] Scaffold the application and contract packages.
- [ ] Write the first contract tests before implementing lifecycle circuits.
- [ ] Implement commitment registration and buyer acceptance.
- [ ] Implement atomic `requestFinancing`, authenticated `confirmFinancing`, decline, and timeout paths.

### Later

- [ ] Complete lender eligibility proof.
- [ ] Deploy to Preview/Preprod.
- [ ] Build the polished role-based UI.
- [ ] Run user testing and prepare submission artifacts.

## 23. Definition of Done for the MVP

ProofFactor's MVP is complete only when:

- A supplier can create an invoice commitment from private synthetic data.
- An authorized buyer can accept it through a live Midnight transaction.
- A supplier can generate a proof against an actual lender policy.
- A supplier can atomically prove eligibility and lock one pending request; only the selected lender can confirm it.
- A repeat financing attempt fails at the contract level.
- Recommitting the same canonical invoice with a different salt cannot bypass the consumed stable nullifier within ProofFactor.
- The authorized buyer can mark the invoice paid.
- Public observers cannot access raw invoice information.
- Contract, integration, and production-build checks pass in CI.
- The app is deployed to the required network and hosting environment.
- Setup, privacy, security, deployment, and demo documentation are complete.
- Every competition requirement has recorded evidence.

## 24. Implementation Standards

### Repository and dependency hygiene

- Initialize Git before scaffolding and commit in small, reviewable milestones.
- Commit the lockfile and use `npm ci` in CI and deployment.
- Pin all Midnight packages to the exact versions in `VERSIONS.md`.
- Keep `.env.example` limited to documented variable names and safe placeholders.
- Never commit seeds, private keys, role secrets, wallet backups, API keys, real invoices, or user exports.
- Generated Compact artifacts may be committed only when the official workflow or hosting deployment requires them; record the compiler version and source hash that produced them.
- Add license, contribution notes, security disclaimer, and synthetic-data notice before publishing.

### Coding rules

- Use integer minor currency units; never use JavaScript or Compact floating-point arithmetic for money.
- Keep contract assertions explicit and user-facing error messages non-sensitive.
- Treat all frontend, witness, wallet, indexer, and URL inputs as untrusted.
- Centralize canonical invoice encoding, domain separators, policy encoding, and state-transition rules.
- Do not duplicate commitment logic independently across UI, tests, and witnesses without shared test vectors.
- Reject unsupported schema versions rather than guessing how to decode them.
- Prefer the smallest circuit that establishes the required statement; do not put document parsing, OCR, or business UI logic inside Compact.
- Never treat a successful frontend preflight as contract authorization.

### Frontend privacy and security

- Default to no analytics during the MVP. If analytics become a requirement, use aggregate events only after a documented privacy review.
- Apply a restrictive Content Security Policy where hosting permits it.
- Sanitize wallet-provided names/icons and any external metadata.
- Do not place commitments, invoice fields, role secrets, wallet addresses, or proof inputs in query strings.
- Clear synthetic invoice form state on explicit user request and document what remains in the Midnight private-state provider.
- Show a transaction disclosure preview listing the exact public fields before wallet approval.
- Distinguish local calculation, proof generation, wallet approval, submission, and finalization in the UI.

### Deployment configuration

- Maintain separate configuration for local/undeployed, Preview, Preprod, and Mainnet.
- Validate that wallet network, contract address, indexer, node, proof provider, and generated artifacts all target the same environment.
- Fail closed on missing or malformed contract addresses; never invent or shorten an address.
- Record full deployment addresses, transaction IDs, source commit, compiler version, artifact hash, timestamp, and deployer environment in `docs/deployment.md`.
- Mainnet deployment requires a frozen release commit, passing CI, completed threat-model review, verified backup/key-rotation process, and explicit confirmation that the competition requires deployment.

## 25. User Testing and Evidence Ethics

- Use synthetic invoices and fictional companies for every public demo and onboarding exercise.
- Tell testers the application is experimental and not a lending service.
- Do not request real invoices, financial statements, bank details, government IDs, seed phrases, or wallet recovery phrases.
- Collect only the minimum feedback evidence required by Rise In.
- Obtain participant consent before recording names, screenshots, wallet addresses, quotes, or video.
- Prefer anonymous session IDs and aggregate counts over public wallet-address lists.
- Store feedback separately from private-state or wallet data.
- Define what qualifies as an onboarded user before counting and do not inflate the number with repeated sessions.
- Document failures and negative feedback as well as successful sessions.

## 26. Review Gates

### Gate A — Requirements lock

- [ ] Detailed Rise In instructions are captured verbatim or as screenshots.
- [ ] Every requirement maps to an artifact and deadline.
- [ ] ProofFactor is accepted under the permitted problem statement.

### Gate B — Protocol feasibility

- [ ] Official compatibility-matrix row is pinned.
- [ ] Compiler works in the chosen Windows/WSL workflow.
- [ ] Derived-role authentication test rejects a forged prover.
- [ ] Commitment/nullifier test vectors are stable.
- [ ] Block-time boundary tests pass.
- [ ] Atomic pending-lock and lender-confirmation model passes adversarial tests.
- [ ] Proof time and artifact size are acceptable for the demo.

### Gate C — Preprod release

- [ ] All CI gates pass from a clean checkout.
- [ ] Public/private data-flow review is complete.
- [ ] Actual proof-provider trust boundary is documented.
- [ ] No secrets or real invoice data exist in Git history or deployment bundles.
- [ ] End-to-end Lace Preprod transaction succeeds on the submitted build.
- [ ] A new tester completes the documented flow without developer intervention.

### Gate D — User-validation release

- [ ] Feedback consent and counting rules are defined.
- [ ] Synthetic demo data is resettable.
- [ ] Known limitations are visible in-product.
- [ ] Feedback-derived changes are linked to issues/commits.

### Gate E — Mainnet/submission

- [ ] Release commit and generated artifacts are frozen and reproducible.
- [ ] Key backup, rotation, revocation, and recovery procedures are tested.
- [ ] Contract addresses and transaction IDs are independently rechecked.
- [ ] Pitch claims match demonstrated behavior, especially around privacy, payment, and double financing.
- [ ] Mainnet build remains clearly labeled experimental unless it receives an appropriate independent security review.
- [ ] Every submission field has evidence and no placeholder URLs remain.

## 27. Research and Requirement Sources

These sources informed the plan. Re-check them before toolchain upgrades because Midnight is evolving rapidly.

- Rise In public program: `https://www.risein.com/programs/new-moon-to-full-monthly-moonshots-on-midnight`
- Midnight Request for Startups: `https://midnight.network/request-for-start-ups`
- Midnight documentation index: `https://docs.midnight.network/llms.txt`
- Midnight security and best practices: `https://docs.midnight.network/guides/security-best-practices`
- Compact language and standard library: `https://docs.midnight.network/compact`
- Version compatibility guidance: `https://docs.midnight.network/how-to/fix-version-mismatches`
- React wallet connector guide: `https://docs.midnight.network/guides/react-wallet-connect`
- Windows/WSL Compact setup: `https://docs.midnight.network/guides/windows-compact-setup`
- Official ZK loan tutorial: `https://docs.midnight.network/tutorials/zk-loan`
- Official leaderboard browser/Preprod tutorial: `https://docs.midnight.network/tutorials/leaderboard`
- VeilPass delivery reference only: `https://github.com/AmitabhDey-byte/VeilPass`

The signed-in Rise In task pages remain the authoritative source for this participant's acceptance criteria. Their contents must be added to the requirements matrix when available.

## 28. Product and Adoption Strategy

### Initial target users

- Small suppliers that wait 30–90 days for B2B invoice payment.
- Anchor buyers willing to acknowledge invoices without publishing vendor relationships.
- Invoice-factoring providers and private-credit desks that need authenticity and duplicate-financing controls.
- Auditors or program operators that need aggregate evidence without raw invoice access.

### Value by actor

- **Supplier:** proves an invoice satisfies a financing policy without broadcasting customers, revenue details, or margins.
- **Buyer:** confirms invoice authenticity without publishing its supplier network.
- **Lender:** receives cryptographic policy verification and a system-wide one-time financing control without collecting unnecessary invoice fields.
- **Auditor/public:** sees lifecycle integrity and aggregate counts without accessing commercial documents.

### Why Midnight is necessary

A conventional public smart contract would expose invoice fields or require a trusted backend to evaluate them. A conventional private database would hide the data but would not give independent on-chain verification or a shared anti-double-financing state. Midnight allows private invoice witnesses to influence a public, auditable lifecycle through ZK proofs.

### MVP adoption wedge

Start as a verification sandbox rather than a marketplace:

1. A supplier creates a synthetic receivable.
2. A buyer acknowledges it.
3. A lender posts a policy and confirms a proof-verified request.
4. All three see the same lifecycle while commercial fields stay private.

This produces a testable workflow for the competition without requiring bank integrations or regulated lending operations.

### Possible post-competition expansion

- Accounting-platform adapters that produce canonical invoice attestations.
- Multi-organization buyer and lender registries.
- Selective auditor disclosure with explicit consent.
- Invoice status oracles and payment-rail integrations.
- Privacy-preserving receivables portfolios and RWA collateralization.
- Cross-registry interoperability for broader duplicate-financing checks.

These are roadmap items, not promises for the competition MVP.

### Sustainability hypothesis

If validated after the competition, a commercial operator could charge organizations for policy management, integrations, compliance reporting, or verified workflow volume. The open contract/protocol can remain inspectable while hosted enterprise connectors and support provide revenue. No token is required for the MVP business model.

## 29. Demo and Pitch Plan

### Three-minute demo narrative

1. Show a private synthetic invoice and highlight the fields a supplier does not want on a public blockchain.
2. Generate its commitment locally and show the public disclosure preview.
3. Submit the commitment and let the buyer acknowledge it using the correct role secret/wallet flow.
4. Show the lender's public policy.
5. Generate the private eligibility proof; display proof progress without displaying the private amount.
6. Show the atomic transition to `PENDING_FINANCING`.
7. Confirm as the selected lender and show nullifier consumption/`FINANCED_CONFIRMED`.
8. Attempt a second request and show the contract reject it.
9. Mark the invoice paid as the buyer.
10. End on the public explorer and state exactly what observers can and cannot learn.

### Required negative demonstration

At least one failure should be visible in the recorded demo, preferably the second-financing rejection. Optional additional failures include altered invoice data, amount outside policy, wrong buyer, expired invoice, or wrong lender confirmation.

### Pitch claims that are allowed

- ProofFactor verifies policy predicates without publishing raw invoice fields.
- Buyer acknowledgement is authenticated by the contract's chosen role mechanism.
- ProofFactor prevents duplicate confirmed financing inside its own registry.
- Public lifecycle state is independently auditable.

### Pitch claims that are prohibited

- "No one can ever see the data" unless the actual proving/storage configuration justifies it.
- "Globally prevents invoice fraud" or "globally prevents double financing."
- "The invoice is legally valid" or "goods were delivered."
- "Financing was paid" when the MVP only records lender confirmation.
- "Production ready," "audited," or "secure for real invoices" without independent evidence.

## 30. Plan Maintenance Protocol

At the end of each meaningful implementation session:

1. Update `Last updated` and project status.
2. Check off completed tasks only after verification.
3. Add deployment/test evidence to the register.
4. Record material product, privacy, or architecture decisions in the Decision Log.
5. Add new blockers and risks with mitigation/owner.
6. Move the next actionable items into the `Now` section.
7. Ensure documentation describes implemented behavior, not intended behavior.

Status meanings:

- **Pending:** not started or not verified.
- **In progress:** implementation exists but acceptance checks are incomplete.
- **Blocked:** cannot proceed without a named dependency or user decision.
- **Verified:** evidence exists and is linked.
- **Deferred:** explicitly outside the current milestone, with a reason.
