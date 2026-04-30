# Coupon Management

This doc is generated from source snapshots with `path:line` references.

## Mounted prefix

- `/api/coupons` -> `server/routes/couponRoutes.js:6` (router var: `router`)

## Routes (ultra-detailed)

### GET `/api/coupons`

- **Route definition:** `server/routes/couponRoutes.js:8`

```js
router.get("/", requireAuth, requireAdminSecurity, listCoupons);
```

- **Middleware stack (in order):**
  - `requireAuth`
  - `requireAdminSecurity`
- **Handler:** `listCoupons`
- **Controller file:** `server/controllers/couponController.js`
- **Access:** Admin only

---

### POST `/api/coupons`

- **Route definition:** `server/routes/couponRoutes.js:9`

```js
router.post("/", requireAuth, requireAdminSecurity, createCoupon);
```

- **Middleware stack (in order):**
  - `requireAuth`
  - `requireAdminSecurity`
- **Handler:** `createCoupon`
- **Controller file:** `server/controllers/couponController.js`
- **Access:** Admin only

---

## Service Layer

- **Coupon Service:** `server/services/couponService.js`

## Related Models

- Coupon (discount codes)
- CouponCampaign (campaign grouping)
- CouponRedemption (usage tracking)

---

_Generated from source: server/routes/couponRoutes.js_
