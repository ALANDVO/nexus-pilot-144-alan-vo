import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.database import init_db, async_session_maker, engine
from app.models.course import CourseModule, Lesson, Base
from sqlalchemy import delete


@pytest.fixture(scope="function", autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    async with async_session_maker() as session:
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
            colab_url="https://colab.research.google.com/...",
            order=1
        )
        session.add(lesson)
        await session.commit()
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.mark.asyncio
async def test_list_modules():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/courses/modules")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert "title" in data[0]
        assert "lessons" in data[0]


@pytest.mark.asyncio
async def test_get_module():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/courses/modules/1")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == 1
        assert data["title"] == "Introduction to LLMs"
        assert len(data["lessons"]) >= 1


@pytest.mark.asyncio
async def test_get_lesson():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/courses/lessons/1")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == 1
        assert data["title"] == "What are LLMs?"
        assert data["colab_url"] is not None


@pytest.mark.asyncio
async def test_module_not_found():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/courses/modules/999")
        assert response.status_code == 404


@pytest.mark.asyncio
async def test_lesson_not_found():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/courses/lessons/999")
        assert response.status_code == 404