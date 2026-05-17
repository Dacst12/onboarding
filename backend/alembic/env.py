from logging.config import fileConfig

    run_migrations_online()
else:
    run_migrations_offline()
if context.is_offline_mode():


            context.run_migrations()
        with context.begin_transaction():
        context.configure(connection=connection, target_metadata=target_metadata)
    with connectable.connect() as connection:
    connectable = engine_from_config(config.get_section(config.config_ini_section), prefix='sqlalchemy.', poolclass=pool.NullPool)
def run_migrations_online():


        context.run_migrations()
    with context.begin_transaction():
    context.configure(url=settings.DATABASE_URL, target_metadata=target_metadata, literal_binds=True)
def run_migrations_offline():


target_metadata = Base.metadata
config.set_main_option('sqlalchemy.url', settings.DATABASE_URL)
settings = get_settings()
fileConfig(config.config_file_name)
config = context.config

from app.models import *  # noqa: F401,F403
from app.db.base import Base
from app.core.config import get_settings

from sqlalchemy import engine_from_config, pool
from alembic import context

