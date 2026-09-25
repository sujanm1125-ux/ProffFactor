# Guided Demo

Use synthetic data only.

## Preparation

1. Run `npm install`.
2. Run `npm run check`.
3. Run `npm run dev`.
4. Open `http://localhost:5173`.
5. Connect an injected wallet if available, or select the clearly labeled demo wallet.

## Happy path

1. Select **Supplier** and register a synthetic invoice.
2. Confirm that privacy labels distinguish local-only fields from public commitment data.
3. Switch to **Buyer**, open the proposed invoice, and accept it.
4. Switch to **Supplier**, choose a lender policy, and request financing.
5. Observe the transaction drawer stages: proof, approval, submission, and finality.
6. Switch to **Lender** and confirm the pending request.
7. Switch to **Buyer** and mark the invoice paid.
8. Open **Public explorer** and verify that no raw amount, due date, or invoice reference is shown.

## Adversarial evidence

The automated contract suite also demonstrates:

- A non-admin cannot authorize a buyer.
- A buyer cannot register a lender policy.
- A buyer cannot confirm a selected lender's request.
- A wrong supplier-control secret cannot request financing.
- A second commitment with the same stable nullifier cannot be financed after confirmation.
- A pending request cannot be released before its deadline and can be released at the deadline.

Run it with:

```powershell
npm run test --workspace @prooffactor/contract
```

## Live Preprod note

Demo-wallet activity is intentionally local. Do not describe it as a blockchain transaction. A live demo becomes available only after the Preprod adapter is configured and a contract address is recorded in `plan.md`.
