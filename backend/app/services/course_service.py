from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.course import CourseModule, Lesson, UserProgress, User, UserRole
from typing import List, Optional
from datetime import datetime


class CourseService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_modules(self) -> List[CourseModule]:
        result = await self.db.execute(
            select(CourseModule)
            .options(selectinload(CourseModule.lessons))
            .order_by(CourseModule.order)
        )
        return result.scalars().all()

    async def get_module(self, module_id: int) -> Optional[CourseModule]:
        result = await self.db.execute(
            select(CourseModule)
            .options(selectinload(CourseModule.lessons))
            .where(CourseModule.id == module_id)
        )
        return result.scalar_one_or_none()

    async def get_lesson(self, lesson_id: int) -> Optional[Lesson]:
        result = await self.db.execute(
            select(Lesson).where(Lesson.id == lesson_id)
        )
        return result.scalar_one_or_none()

    async def get_user_progress(self, user_id: int) -> List[UserProgress]:
        result = await self.db.execute(
            select(UserProgress)
            .options(selectinload(UserProgress.lesson))
            .where(UserProgress.user_id == user_id)
        )
        return result.scalars().all()

    async def update_progress(self, user_id: int, lesson_id: int, completed: bool) -> UserProgress:
        result = await self.db.execute(
            select(UserProgress).where(
                UserProgress.user_id == user_id,
                UserProgress.lesson_id == lesson_id
            )
        )
        progress = result.scalar_one_or_none()
        if not progress:
            progress = UserProgress(user_id=user_id, lesson_id=lesson_id)
            self.db.add(progress)
        progress.completed = 1 if completed else 0
        progress.completed_at = datetime.utcnow() if completed else None
        await self.db.commit()
        await self.db.refresh(progress)
        return progress

    async def get_or_create_user(self, keycloak_id: str, email: str, username: str, roles: List[str]) -> User:
        result = await self.db.execute(
            select(User).where(User.keycloak_id == keycloak_id)
        )
        user = result.scalar_one_or_none()
        if not user:
            role = UserRole.VIEWER
            if "admin" in roles:
                role = UserRole.ADMIN
            elif "operator" in roles:
                role = UserRole.OPERATOR
            user = User(
                keycloak_id=keycloak_id,
                email=email,
                username=username,
                role=role
            )
            self.db.add(user)
            await self.db.commit()
            await self.db.refresh(user)
        return user