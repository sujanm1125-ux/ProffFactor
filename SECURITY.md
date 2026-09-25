# Security Policy

ProofFactor is an experimental competition prototype and has not received an independent security audit. Do not use it to make real lending decisions or process real invoices.

## Sensitive data

Never commit or paste:

- Wallet mnemonics, seeds, or signing keys
- Role secrets or supplier-control secrets
- Buyer nullifier nonces
- Private-state databases
- Real invoice documents or customer data
- Production contract administrator credentials

Use synthetic records for demonstrations. Local environment files, private state, and proof data are ignored by Git.

## Security properties exercised by tests

- Admin, buyer, and lender authority is derived from private witnesses.
- Invoice commitments bind all private invoice fields.
- Supplier financing requests require a valid commitment opening and supplier-control secret.
- Buyer-issued stable nullifiers prevent financing a recommitted canonical invoice twice after lender confirmation.
- Invalid lifecycle transitions are rejected.
- Expiry checks use protocol block time, not a prover-supplied timestamp.

## Known limitations

- The app transport is currently a local demonstration state machine; Preprod transactions are not yet wired.
- Organization key rotation and recovery are not implemented.
- Public commitments, pseudonymous identities, statuses, policy identifiers, and transaction timing remain observable.
- The contract proves consistency with supplied private inputs; it cannot prove that an off-chain document is legally genuine without an external attestation source.
- Financing settlement and fiat payment are out of scope.

Report vulnerabilities privately to the repository owner before public disclosure.
