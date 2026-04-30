# Jest Configuration

**File:** `jest.config.cjs`

## Configuration

| Setting            | Value                                        |
| ------------------ | -------------------------------------------- |
| testEnvironment    | jsdom                                        |
| testMatch          | **/tests/**/_.test.js, **/tests/**/_.spec.js |
| transform          | babel-jest                                   |
| setupFilesAfterEnv | tests/setupTests.js                          |
| testTimeout        | 20000ms                                      |

## Module Mocks

- File mocks for: png, jpg, jpeg, gif, webp, avif, bmp, svg

## Module Extensions

- js, jsx, mjs, cjs, json, node

---

_Generated from source: jest.config.cjs_
