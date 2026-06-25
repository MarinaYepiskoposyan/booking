# Sprint Report: Sprint 1 — FINAL
**Generated:** 2026-06-25  
**Sprint Goal:** Authentication, provider onboarding, and service management foundation  
**Period:** 2026-06-23 → 2026-06-25  
**Status:** Closed (completed 2026-06-25)  

---

## Summary

| Metric | Value |
|--------|-------|
| Total tickets | 5 |
| Done | 5 |
| In Progress | 0 |
| To Do | 0 |
| Sprint completion | 100% |

---

## Ticket Activity

### SCRUM-13 — User Registration
- **Type:** Story
- **Status:** Done
- **Priority:** Medium
- **Assignee:** Unassigned

**Agent Activity:**
- 2026-06-23 15:53 (Marina Yepiskoposyan): Implemented and committed. Commit: b05c125b8ac5c53ac56af6005c26d614b5b9e842

---

### SCRUM-14 — User Login
- **Type:** Story
- **Status:** Done
- **Priority:** Medium
- **Assignee:** Unassigned

**Agent Activity:**
- 2026-06-23 15:53 (Marina Yepiskoposyan): Implemented and committed. Commit: b05c125b8ac5c53ac56af6005c26d614b5b9e842

---

### SCRUM-15 — View Own Profile
- **Type:** Story
- **Status:** Done
- **Priority:** Medium
- **Assignee:** Unassigned

**Agent Activity:**
- 2026-06-23 15:53 (Marina Yepiskoposyan): Implemented and committed. Commit: b05c125b8ac5c53ac56af6005c26d614b5b9e842

---

### SCRUM-16 — Provider Sets Up Business Profile
- **Type:** Story
- **Status:** Done
- **Priority:** Medium
- **Assignee:** Unassigned

**Agent Activity:**
- 2026-06-23 15:53 (Marina Yepiskoposyan): Implemented and committed. Commit: b05c125b8ac5c53ac56af6005c26d614b5b9e842

---

### SCRUM-17 — Provider Adds a Service
- **Type:** Story
- **Status:** Done
- **Priority:** Medium
- **Assignee:** Unassigned

**Agent Activity:**
- 2026-06-23 15:53 (Marina Yepiskoposyan): Implemented and committed. Commit: b05c125b8ac5c53ac56af6005c26d614b5b9e842

---

## Commits in This Sprint

| Commit | Date | Author | Message |
|--------|------|--------|---------|
| b05c125 | 2026-06-23 15:52 | Marina Yepiskoposyan | feat: implement Sprint 1 — auth, user profile, provider onboarding, and service management |
| fdc96e2 | 2026-06-23 16:13 | Marina Yepiskoposyan | perf: apply performance fixes from static analysis |

**b05c125** — Primary delivery commit covering all 5 stories: 84 files, 2,595 insertions.  
**fdc96e2** — Follow-up performance hardening: 9 files, 41 insertions / 19 deletions.

---

## Agent Contributions

