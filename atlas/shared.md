# shared

- **Purpose**: Contracts shared by frontend and backend — lifecycles, taxonomy, validation (single source of truth).
- **Key Files**: `shared/dealLifecycle.js`, `shared/workflowLifecycle.js`, `shared/requirementValidation.js`, `shared/config/platformTaxonomy.js`, `shared/config/geo.js`, `shared/event-taxonomy.json`
- **Dependencies**: (none)
- **Dependents**: backend-services, frontend-pages
- **Exposes**: Deal-journey state machines, workflow transitions, requirement field validation, platform category taxonomy, geo config, analytics event taxonomy.
