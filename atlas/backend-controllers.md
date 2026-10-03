# backend-controllers

- **Purpose**: Request handlers — parse input, enforce guards, delegate to services, shape responses.
- **Key Files**: `server/controllers/feedController.js`, `feedPostController.js`, `feedStreamController.js`, `feedUploadController.js`, `authController.js`, `adminController.js` + `adminMasterController.js` + `adminCatalogController.js` + `adminOpsController.js`, `searchController.js`, `logController.js`
- **Dependencies**: backend-services, backend-middleware, backend-utils
- **Dependents**: backend-routes
- **Exposes**: Per-domain handlers (~65 files); `logController` accepts `{level,message,data,…}` or `{batch:[…]}` and stamps user/role/IP into the log hub.
