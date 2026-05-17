from datetime import date

import asyncio
from sqlalchemy import select

from app.core.constants import UserRole
from app.core.security import hash_password
from app.db.base import Base
from app.db.session import engine, AsyncSessionLocal
from app.models import *  # noqa: F401,F403
from app.models.template_plan import TemplatePlan, TemplateStage, TemplateTask
from app.models.user import User


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as session:
        admin = (await session.execute(select(User).where(User.email == 'admin@example.com'))).scalar_one_or_none()
        if not admin:
            admin = User(email='admin@example.com', hashed_password=hash_password('admin123'), full_name='System Admin', role=UserRole.admin)
            mentor = User(email='mentor@example.com', hashed_password=hash_password('mentor123'), full_name='Mentor One', role=UserRole.mentor)
            session.add_all([admin, mentor])
            await session.flush()
            template = TemplatePlan(title='Standard onboarding')
            session.add(template)
            await session.flush()
            stage = TemplateStage(template_id=template.id, title='Week 1', order_index=1)
            session.add(stage)
            await session.flush()
            session.add(TemplateTask(stage_id=stage.id, title='Intro call', description='Meet the team', offset_days=1, created_by_id=admin.id))
            await session.commit()
            print('Seed completed')
        else:
            print('Seed already exists')


if __name__ == '__main__':
    asyncio.run(seed())

