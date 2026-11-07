# Changelog

## 1.2.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## 1.1.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## 1.0.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-23

### Fixed
- Deprecated `datetime.utcnow()` replaced with timezone-aware `datetime.now(timezone.utc)` in models and services

### Added
- Project skeleton with FastAPI backend and React frontend
- Health check endpoint (/api/health)
- Docker Compose with backend, frontend, and Keycloak services
- Keycloak realm configuration with viewer/operator/admin roles
- CI/CD pipeline with backend/frontend tests and Docker builds
- Basic responsive UI with health status display
- MIT License and project documentation
