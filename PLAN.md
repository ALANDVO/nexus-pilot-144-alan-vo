# Product development plan

Each round completes one feature or repair. Future items are planned, not implemented claims.

## Current round

project-skeleton

## Roadmap

### project-skeleton — Project skeleton with FastAPI backend and React frontend

Status: done

Acceptance:
- Backend FastAPI app runs and serves health endpoint
- Frontend React app builds and serves
- Docker compose starts both services
- Basic pytest and vitest tests pass

Implementation: `backend/app/main.py`, `backend/app/api/health.py`, `backend/app/api/courses.py`, `backend/app/core/config.py`, `backend/app/core/database.py`, `backend/app/models/course.py`, `backend/app/services/course_service.py`, `backend/requirements.txt`, `backend/Dockerfile`, `frontend/package.json`, `frontend/vite.config.ts`, `frontend/src/main.tsx`, `frontend/src/App.tsx`, `frontend/Dockerfile`, `compose.yaml`, `.github/workflows/ci.yml`

Tests: `backend/tests/test_health.py`, `backend/tests/test_courses.py`, `frontend/src/App.test.tsx`

### course-content — Course content management with roadmaps and notebooks

Status: planned

Acceptance:
- API serves course modules, lessons, and Colab notebook links
- Frontend displays roadmap with progress tracking
- Users can browse and launch notebooks

### fine-tuning-workflows — Fine-tuning workflow guides (Axolotl, DPO, quantization)

Status: planned

Acceptance:
- Interactive guides for Axolotl fine-tuning
- DPO/RLHF preference alignment workflow
- GGUF quantization with error troubleshooting
- Function calling fine-tuning example

### auth-oidc — OIDC authentication with Keycloak

Status: planned

Acceptance:
- Keycloak realm configured
- Login/logout flow works
- Role-based access (viewer/operator/admin)
- Session management with HttpOnly cookies

### llm-adapters — LLM provider adapters (OpenAI-compatible, Anthropic, Gemini, Ollama)

Status: planned

Acceptance:
- Configurable provider selection
- Advisory explanations grounded in course content
- Provider errors handled gracefully

