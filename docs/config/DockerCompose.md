# Docker Compose Configuration

**File:** `docker-compose.yml`

## Services

### 1. Database (PostgreSQL)

| Setting  | Value         |
| -------- | ------------- |
| Image    | postgres:16   |
| Ports    | 5432:5432     |
| Database | gartexhub     |
| User     | postgres      |
| Password | 123123455     |
| Volume   | postgres_data |

### 2. App (Application)

| Setting    | Value                    |
| ---------- | ------------------------ |
| Build      | .                        |
| Depends on | db                       |
| Ports      | 4000, 4173, 5173         |
| Command    | run.sh with preview mode |

### 3. OpenSearch

| Setting   | Value                               |
| --------- | ----------------------------------- |
| Image     | opensearchproject/opensearch:2.13.1 |
| Discovery | single-node                         |
| Security  | disabled                            |
| Ports     | 9200, 9600                          |
| Volume    | opensearch_data                     |

## Volumes

- `postgres_data` - PostgreSQL data
- `opensearch_data` - OpenSearch data

---

_Generated from source: docker-compose.yml_
