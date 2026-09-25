# ProofFactor Design System

## Product context

ProofFactor is a privacy-preserving B2B invoice verification dApp on Midnight. It serves four roles: suppliers register private invoice commitments and request financing; buyers review and attest invoices; lenders publish policies and confirm eligible requests; public viewers inspect privacy-safe lifecycle evidence.

The interface must make cryptographic actions understandable without pretending that the MVP transfers funds or proves delivery of goods. Every transaction clearly separates local preparation, zero-knowledge proof generation, wallet approval, chain submission, and finalization.

## Jobs to be done

- Supplier: register an invoice without exposing commercial details, understand its status, and request financing against a lender policy.
- Buyer: verify that an off-chain invoice exactly matches its commitment, then accept or reject it confidently.
- Lender: scan a compact work queue, understand which policy was proven, and confirm or decline without receiving the private invoice.
- Public observer: verify lifecycle integrity and aggregate activity without seeing sensitive fields.

## Information architecture

The desktop product uses one persistent application shell:

- Top bar: ProofFactor wordmark, current network, privacy status, selected role, wallet control.
- Left rail: Overview, Invoices, Policies, Requests, Explorer, Demo guide.
- Main workspace: role-specific priority queue and contextual detail panel.
- Transaction drawer: explicit staged progress for proof, wallet, submission, and finality.

Primary routes:

1. Overview: role-aware summary, action queue, recent lifecycle activity, privacy boundary.
2. Invoices: filterable lifecycle table and invoice-detail split view.
3. New invoice: guided canonical-data form with a persistent “private vs public” preview.
4. Buyer review: commitment match panel with accept/reject confirmation.
5. Lender policies: policy list, creation form, and immutable version history.
6. Financing requests: pending queue with proof facts, deadline, and confirm/decline actions.
7. Explorer: public-only records, state timeline, nullifier-consumption indicator, and network evidence.
8. Demo guide: three-role scripted walkthrough using synthetic data only.

## Primary design direction

Use a technical-minimalist financial operations aesthetic derived from the “Mosaic Grid Architecture” style prompt, adapted for a serious B2B application rather than a landing page.

### Color

- Paper background: `#F7F7F5`
- White active surface: `#FFFFFF`
- Forest primary: `#173B2C`
- Forest hover: `#0F2C20`
- Ink: `#1F2421`
- Muted ink: `#66706A`
- Hairline: `rgba(31, 36, 33, 0.16)`
- Hairline strong: `rgba(31, 36, 33, 0.30)`
- Mint success/private: `#9EE7B2`
- Gold pending/warning: `#F1CE62`
- Coral reject/risk: `#F08A70`
- Blue informational: `#8DB7D8`

Status color is always paired with an icon and text. Never communicate state using color alone.

### Typography

- Display and headings: Space Grotesk, tight but readable tracking.
- Body and controls: General Sans; fall back to Inter, system-ui, sans-serif.
- Technical labels, hashes, network metadata, amounts, timestamps: JetBrains Mono; fall back to ui-monospace.
- Dashboard title: 36–44px desktop, 30–34px tablet, 26–30px mobile.
- Body: 14–16px with at least 1.5 line-height.
- Metadata: 11–12px, uppercase only for short labels.

### Structure

- Flat 2D surfaces; no gradients, glassmorphism, or ornamental drop shadows.
- Use 1px hairlines, strong alignment, and generous whitespace to establish hierarchy.
- Border radius: 2px for technical panels, 6px maximum for interactive controls.
- Desktop canvas targets 1440px with a 72px top bar, 224px left rail, and fluid main workspace.
- Prefer split views for review work: queue/table on the left and contextual evidence on the right.
- Tables use sticky headers, visible row focus, and monospaced numeric columns.
- Avoid generic metric-card grids. Above the fold should answer the role’s next decision.

### Brand mark

Until a final logo is designed, use a code-native mark: a small forest square containing two intersecting white hairlines and one mint verification node. It should suggest a commitment being verified, not a padlock, moon, shield, or cryptocurrency coin. The wordmark is “ProofFactor” in Space Grotesk. This provisional mark must later be replaced consistently when a durable logo asset exists.

## Core components

### Status badge

Inline flex, 1px border, 2px radius, 6px square status marker, icon, and 11px JetBrains Mono label. Supported semantic states: Proposed, Accepted, Pending financing, Financed confirmed, Paid, Rejected, Cancelled, Expired.

### Privacy label

