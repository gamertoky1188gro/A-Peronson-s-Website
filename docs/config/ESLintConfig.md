# ESLint Configuration

**File:** `eslint.config.js`

## Configuration

### Global Ignores
- `dist/` - Build output

### Server Rules (server/**/*.js)

| Setting | Value |
|---------|-------|
| extends | js.configs.recommended |
| ecmaVersion | latest |
| sourceType | module |
| globals | node |

### Server Rules
- `no-unused-vars`: error (varsIgnorePattern: "^[A-Z_].*", argsIgnorePattern: "^[A-Z_].*")

### Frontend Rules (src/**/*.{js,jsx})

| Setting | Value |
|---------|-------|
| extends | js.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite |
| ecmaVersion | 2020 |
| globals | browser |
| ecmaFeatures | jsx: true |

## Plugins

- `eslint-plugin-react-hooks` - React hooks linting
- `eslint-plugin-react-refresh` - React refresh support
- `globals` - Global variables

---

*Generated from source: eslint.config.js*