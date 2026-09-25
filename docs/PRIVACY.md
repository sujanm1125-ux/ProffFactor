# Privacy and Disclosure Model

## Kept private during proof generation

- Invoice reference
- Amount and currency
- Due date
- Commitment salt
- Supplier control secret
- Buyer nullifier nonce
- Admin, buyer, and lender role secrets

## Intentionally public

- Commitment and supplier-control key
- Pseudonymous buyer identity
- Stable nullifier after acceptance
- Invoice lifecycle status
- Selected lender policy ID
- Lender policy currency, range, due-date ceiling, deadline, and active flag
- Contract and transaction metadata

## Selective proof

A supplier proves that:

- The private invoice opens the registered commitment.
- The private supplier secret opens the registered control key.
- The buyer nullifier opening matches the accepted invoice.
- Currency, amount, and due date satisfy the chosen public policy.
- The invoice and request are not expired.
- The stable nullifier has not already been consumed.

The public result is a state transition, not the raw invoice fields.

## Leakage and trust boundaries

Observers can correlate commitments, statuses, policy selection, nullifiers, and transaction timing. The proof server processes witness material during local proof generation and must be treated as part of the private computing boundary. For the competition demo, run the pinned proof server locally.

A commitment proves data consistency, not truth. Authenticity of a real invoice still depends on buyer attestation and any future document-verification integration.
