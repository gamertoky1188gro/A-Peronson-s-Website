# Frontend Hooks Documentation

**Location:** `src/hooks/`

## Hooks Files

| # | Hook | Purpose | Status |
|---|------|---------|--------|
| 1 | useAdminConfig.js | Admin configuration | ✅ |
| 2 | useLocalStorageState.js | LocalStorage state | ✅ |
| 3 | useAnalyticsDashboard.js | Analytics data | ✅ |

---

## 1. useAdminConfig Hook

**File:** `src/hooks/useAdminConfig.js`

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `inventory` | object | Admin panel sections |
| `config` | object | UI configuration |
| `capabilities` | object | Feature capabilities |
| `actions` | object | Available actions |
| `actionGroups` | object | Grouped actions |

### Usage
```javascript
const { inventory, config, capabilities } = useAdminConfig();
```

---

## 2. useLocalStorageState Hook

**File:** `src/hooks/useLocalStorageState.js`

### Parameters

| Param | Type | Description |
|-------|------|-------------|
| `key` | string | LocalStorage key |
| `initialValue` | any | Initial value |

### Returns
- `[value, setValue]` - State and setter

### Usage
```javascript
const [theme, setTheme] = useLocalStorageState('theme', 'dark');
```

---

## 3. useAnalyticsDashboard Hook

**File:** `src/hooks/useAnalyticsDashboard.js`

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `loading` | boolean | Loading state |
| `error` | string | Error message |
| `data` | object | Analytics data |
| `refresh()` | function | Refresh data |

### Usage
```javascript
const { loading, data, refresh } = useAnalyticsDashboard();
```

---

*Generated from source: src/hooks/*