| Agent | What it did | Files / Tickets Affected |
|-------|-------------|--------------------------|
| **business-analyst** | Defined user stories for registration, login, profile, provider onboarding, and service management | SCRUM-13, SCRUM-14, SCRUM-15, SCRUM-16, SCRUM-17 |
| **solution-architect** | Designed layered Spring Boot architecture (controller → service → repository), JWT security model, CORS config, and Angular route/guard structure | `SecurityConfig.java`, `CorsConfig.java`, `JwtService.java`, `app.routes.ts`, `auth.guard.ts`, `provider.guard.ts` |
| **ticket-creator** | Created 5 sprint stories in Jira and assigned them to Sprint 1 (id=35) | SCRUM-13 through SCRUM-17 |
| **backend-developer** | Implemented REST controllers, service layer, JPA entities, JWT filter, global exception handler, and all DTOs | `AuthController.java`, `UserController.java`, `ProviderProfileController.java`, `ServiceController.java`, `AuthServiceImpl.java`, `BookingServiceServiceImpl.java`, `ProviderProfileServiceImpl.java`, `UserServiceImpl.java`, `JwtAuthenticationFilter.java`, `GlobalExceptionHandler.java`, all entity and DTO classes |
| **frontend-developer** | Built Angular 17 components for login, register, view/edit profile, business profile setup, and service CRUD | `login.component.ts/html`, `register.component.ts/html`, `view-profile.component.ts/html`, `edit-profile.component.ts/html`, `business-profile.component.ts/html`, `add-service.component.ts/html`, `edit-service.component.ts/html`, `service-list.component.ts/html`, `navbar.component.ts`, all Angular core services and models |
| **database-designer** | Wrote Flyway migrations for users, provider_profiles, and services tables; added V4 migration with composite and role indexes | `V1__create_users_table.sql`, `V2__create_provider_profiles_table.sql`, `V3__create_services_table.sql`, `V4__add_performance_indexes.sql` |
| **qa-engineer** | Wrote unit tests for AuthService, BookingServiceService, and ProviderProfileService | `AuthServiceTest.java`, `BookingServiceServiceTest.java`, `ProviderProfileServiceTest.java` |
| **code-reviewer** | Reviewed backend implementation; identified missing `@Transactional`, double DB query in login, lack of pagination, and hardcoded JWT secret fallback | `AuthServiceImpl.java`, `BookingServiceServiceImpl.java`, `ServiceController.java` |
| **security-reviewer** | Identified hardcoded JWT secret risk and unauthorized-access gap; enforced required JWT_SECRET env var and updated SecurityConfig to permit `/actuator/**` | `SecurityConfig.java`, `application.yml` |
| **commit-logger** | Logged commit hashes (b05c125, fdc96e2) as Jira comments on all 5 tickets | SCRUM-13, SCRUM-14, SCRUM-15, SCRUM-16, SCRUM-17 |
| **status-updater** | Transitioned all 5 tickets from To Do → In Progress → Done in Jira | SCRUM-13, SCRUM-14, SCRUM-15, SCRUM-16, SCRUM-17 |
| **performance-checker** | Ran static performance analysis; recommended and applied `@Transactional`, `readOnly=true`, pagination, DB indexes, and Actuator setup | `AuthServiceImpl.java`, `BookingServiceServiceImpl.java`, `ServiceController.java`, `ServiceRepository.java`, `pom.xml`, `V4__add_performance_indexes.sql`, `application.yml` |

---

## Performance Test Results

### App Status
**UP** — Application running at http://localhost:8080  
Database: MySQL — **UP** (validated via `isValid()`)

### JVM Memory

| Metric | Value |
|--------|-------|
| Heap used (total all areas) | 202.6 MB |
| Heap max (total all areas) | 9,320 MB |
| Heap usage | 2.2% |
| Live threads | 25 |

> Memory usage is very healthy at 2.2% of max. The JVM has ample headroom.

### HTTP Response Times

| Endpoint | Total Requests | Avg Time | Max Time |
|----------|---------------|----------|----------|
| All tracked endpoints (aggregate) | 52 | 101.0 ms | 320.1 ms |

**Observed URIs:** `/api/auth/register`, `/api/auth/login`, `/api/users/me`, `/actuator/health`, `/actuator/metrics/{requiredMetricName}`, `UNKNOWN`  
**HTTP methods:** GET, POST, OPTIONS  
**Status codes seen:** 200, 201, 400, 401, 403, 409  
**Outcomes:** SUCCESS, CLIENT_ERROR (no 5xx errors recorded)

> The 320.1 ms max is likely the first cold-start request. Average of 101 ms is acceptable for a development environment with a local MySQL instance.

### DB Connection Pool (HikariPool-1)

| Metric | Value |
|--------|-------|
| Active connections | 0 |
| Idle connections | 10 |
| Pool utilization | 0% |

> All 10 pool connections are idle — expected under current light load. No connection starvation risk.

### Notes
- No 5xx server errors recorded in the HTTP metrics — all failures are client-side (4xx).
- The `UNKNOWN` URI entry in HTTP metrics is a Spring Boot placeholder for unmatched/actuator probe requests; not a concern.
- Actuator is exposed without authentication — recommended to restrict `/actuator/**` to internal network in production (noted for Sprint 2 security hardening).
- `hikaricp.connections.pending` and `hikaricp.connections.timeout` metrics were not queried; recommend adding these to the monitoring checklist in Sprint 2.

---

*Report generated by the report-generator agent*
