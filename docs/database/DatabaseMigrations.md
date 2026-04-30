# Database Migrations Overview

**Location:** `prisma/migrations/`

## Migration List

| Migration | Date | Description |
|-----------|------|-------------|
| `20260326140335_init_postgres` | 2026-03-26 | Initial PostgreSQL setup |
| `20260327151037_add_lc_fields` | 2026-03-27 | Add LC (Letter of Credit) fields |
| `20260405100000_crm_normalized_models` | 2026-04-05 | CRM normalized models |
| `20260405120000_add_fx_rates_and_normalized_prices` | 2026-04-05 | FX rates and normalized pricing |
| `20260405153000_crm_relations_event_log` | 2026-04-05 | CRM relations and event logging |
| `20260405170000_add_org_operations_models` | 2026-04-05 | Org operations models |
| `20260405183000_add_communication_policy_engine` | 2026-04-05 | Communication policy engine |
| `20260405203000_add_governance_modules` | 2026-04-05 | Governance modules |
| `20260406120000_add_workflow_lifecycle` | 2026-04-06 | Workflow lifecycle |
| `20260406153000_add_enterprise_ops_engine` | 2026-04-06 | Enterprise operations engine |
| `20260406170000_add_communication_policy_tables_v2` | 2026-04-06 | Communication policy tables v2 |
| `20260418120000_add_feed_posts` | 2026-04-18 | Feed posts support |

## Schema Overview

### Core Models
- **User** - User accounts with roles (buyer, factory, buying_house, owner, admin, agent)
- **Organization** - Company/organization records
- **Profile** - User profile data

### Business Models
- **Requirement** - Buyer requests/RFQs
- **Product** - Factory products
- **Contract** - Contracts between parties
- **Lead** - CRM leads
- **Conversation** - Chat conversations
- **Message** - Chat messages

### Supporting Models
- **Verification** - User verification status
- **Subscription** - Subscription plans
- **Wallet** - User wallet/credits
- **Notification** - User notifications
- **FeedPost** - Feed/community posts

### Governance Models
- **Policy** - Governance policies
- **PolicyVersion** - Policy versions
- **Enforcement** - Enforcement actions

## Commands

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate:dev

# Open Prisma Studio
npm run db:studio
```

---

*Generated from source: prisma/migrations/*