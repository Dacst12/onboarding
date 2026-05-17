import argparse
import asyncio

from sqlalchemy import select

from app.core.constants import UserRole
from app.core.security import hash_password
from app.db.session import AsyncSessionLocal
from app.models.user import User


async def create_admin(email: str, password: str, full_name: str) -> None:
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.email == email))
        if result.scalar_one_or_none() is not None:
            raise SystemExit(f"User with email '{email}' already exists.")

        user = User(
            email=email,
            hashed_password=hash_password(password),
            full_name=full_name,
            role=UserRole.admin,
            is_active=True,
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)

    print(f"Admin created: id={user.id} email={user.email}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create an admin user.")
    parser.add_argument("--email", required=True, help="Admin email.")
    parser.add_argument("--password", required=True, help="Admin password.")
    parser.add_argument("--full-name", required=True, help="Admin full name.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    asyncio.run(create_admin(args.email, args.password, args.full_name))


if __name__ == "__main__":
    main()