Compact outlined label with an eye-off icon and one of: `LOCAL ONLY`, `PROVED, NOT SHARED`, or `PUBLIC ON-CHAIN`. Tooltips explain the exact boundary in plain language.

### Evidence row

Two-column row: human-readable fact on the left and evidence/status on the right. Examples: “Buyer acknowledged invoice — Verified”; “Amount inside policy range — Proved privately”; “Exact amount — Not disclosed”.

### Primary actions

- Primary: solid forest background, paper text.
- Secondary: paper background, forest text, 1px forest border.
- Destructive: paper background, coral border and ink text; full confirmation required.
- Disabled actions explain why they are unavailable.

### Transaction progress drawer

Right-side drawer with four explicit stages: Generate proof, Approve in wallet, Submit transaction, Await finality. Only the active stage animates. Include retry guidance and never collapse proof generation into a generic spinner.

### Public hash display

JetBrains Mono, truncated center with copy button and accessible full-value tooltip. Never place private invoice values in copyable public metadata blocks.

## Initial dashboard composition

Design the supplier overview as the initial anchor page:

- Header: greeting, one-line role objective, `Register invoice` primary action.
- Priority band: “2 invoices need action” with Accepted and Pending financing counts.
- Main split: recent invoices table (roughly 65%) and privacy/evidence panel (35%).
- Table columns: invoice alias, buyer alias, lifecycle, due window, updated, next action. Do not display exact private amounts.
- Evidence panel: selected invoice lifecycle stepper, three proved facts, public metadata preview, and a clear disclosure notice.
- Lower band: available lender policies with public range/currency/term and a “Check privately” action.
- Persistent testnet notice: synthetic data only; no real funds transferred.

## Landing page composition

The public entry page uses an editorial product story, but it must demonstrate the protocol before asking the visitor to enter the workspace:

- Hero: state the invoice-financing problem and show a commitment/proof artifact.
- Proof Bench: let visitors switch between commitment matching, policy eligibility, and stable-nullifier checks; each tab shows a private claim and its public result.
- Role paths: explain the supplier, buyer, and lender decisions without presenting generic marketing cards.
- Disclosure boundary: contrast local witness fields with intentionally public registry state.
- Lifecycle: show the accountable state progression from proposed through paid.
- CTA: link into the interactive workspace, which remains the product surface at `/app`.

This structure is informed by Midnight's public/private dual-state and selective-disclosure model, zkPass's interactive proof bench pattern, and Centrifuge's separation of asset workflows into clear role-based paths. It uses those information patterns only; no external copy, branding, or assets are reused.

## Interaction and motion

- Motion duration: 120–180ms for hover/focus, 200–260ms for drawers and panels.
- Use standard ease-out; no springy or playful finance interactions.
- Table selection updates the detail panel without navigation.
- Role switch changes the priority queue and navigation labels while retaining the common shell.
- Privacy labels reveal concise explanations on hover, focus, or tap.
- Confirmation dialogs summarize public disclosures and irreversible state changes.
- Respect `prefers-reduced-motion` and provide a no-animation path.

## Responsive behavior

- Desktop: persistent left rail and split workspace.
- Tablet: collapsible rail, table remains primary, detail opens as a right drawer.
- Mobile: bottom navigation for Overview, Work, Explorer, More; tables become structured cards; transaction progress becomes a full-height sheet.
- Never horizontally squeeze a finance table below usability; switch representation instead.

## Accessibility

- WCAG 2.2 AA contrast and keyboard operation.
- Visible 2px focus indicators with offset.
- Minimum 44px interactive target on touch layouts.
- Status icons have text equivalents; technical hashes have readable labels.
- Error summaries appear above forms and link to invalid fields.
- Live regions announce wallet connection, proof generation, submission, and finality changes.

## Copy principles

- Prefer direct operational language: “Generate private proof”, “Accept invoice”, “Confirm financing”.
- Never say “anonymous”; say which fields stay private.
- Never say “financing complete” unless the lender has confirmed; the MVP does not move funds.
- Never claim “data never leaves your device” unless the active prover configuration has been verified.
- Use “Testnet” and “Synthetic data” prominently in demo mode.

## Hard constraints

- Use only the fonts, colors, spacing, and component styles defined here.
- Do not introduce gradients, neon colors, glass surfaces, large rounded cards, cartoon illustration, or decorative crypto imagery.
- Do not expose exact invoice amount, invoice number, supplier/buyer legal identity, line items, bank details, or commitment openings in dashboard examples.
- The UI must distinguish simulated demo operations from real wallet/network transactions.
