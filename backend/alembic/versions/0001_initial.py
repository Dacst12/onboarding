"""initial

Revision ID: 0001_initial
Revises:
Create Date: 2026-05-16
"""
from alembic import op
import sqlalchemy as sa

revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('users',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('email', sa.String(length=255), nullable=False, unique=True),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('role', sa.Enum('new_employee', 'mentor', 'hr', 'admin', name='userrole'), nullable=False),
        sa.Column('position', sa.String(length=255)),
        sa.Column('department', sa.String(length=255)),
        sa.Column('telegram', sa.String(length=255)),
        sa.Column('phone', sa.String(length=50)),
        sa.Column('responsibility_tags', sa.Text()),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('mentor_id', sa.Integer(), sa.ForeignKey('users.id')),
    )
    op.create_table('template_plans',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_table('template_stages',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('template_id', sa.Integer(), sa.ForeignKey('template_plans.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('order_index', sa.Integer(), nullable=False),
    )
    op.create_table('template_tasks',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('stage_id', sa.Integer(), sa.ForeignKey('template_stages.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text()),
        sa.Column('offset_days', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_by_id', sa.Integer(), sa.ForeignKey('users.id')),
    )
    op.create_table('onboarding_plans',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('template_id', sa.Integer(), sa.ForeignKey('template_plans.id', ondelete='SET NULL')),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_table('plan_stages',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('plan_id', sa.Integer(), sa.ForeignKey('onboarding_plans.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('order_index', sa.Integer(), nullable=False),
    )
    op.create_table('tasks',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('stage_id', sa.Integer(), sa.ForeignKey('plan_stages.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text()),
        sa.Column('due_date', sa.Date()),
        sa.Column('is_completed', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('completed_at', sa.DateTime(timezone=True)),
        sa.Column('is_system_task', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('requires_confirmation', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('added_by_mentor_id', sa.Integer(), sa.ForeignKey('users.id')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_table('feedbacks',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('week_number', sa.Integer(), nullable=False),
        sa.Column('mood', sa.Integer(), nullable=False),
        sa.Column('tasks_clear', sa.Boolean()),
        sa.Column('wish', sa.Text()),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )


def downgrade():
    op.drop_table('feedbacks')
    op.drop_table('tasks')
    op.drop_table('plan_stages')
    op.drop_table('onboarding_plans')
    op.drop_table('template_tasks')
    op.drop_table('template_stages')
    op.drop_table('template_plans')
    op.drop_table('users')

