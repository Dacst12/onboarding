from datetime import date

import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.core.constants import UserRole
from app.core.security import hash_password
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.template_plan import TemplatePlan, TemplateStage, TemplateTask
from app.models.user import User
from app.services.domain import create_plan_from_template

TEST_DATABASE_URL = 'sqlite+aiosqlite:///:memory:'
engine = create_async_engine(TEST_DATABASE_URL, connect_args={'check_same_thread': False}, poolclass=StaticPool)
TestingSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


@pytest.fixture(scope='session')
def anyio_backend():
    return 'asyncio'


@pytest.fixture(scope='session', autouse=True)
async def prepare_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with TestingSessionLocal() as session:
        admin = User(email='admin@test.com', hashed_password=hash_password('admin123'), full_name='Admin', role=UserRole.admin)
        mentor = User(email='mentor@test.com', hashed_password=hash_password('mentor123'), full_name='Mentor', role=UserRole.mentor)
        mentor2 = User(email='mentor2@test.com', hashed_password=hash_password('mentor234'), full_name='Mentor Two', role=UserRole.mentor)
        employee = User(email='employee@test.com', hashed_password=hash_password('employee123'), full_name='Employee', role=UserRole.new_employee, mentor=mentor)
        employee_with_plan = User(
            email='employee2@test.com',
            hashed_password=hash_password('employee234'),
            full_name='Employee With Plan',
            role=UserRole.new_employee,
            mentor=mentor,
        )
        employee_other_mentor = User(
            email='employee3@test.com',
            hashed_password=hash_password('employee345'),
            full_name='Employee Other Mentor',
            role=UserRole.new_employee,
            mentor=mentor2,
        )
        inactive_user = User(
            email='inactive@test.com',
            hashed_password=hash_password('inactive123'),
            full_name='Inactive User',
            role=UserRole.new_employee,
            is_active=False,
        )
        template = TemplatePlan(title='Template 1')
        stage = TemplateStage(title='Week 1', order_index=1, template=template)
        task = TemplateTask(title='Welcome', description='Intro', offset_days=1, stage=stage)
        session.add_all(
            [
                admin,
                mentor,
                mentor2,
                employee,
                employee_with_plan,
                employee_other_mentor,
                inactive_user,
                template,
                stage,
                task,
            ]
        )
        await session.commit()
        await session.refresh(template, attribute_names=['stages'])
        for staged in template.stages:
            await session.refresh(staged, attribute_names=['tasks'])
        await create_plan_from_template(session, employee_with_plan, template, date(2024, 1, 1))
    yield


@pytest.fixture()
async def client():
    async def override_get_db():
        async with TestingSessionLocal() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url='http://test') as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest.fixture()
async def db_session():
    async with TestingSessionLocal() as session:
        yield session
