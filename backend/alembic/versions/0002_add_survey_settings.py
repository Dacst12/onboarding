"""add survey settings

Revision ID: 0002_add_survey_settings
Revises: 0001_initial
Create Date: 2026-05-17
"""
from alembic import op
import sqlalchemy as sa


revision = '0002_add_survey_settings'
down_revision = '0001_initial'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('survey_settings',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('enabled', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('frequency', sa.String(length=20), nullable=False, server_default='weekly'),
        sa.Column('day_of_week', sa.String(length=20), nullable=False, server_default='friday'),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )


def downgrade():
    op.drop_table('survey_settings')
