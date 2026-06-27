# Release Notes — Bookify v1.0.0

**Release Date:** 2026-06-27
**Repository:** [MarinaYepiskoposyan/booking](https://github.com/MarinaYepiskoposyan/booking)
**Live URL:** https://booking-frontend-872770026786.us-central1.run.app

---

## Overview

First production release of **Bookify** — a full-stack appointment booking platform built with Angular 17, Spring Boot 3.2, and MySQL 8.0, deployed on Google Cloud Run.

---

## What's Included

### Features (Sprint 1)

- **Authentication** — JWT-based register and login with role selection (Client / Provider)
- **User Profile** — view and edit profile with avatar initials and role badge
- **Provider Onboarding** — business profile setup (name, description, address, website)
- **Service Management** — providers can create, edit, and delete services with duration and price

### UI/UX Redesign

- New **Indigo design system** with CSS variables and Inter font
- Responsive card-based layouts for all pages
- Loading spinners, skeleton states, and empty state illustrations
- Password hint and real-time field validation messages on registration

### Performance Improvements

- `@Transactional` on `AuthService.register()` — prevents partial saves
- `@Transactional(readOnly=true)` on read-only service queries
- Pagination on `GET /api/provider/services`
- Database indexes added via Flyway migration (V4) on `users.email`, `services.provider_id`, `services.is_active`

---

## Infrastructure

### Google Cloud Deployment

| Service | Details |
|---|---|
| Frontend | Cloud Run — `booking-frontend` · us-central1 |
| Backend | Cloud Run — `booking-backend` · us-central1 |
| Database | Cloud SQL MySQL 8.0 — `booking-mysql` · db-f1-micro |
| Images | Artifact Registry — `us-central1-docker.pkg.dev/booking-app-free-2026/booking` |

### CI/CD Pipeline (GitHub Actions)

- **CI** — builds and tests on every push to `master`
- **CD** — builds Docker images, pushes to Artifact Registry, deploys to Cloud Run
- Secrets managed via GitHub Secrets (JWT, DB credentials)
- Cloud SQL Socket Factory for secure backend → database connectivity

---

## Bug Fixes

| # | Fix | Commit |
|---|---|---|
| 1 | JWT secret must be Base64-encoded — was plain text causing 500 on all auth requests | `b241345` |
| 2 | Allow empty phone number in registration (was rejecting blank optional field) | `6b145c5` |
| 3 | Frontend in production was calling relative `/api/` instead of direct backend URL | `f8b2559` |
| 4 | CORS config missing Cloud Run frontend origin | `f8b2559` |
| 5 | Registration error showed generic fallback instead of specific validation message | `2979b54` |
| 6 | Cloud Run URLs updated after service redeploy | `a9fae6e` |

---

## CI/CD Fixes

| # | Fix | Commit |
|---|---|---|
| 1 | Switched from `npm ci` to `npm install` — no `package-lock.json` in repo | `9e637af` |
| 2 | Pinned `@types/node` to `20.14.0` — v22+ incompatible with TypeScript 5.2 | `d45b732` |
| 3 | Hardcoded non-sensitive GCP values to avoid GitHub secret masking in job outputs | `e1a9ba0` |
| 4 | Added `iam.serviceAccountUser` binding on Compute Engine default SA for Cloud Run deploy | `c9fe1e7` |
| 5 | Switched CD auth to service account key — Cloud SQL socket factory added to backend | `b52dc81` |

---

## Known Limitations

- Booking flow (search, schedule, confirm) not yet implemented — planned for Sprint 2
- No email notifications
- No payment integration

---

## Credentials & Access

| Item | Value |
|---|---|
| GCP Project | `booking-app-free-2026` |
| GCP Account | `marinaforgglefreetrial@gmail.com` |
| Cloud Run region | `us-central1` |
| Backend health check | https://booking-backend-872770026786.us-central1.run.app/actuator/health |
