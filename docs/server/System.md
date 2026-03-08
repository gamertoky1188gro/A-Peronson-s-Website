# System - Server Feature Documentation (Manual)

## File Structure & Overview
- `server/routes/systemRoutes.js`: System metadata route registration.
- `server/controllers/systemController.js`: Static system metadata response.

## Code Explanation

### `systemRoutes.js`
- Registers:
  - `GET /api/system/meta` -> `systemMeta`.
- No auth middleware on this route (public endpoint).

### `systemController.js`
- Function `systemMeta(req, res)`:
  - returns static metadata object:
    - `name`
    - `version`
    - `modules` list
    - `design` description
- No external dependencies or DB calls.

## API Endpoints
- `GET /api/system/meta`
- Method: `GET`
- Request body/params: none.
- Response example:
```json
{
  "name": "GarTexHub",
  "version": "enterprise-ux-mvp",
  "modules": ["auth", "onboarding", "..."],
  "design": "LinkedIn-style professional blue/white trust interface"
}
```
- Status: `200`.
- Auth: public.

## Database / Data Model
- No database access.
- Response is static, code-defined metadata.

## Business Logic & Workflow
1. Client requests `/api/system/meta`.
2. Route dispatches to controller.
3. Controller returns static platform descriptor JSON.

## Error Handling & Validation
- No dynamic input validation needed (no request parameters).
- Minimal error surface.

## Security Considerations
- Endpoint is public and should only expose non-sensitive metadata.

## Extra Notes / Metadata
- Useful for diagnostics, version display, and capability introspection in client/admin tooling.
