# Render Deployment Configuration

**File:** `render.yaml`

## Service

| Setting     | Value     |
| ----------- | --------- |
| Name        | gartexhub |
| Type        | web       |
| Runtime     | node      |
| Plan        | free      |
| Auto Deploy | commit    |

## Environment Variables

### Database

| Variable     | Value                                               |
| ------------ | --------------------------------------------------- |
| DATABASE_URL | postgresql://avnadmin@.../defaultdb?sslmode=require |
| PGSSLMODE    | require                                             |

### Admin Security

| Variable                 | Value       |
| ------------------------ | ----------- |
| ADMIN_MFA_CODE           | 123456      |
| ADMIN_IP_ALLOWLIST       | 0.0.0.0/0   |
| ADMIN_STEPUP_CODE        | stepup-7890 |
| ADMIN_STEPUP_MAX_MINUTES | 30          |

### AI Settings

| Variable                   | Value |
| -------------------------- | ----- |
| AI_HANDOFF_THRESHOLD       | 0.65  |
| AI_HALLUCINATION_THRESHOLD | 0.7   |

### App

| Variable   | Value      |
| ---------- | ---------- |
| NODE_ENV   | production |
| PORT       | 10000      |
| SERVE_DIST | true       |

---

_Generated from source: render.yaml_
