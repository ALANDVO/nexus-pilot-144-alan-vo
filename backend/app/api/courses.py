from datetime import datetime
 
from app.core.database import get_db
from app.services.course_service import CourseService
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/courses", tags=["courses"])


class ModuleResponse(BaseModel):
    id: int
    title: str
    description: str
    order: int
    lessons: list["LessonResponse"]
 
    model_config = ConfigDict(from_attributes=True)

class LessonResponse(BaseModel):
    id: int
    module_id: int
    title: str
    content: str
    colab_url: str | None
    order: int
 
    model_config = ConfigDict(from_attributes=True)

class ProgressUpdate(BaseModel):
    completed: bool
 
 
class ProgressResponse(BaseModel):
    id: int
    user_id: int
    lesson_id: int
    completed: int
    completed_at: datetime | None
 
    model_config = ConfigDict(from_attributes=True)
 
 
ModuleResponse.model_rebuild()
LessonResponse.model_rebuild()

@router.get("/modules", response_model=list[ModuleResponse])
async def list_modules(db: AsyncSession = Depends(get_db)):
    service = CourseService(db)
    modules = await service.get_modules()
    return modules


@router.get("/modules/{module_id}", response_model=ModuleResponse)
async def get_module(module_id: int, db: AsyncSession = Depends(get_db)):
    service = CourseService(db)
    module = await service.get_module(module_id)
    if not module:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
    return module


@router.get("/lessons/{lesson_id}", response_model=LessonResponse)
async def get_lesson(lesson_id: int, db: AsyncSession = Depends(get_db)):
    service = CourseService(db)
    lesson = await service.get_lesson(lesson_id)
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    return lesson


@router.get("/progress", response_model=list[ProgressResponse])
async def get_progress(user_id: int, db: AsyncSession = Depends(get_db)):
    service = CourseService(db)
    progress = await service.get_user_progress(user_id)
    return progress


@router.post("/progress/{lesson_id}", response_model=ProgressResponse)
async def update_progress(
    lesson_id: int,
    update: ProgressUpdate,
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    service = CourseService(db)
    lesson = await service.get_lesson(lesson_id)
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    progress = await service.update_progress(user_id, lesson_id, update.completed)
    return progress
