# Component Library — MeetAI CRM

All global components live in `src/components/`. Import them using the `@/components/` alias.

---

## Badge

**File:** `@/components/Badge`

A small label pill used to communicate status or priority at a glance.

```jsx
import Badge from '@/components/Badge';

<Badge variant="critical">Critical</Badge>
<Badge variant="high">High</Badge>
<Badge variant="success">Done</Badge>
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | string | `'default'` | Controls background + text color |
| `className` | string | `''` | Extra Tailwind classes to append |
| `children` | ReactNode | — | The label text |

### Variants

| Value | Color |
|---|---|
| `default` | Muted white |
| `critical` | Red |
| `high` | Yellow |
| `medium` | Blue |
| `low` | Muted white |
| `success` | Green |

### Customising behavior

**New variant** — add a key to the `variants` object inside `Badge.jsx`:
```js
urgent: 'bg-orange-500/20 text-orange-400',
```

**Custom one-off color** — pass a `className` to override without touching the file:
```jsx
<Badge className="bg-purple-500/20 text-purple-400">Beta</Badge>
```

---

## Button

**File:** `@/components/Button`

A primary or secondary action button with consistent sizing and hover states.

```jsx
import Button from '@/components/Button';

<Button onClick={handleSave}>Save</Button>
<Button variant="secondary" onClick={handleCancel}>Cancel</Button>
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary'` \| `'secondary'` | `'primary'` | Visual style |
| `onClick` | function | — | Click handler |
| `className` | string | `''` | Extra classes |
| `children` | ReactNode | — | Button label / content |

### Variants

| Value | Style |
|---|---|
| `primary` | White background, black text |
| `secondary` | Glass background, white text, subtle border |

### Customising behavior

**Add a `disabled` state:**
```jsx
// In Button.jsx, add to the <button> element:
disabled={disabled}
className={`... ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
```

**Add an icon:**
```jsx
import { Plus } from 'lucide-react';
<Button><Plus size={14} /> New Item</Button>
// The flex + gap-2 styles are already on the base button, icons align automatically.
```

**Full-width button:**
```jsx
<Button className="w-full justify-center">Submit</Button>
```

---

## Card

**File:** `@/components/Card`

A glass-effect container for grouping related content. Supports optional click interaction.

```jsx
import Card from '@/components/Card';

// Static card
<Card className="p-5">
  <p>Content here</p>
</Card>

// Clickable card (adds cursor-pointer + hover:bg lift)
<Card onClick={() => navigate('/detail/1')} className="p-5">
  <p>Click me</p>
</Card>
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `onClick` | function | — | Makes the card clickable when provided |
| `className` | string | `''` | Add padding, size, grid utilities here |
| `children` | ReactNode | — | Any content |

### Customising behavior

**Hover lift effect** — already applied in `ProjectsPage`. Add it to any card:
```jsx
<Card className="p-5 hover:-translate-y-1 transition-transform">
```

**Disable the inner glow** — the radial gradient is a `div` inside Card. Remove it or override via CSS if you need a completely flat surface:
```jsx
// In Card.jsx, delete the "Inner Glow Effect" div
```

**Fixed height card:**
```jsx
<Card className="p-5 h-48 flex flex-col justify-between">
```

---

## Input / PasswordInput

**File:** `@/components/Input`

Two exports: a standard text input and a password input with a show/hide toggle.

```jsx
import { Input, PasswordInput } from '@/components/Input';

<Input placeholder="Search…" value={query} onChange={e => setQuery(e.target.value)} />
<PasswordInput placeholder="Password" value={pwd} onChange={e => setPwd(e.target.value)} />
```

### Props

Both components accept all standard HTML `<input>` props via spread (`...props`).

| Prop | Type | Description |
|---|---|---|
| `className` | string | Extra classes appended to the input |
| `...props` | any | `type`, `placeholder`, `value`, `onChange`, `disabled`, etc. |

### Customising behavior

**Error state** — apply a red border by passing a class:
```jsx
<Input className={hasError ? 'border-red-500/50' : ''} />
```

