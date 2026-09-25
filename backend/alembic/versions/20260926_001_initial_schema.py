"""Initial public metadata schema for AegisBid

Revision ID: 20260926_001
Revises: 
Create Date: 2026-09-26 02:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '20260926_001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Public auctions table
    op.create_table(
        'public_auctions',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('auction_id_hex', sa.String(length=66), nullable=False),
        sa.Column('title', sa.String(length=128), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('category', sa.String(length=64), nullable=False),
        sa.Column('reserve_price', sa.BigInteger(), nullable=False),
        sa.Column('currency', sa.String(length=16), nullable=False),
        sa.Column('bidding_deadline_block', sa.BigInteger(), nullable=False),
        sa.Column('seller_identity_hex', sa.String(length=66), nullable=False),
        sa.Column('status', sa.String(length=24), nullable=False),
        sa.Column('highest_commitment_hex', sa.String(length=66), nullable=True),
        sa.Column('cleared_amount', sa.BigInteger(), nullable=True),
        sa.Column('winner_identity_hex', sa.String(length=66), nullable=True),
        sa.Column('contract_address', sa.String(length=128), nullable=True),
        sa.Column('network', sa.String(length=24), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_public_auctions_auction_id_hex', 'public_auctions', ['auction_id_hex'], unique=True)
    op.create_index('ix_public_auctions_status', 'public_auctions', ['status'], unique=False)

    # Proof receipts table
    op.create_table(
        'proof_receipts',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('auction_id_hex', sa.String(length=66), nullable=False),
        sa.Column('transaction_id', sa.String(length=128), nullable=False),
        sa.Column('commitment_hex', sa.String(length=66), nullable=False),
        sa.Column('nullifier_hex', sa.String(length=66), nullable=False),
        sa.Column('circuit_name', sa.String(length=64), nullable=False),
        sa.Column('proof_outcome', sa.String(length=32), nullable=False),
        sa.Column('block_height', sa.BigInteger(), nullable=True),
        sa.Column('network', sa.String(length=24), nullable=False),
        sa.Column('disclosure_scope', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_proof_receipts_auction_id_hex', 'proof_receipts', ['auction_id_hex'], unique=False)
    op.create_index('ix_proof_receipts_transaction_id', 'proof_receipts', ['transaction_id'], unique=True)
    op.create_index('ix_proof_receipts_nullifier_hex', 'proof_receipts', ['nullifier_hex'], unique=False)

    # Aggregate metrics table
    op.create_table(
        'aggregate_metrics',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('metric_key', sa.String(length=64), nullable=False),
        sa.Column('metric_value', sa.BigInteger(), nullable=False),
        sa.Column('category', sa.String(length=32), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_aggregate_metrics_metric_key', 'aggregate_metrics', ['metric_key'], unique=True)


def downgrade() -> None:
    op.drop_table('aggregate_metrics')
    op.drop_table('proof_receipts')
    op.drop_table('public_auctions')
