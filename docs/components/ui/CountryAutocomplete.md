# CountryAutocomplete Component

**Type:** UI Autocomplete Component
**File:** `src/components/ui/CountryAutocomplete.jsx`

## 1) Purpose

Country autocomplete dropdown:
- Search/filter countries
- Keyboard navigation
- Exclude certain countries
- Max results limit

## 2) Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string | - | Selected value |
| `onChange` | function | - | Change callback |
| `options` | array | [] | Country options |
| `placeholder` | string | "" | Input placeholder |
| `required` | boolean | false | Required field |
| `id` | string | "country-autocomplete" | Element ID |
| `maxResults` | number | 8 | Max suggestions |
| `exclude` | array | [] | Excluded countries |

## 3) Features

- Case-insensitive filtering
- Keyboard navigation (arrows, enter, escape)
- Scroll into view for focused option

---

*Generated from source: src/components/ui/CountryAutocomplete.jsx*