**Disabled state** — use the native `disabled` prop; the styling will mute automatically via Tailwind's `disabled:` variant if you add it to the input class in `Input.jsx`:
```jsx
className={`... disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
```

**Different sizes** — override padding:
```jsx
<Input className="py-2 text-xs" />   // compact
<Input className="py-4 text-base" /> // large
```

---

## Label

**File:** `@/components/Label`

A small uppercase label, typically placed above inputs.

```jsx
import Label from '@/components/Label';

<Label htmlFor="project-name">Project Name</Label>
<Input id="project-name" />
```

### Props

| Prop | Type | Description |
|---|---|---|
| `className` | string | Extra classes |
| `children` | ReactNode | Label text |
| `...props` | any | Passed directly to `<label>` (e.g. `htmlFor`) |

### Customising behavior

**Required indicator** — add a dot after the text:
```jsx
<Label>Email <span className="text-red-400 text-[8px]">●</span></Label>
```

**Larger or lighter** — override classes:
```jsx
<Label className="text-xs text-white/60">Subtitle style</Label>
```

---

## TabBar

**File:** `@/components/TabBar`

A horizontal tab strip with an animated sliding underline indicator. Tabs marked `important: true` are always visible; others overflow into a "More" dropdown automatically.

```jsx
import TabBar from '@/components/TabBar';
import { useState } from 'react';

const tabs = [
  { label: 'Active',    count: 4, important: true },
  { label: 'Completed', count: 2, important: true },
  { label: 'Archived',  count: 9 }, // goes into "More" dropdown
];

const [activeTab, setActiveTab] = useState('Active');

<TabBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
```

### Props

| Prop | Type | Description |
|---|---|---|
| `tabs` | `TabConfig[]` | Array of tab definitions (see below) |
| `activeTab` | string | The currently active tab value (`id` or `label`) |
| `setActiveTab` | function | Called with the tab value when a tab is clicked |

### TabConfig object

| Field | Type | Required | Description |
|---|---|---|---|
| `label` | string | Yes | Display text |
| `id` | string | No | Use as value if you want a different key than `label` |
| `icon` | LucideIcon | No | Icon rendered left of the label |
| `count` | number | No | Badge count shown inside the tab |
| `important` | boolean | No | `true` = always visible; `false`/omitted = in dropdown |

### Customising behavior

**All tabs always visible** (no dropdown) — just don't set `important` on any tab; all will be treated as visible:
```js
const tabs = [
  { label: 'One' },
  { label: 'Two' },
  { label: 'Three' },
];
```

**Icon-only tabs** — set `label` to an empty string and provide an `icon`:
```js
{ label: '', icon: LayoutGrid, id: 'grid' }
```

**Active tab on mount** — initialise `useState` with the matching label or id:
```js
const [activeTab, setActiveTab] = useState('Active');
```

**Sync with URL params:**
```js
const [searchParams, setSearchParams] = useSearchParams();
const activeTab = searchParams.get('tab') || 'Active';
const setActiveTab = (val) => setSearchParams({ tab: val });
```

---

## ProtectedRoute

**File:** `@/components/ProtectedRoute`

Reads `state.auth.user` from Redux. Redirects to `/login` when no user is present. Used to wrap private routes in the router.

```jsx
import ProtectedRoute from '@/components/ProtectedRoute';

// Wrapping a route subtree (Outlet style)
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/projects"  element={<ProjectsPage />} />
</Route>

// Wrapping a single component directly
<Route
  path="/settings"
  element={
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  }
/>
```

### Props

| Prop | Type | Description |
|---|---|---|
| `children` | ReactNode | If provided, renders `children` directly when authenticated |

When `children` is omitted, it renders `<Outlet />` so nested routes work.

### Customising behavior

**Change the redirect target** — edit the `<Navigate to="..." />` line in `ProtectedRoute.jsx`:
```jsx
return <Navigate to="/auth/login" replace />;
```

**Add a loading state** — if your auth check is async, add a `loading` selector:
```jsx
const { user, loading } = useSelector(state => state.auth);
if (loading) return <FullPageSpinner />;
if (!user)   return <Navigate to="/login" replace />;
```

**Role-based access** — extend the component with a `requiredRole` prop:
```jsx
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useSelector(state => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/403" replace />;
  return children ?? <Outlet />;
};
```

---

## Form (+ individual field components)

**File:** `@/components/Form`

A fully controlled form container with built-in validation. Also exports every field component individually for use in custom layouts.

### Default export — `<Form />`

Renders a full form from a declarative `fields` array. Handles state, validation, and submission in one place.

```jsx
import Form from '@/components/Form';
import { useState } from 'react';

