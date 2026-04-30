# Prisma Database Schema

**File:** `prisma/schema.prisma`

## Generator

| Setting  | Value            |
| -------- | ---------------- |
| Provider | prisma-client-js |

## Datasource

| Setting  | Value               |
| -------- | ------------------- |
| Provider | postgresql          |
| URL      | env("DATABASE_URL") |

## Core Models

### User

- `id` - Primary key
- `name`, `email`, `password_hash`
- `role` - buyer, factory, buying_house, owner, admin, agent
- `status` - Account status
- `verified` - Verification status
- `subscription_status` - free/premium
- `wallet_balance_usd`, `wallet_restricted_usd`
- `profile` - JSON profile data
- `org_owner_id`, `member_id` - Org relationships
- `permissions`, `permission_matrix` - Access control

### Subscription

- `id`, `user_id`, `plan`
- `start_date`, `end_date`
- `auto_renew`

### Verification

- `user_id` - Primary key
- `role` - User role
- `documents` - JSON documents
- `verified`, `verified_at`
- `subscription_valid_until`

### Requirement (Buyer Request)

- `id`, `buyer_id`
- `title`, `description`
- `request_type` - garments default
- `verified_only`
- `specs`, `custom_fields` - JSON
- `quote_deadline`, `expires_at`

### Product

- `id`, `factory_id`
- `title`, `description`
- `category`, `industry`
- `pricing` - JSON

### Contract

- `id`, `buyer_id`, `factory_id`
- `status` - draft, pending, signed, completed
- `total_value_usd`

### Lead (CRM)

- `id`, `org_owner_id`
- `counterparty_user_id`
- `assigned_agent_id`
- `status`, `stage`

### Conversation / Message

- Chat functionality between users

### Notification

- User notifications

### FeedPost

- Community/feed posts

## Commands

```bash
# Generate client
npm run db:generate

# Run migrations
npm run db:migrate:dev

# Open studio
npm run db:studio
```

---

_Generated from source: prisma/schema.prisma_
