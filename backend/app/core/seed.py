from sqlalchemy import select
from app.core.database import async_session_maker
from app.models.course import CourseModule, Lesson

async def seed_default_data():
    async with async_session_maker() as session:
        result = await session.execute(select(CourseModule))
        if not result.scalars().first():
            module = CourseModule(
                title="Introduction to LLMs",
                description="Fundamentals of Large Language Models",
                order=1
            )
            session.add(module)
            await session.flush()
            lesson = Lesson(
                module_id=module.id,
                title="What are LLMs?",
                content="LLMs are large language models...",
                colab_url="https://colab.research.google.com/example",
                order=1
            )
            session.add(lesson)
            await session.commit()