const FIELDS = [
  { key: 'name',     type: 'text',     label: 'Full Name',    required: true, placeholder: 'Jane Doe' },
  { key: 'email',    type: 'email',    label: 'Work Email',   required: true },
  { key: 'role',     type: 'dropdown', label: 'Role',         required: true,
    options: ['Engineer', 'Designer', 'Manager'] },
  { key: 'tags',     type: 'checkbox', label: 'Focus Areas',
    options: ['Frontend', 'Backend', 'Mobile'] },
  { key: 'bio',      type: 'textarea', label: 'Bio',          rows: 4 },
  { key: 'website',  type: 'url',      label: 'Portfolio URL' },
  { key: 'avatar',   type: 'image',    label: 'Avatar',       required: true },
  { key: 'resume',   type: 'document', label: 'Resume' },
  { key: 'agree',    type: 'checkbox-toggle', label: 'I agree to the terms',
    description: 'This action cannot be undone.', required: true },
];

export default function NewMemberForm() {
  const [values, setValues] = useState({});

  const handleChange = (key, val) => setValues(prev => ({ ...prev, [key]: val }));
  const handleSubmit = (data) => console.log('Submitted:', data);

  return (
    <Form
      fields={FIELDS}
      values={values}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitLabel="Create Member"
    />
  );
}
```

### Form props

| Prop | Type | Default | Description |
|---|---|---|---|
| `fields` | `FieldConfig[]` | `[]` | Declarative field definitions |
| `values` | object | `{}` | Controlled form state |
| `onChange` | `(key, value) => void` | — | Called on every field change |
| `onSubmit` | `(values) => void` | — | Called after all validation passes |
| `errors` | object | `{}` | External errors, e.g. from an API response |
| `submitLabel` | string | `'Submit'` | Text on the submit button |
| `loading` | boolean | `false` | Shows spinner + disables button during async submit |
| `className` | string | `''` | Extra classes on the `<form>` element |

### FieldConfig — all supported keys

| Key | Type | Required | Description |
|---|---|---|---|
| `key` | string | Yes | Unique identifier; maps to `values[key]` |
| `type` | string | Yes | Field type (see table below) |
| `label` | string | No | Label shown above the field |
| `placeholder` | string | No | Input placeholder text |
| `required` | boolean | No | Enables built-in required validation |
| `options` | `string[]` or `{ label, value }[]` | For dropdown/radio/checkbox | Selectable options |
| `hint` | string | No | Small helper text shown to the right of the label |
| `description` | string | No | Secondary text for `checkbox-toggle` fields |
| `rows` | number | No | Row count for `textarea` (default `4`) |
| `accept` | string | No | MIME type filter for `file` / `files` (default `*/*`) |
| `maxFiles` | number | No | Max number of files for multi-upload (default `10`) |
| `maxSizeMB` | number | No | Max file size in MB (default `10`) |
| `className` | string | No | Extra classes on the field wrapper |

### Field types

| `type` value | Component rendered | Value type |
|---|---|---|
| `text` | Text input | string |
| `email` | Text input (email validation) | string |
| `password` | Text input with show/hide toggle | string |
| `number` | Number input | string |
| `textarea` | Multi-line textarea | string |
| `dropdown` | Styled dropdown with search | string |
| `radio` | Pill-style radio group | string |
| `checkbox` | Multi-select checkbox list | string[] |
| `checkbox-toggle` | Single on/off toggle with label | boolean |
| `url` | URL input (validates `https://` format) | string |
| `image` | Single image upload (drag & drop) | File[] |
| `images` | Multiple image upload (drag & drop) | File[] |
| `document` | Single document upload | File[] |
| `documents` | Multiple document upload | File[] |
| `file` | Single generic file upload | File[] |
| `files` | Multiple generic file upload | File[] |

### Named exports — individual field components

Use these when you need a custom layout that doesn't fit the declarative `fields` array.

```jsx
import {
  TextField, TextareaField, DropdownField,
  RadioField, CheckboxField, CheckboxToggle,
  UrlField, FileUploadField
} from '@/components/Form';

// Example: two fields side-by-side
<div className="grid grid-cols-2 gap-4">
  <TextField label="First Name" required value={first} onChange={setFirst} error={errors.first} />
  <TextField label="Last Name"  value={last}  onChange={setLast} />
</div>
```

#### Shared props on all field components

| Prop | Type | Description |
|---|---|---|
| `label` | string | Label shown above the field |
| `required` | boolean | Shows a red dot on the label |
| `value` | any | Controlled value |
| `onChange` | function | Called with the new value (not the event) |
| `error` | string | Error message shown below the field |
| `hint` | string | Helper text next to the label |
| `className` | string | Extra classes on the wrapper div |

#### FileUploadField — extra props

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `'image'` \| `'document'` \| `'file'` | `'file'` | Changes icon, accept type, and hint text |
| `multiple` | boolean | `false` | Allows multiple file selection |
| `accept` | string | derived from `mode` | Override MIME filter |
| `maxFiles` | number | `10` | Cap on number of files |
| `maxSizeMB` | number | `10` | Max size per file |

### Validation rules (built-in)

| Field type | `required` check | Extra format check |
|---|---|---|
| `text`, `textarea`, `password`, `number` | Non-empty string | — |
| `email` | Non-empty | Valid email format |
| `url` | Non-empty | Must parse as a valid URL |
| `dropdown`, `radio` | Non-null selection | — |
| `checkbox` | At least one item selected | — |
| `checkbox-toggle` | Must be `true` | — |
| `image`, `images`, `document`, `documents`, `file`, `files` | At least one file | — |

Errors clear field-by-field as the user corrects them. External errors (from an API) are merged with internal errors and follow the same display pattern.

### Customising behavior

**Inject server errors after a failed submission:**
```js
const [serverErrors, setServerErrors] = useState({});

const handleSubmit = async (data) => {
  const res = await api.createProject(data);
  if (!res.ok) {
    setServerErrors({ name: 'This name is already taken' });
  }
};

<Form errors={serverErrors} ... />
```

**Loading state during async submit:**
```jsx
const [loading, setLoading] = useState(false);

const handleSubmit = async (data) => {
  setLoading(true);
  await api.save(data);
  setLoading(false);
};

<Form loading={loading} ... />
```

**Dropdown with object options** (label shown, value stored):
```js
{ key: 'status', type: 'dropdown', label: 'Status',
  options: [
    { label: 'Active',    value: 'active' },
    { label: 'On Hold',   value: 'on_hold' },
    { label: 'Completed', value: 'completed' },
  ]
}
```

**Pre-populate form values** (edit mode):
```js
const [values, setValues] = useState({
  name:   project.name,
  status: project.status,
  tags:   project.tags,   // string[] for checkbox
  agree:  false,          // always reset toggles
});
```

**Lay out fields in columns:**
```jsx
<div className="grid grid-cols-2 gap-4">
  <TextField label="First" ... className="col-span-1" />
  <TextField label="Last"  ... className="col-span-1" />
  <TextareaField label="Bio" ... className="col-span-2" />
</div>
```

---

## Design tokens quick reference

These are the visual conventions shared across all components. Match them when building new components.

| Token | Value |
|---|---|
| Card background | `bg-white/[0.08]` |
| Card border | `border-white/[0.15]` |
| Card radius | `rounded-2xl` |
| Input background | `bg-white/[0.05]` |
| Input border | `border-white/[0.1]` |
| Input radius | `rounded-xl` |
| Label style | `text-[10px] font-black uppercase tracking-widest text-white/40` |
| Body text muted | `text-white/50` |
| Hover card bg | `bg-white/[0.12]` |
| Focus border | `border-white/[0.3]` |
| Danger color | `text-red-400 / bg-red-500/20` |
| Success color | `text-green-400 / bg-green-500/20` |
| Submit button | `bg-white text-black font-black uppercase tracking-widest rounded-xl` |