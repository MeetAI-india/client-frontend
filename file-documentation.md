# Project File Documentation

## Index

- **Root Config Files**
  - [`project-structure.md`](#file-project-structuremd)
- **Editor Config**
  - [`.vscode/settings.json`](#file-vscodesettingsjson)
- **Source — Entry**
  - [`src/index.css`](#file-srcindexcss)
  - [`src/main.jsx`](#file-srcmainjsx)
- **Source — App**
  - [`src/app/app.jsx`](#file-srcappappjsx)
  - [`src/app/provider.jsx`](#file-srcappproviderjsx)
  - [`src/app/router.jsx`](#file-srcapprouterjsx)
- **Source — Components**
  - [`src/components/Badge.jsx`](#file-srccomponentsbadgejsx)
  - [`src/components/Button.jsx`](#file-srccomponentsbuttonjsx)
  - [`src/components/Card.jsx`](#file-srccomponentscardjsx)
  - [`src/components/Dropdown.jsx`](#file-srccomponentsdropdownjsx)
  - [`src/components/Form.jsx`](#file-srccomponentsformjsx)
  - [`src/components/Input.jsx`](#file-srccomponentsinputjsx)
  - [`src/components/Label.jsx`](#file-srccomponentslabeljsx)
  - [`src/components/Modal.jsx`](#file-srccomponentsmodaljsx)
  - [`src/components/ProtectedRoute.jsx`](#file-srccomponentsprotectedroutejsx)
  - [`src/components/TabBar.jsx`](#file-srccomponentstabbarjsx)
- **Source — Layout**
  - [`src/components/layout/DashboardLayout.jsx`](#file-srccomponentslayoutdashboardlayoutjsx)
  - [`src/components/layout/Sidebar.jsx`](#file-srccomponentslayoutsidebarjsx)
- **Source — Config**
  - [`src/config/api-client.js`](#file-srcconfigapi-clientjs)
  - [`src/config/api.js`](#file-srcconfigapijs)
  - [`src/config/csrf.js`](#file-srcconfigcsrfjs)
- **Source — Hooks**
  - [`src/hooks/use-mobile.js`](#file-srchooksuse-mobilejs)
- **Source — Lib**
  - [`src/lib/toast.js`](#file-srclibtoastjs)
  - [`src/lib/utils.js`](#file-srclibutilsjs)
- **Source — Stores**
  - [`src/stores/authSlice.js`](#file-srcstoresauthslicejs)
  - [`src/stores/store.js`](#file-srcstoresstorejs)
- **Features — Auth**
  - [`src/features/auth/api/login.js`](#file-srcfeaturesauthapiloginjs)
  - [`src/features/auth/api/me.js`](#file-srcfeaturesauthapimejs)
  - [`src/features/auth/components/LoginCard.jsx`](#file-srcfeaturesauthcomponentslogincardjsx)
  - [`src/features/auth/hooks/useAuth.js`](#file-srcfeaturesauthhooksuseauthjs)
  - [`src/features/auth/pages/ProfilePage.jsx`](#file-srcfeaturesauthpagesprofilepagejsx)
  - [`src/features/auth/routes/login.jsx`](#file-srcfeaturesauthroutesloginjsx)
- **Features — Dashboard**
  - [`src/features/dashboard/pages/DashboardPage.jsx`](#file-srcfeaturesdashboardpagesdashboardpagejsx)
- **Features — Meetings**
  - [`src/features/meetings/api/meeting.js`](#file-srcfeaturesmeetingsapimeetingjs)
  - [`src/features/meetings/components/MeetingInfoTab.jsx`](#file-srcfeaturesmeetingscomponentsmeetinginfotabjsx)
  - [`src/features/meetings/components/MeetingsTab.jsx`](#file-srcfeaturesmeetingscomponentsmeetingstabjsx)
  - [`src/features/meetings/constants.js`](#file-srcfeaturesmeetingsconstantsjs)
  - [`src/features/meetings/pages/MeetingDetailPage.jsx`](#file-srcfeaturesmeetingspagesmeetingdetailpagejsx)
  - [`src/features/meetings/pages/MeetingsPage.jsx`](#file-srcfeaturesmeetingspagesmeetingspagejsx)
- **Features — Projects**
  - [`src/features/projects/api/projects.js`](#file-srcfeaturesprojectsapiprojectsjs)
  - [`src/features/projects/components/ProjectInfoTab.jsx`](#file-srcfeaturesprojectscomponentsprojectinfotabjsx)
  - [`src/features/projects/components/TasksTab.jsx`](#file-srcfeaturesprojectscomponentstaskstabjsx)
  - [`src/features/projects/components/TeamTab.jsx`](#file-srcfeaturesprojectscomponentsteamtabjsx)
  - [`src/features/projects/constants.js`](#file-srcfeaturesprojectsconstantsjs)
  - [`src/features/projects/pages/ProjectDetailPage.jsx`](#file-srcfeaturesprojectspagesprojectdetailpagejsx)
  - [`src/features/projects/pages/ProjectsPage.jsx`](#file-srcfeaturesprojectspagesprojectspagejsx)
- **Features — Reports**
  - [`src/features/reports/pages/ReportsPage.jsx`](#file-srcfeaturesreportspagesreportspagejsx)
- **Features — Settings**
  - [`src/features/settings/pages/SettingsPage.jsx`](#file-srcfeaturessettingspagessettingspagejsx)
- **Features — Tasks**
  - [`src/features/tasks/pages/TasksPage.jsx`](#file-srcfeaturestaskspagestaskspagejsx)
- **Features — Team**
  - [`src/features/team/api/users.js`](#file-srcfeaturesteamapiusersjs)
  - [`src/features/team/constants.js`](#file-srcfeaturesteamconstantsjs)
  - [`src/features/team/pages/TeamPage.jsx`](#file-srcfeaturesteampagesteampagejsx)

---

## File: `project-structure.md`

| Field                  | Details                                                                                                                                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `project-structure.md`                                                                                                                                                                                                     |
| Location               | `/client-frontend/project-structure.md`                                                                                                                                                                                    |
| Type                   | Documentation                                                                                                                                                                                                              |
| Purpose                | Document the recommended feature-based folder architecture and import rules                                                                                                                                                |
| Summary                | Explains the `src/app`, `src/components`, `src/features`, `src/hooks`, `src/lib`, `src/stores`, `src/utils` layering, with ESLint configuration examples for enforcing unidirectional imports and cross-feature isolation. |
| Key Responsibilities   | Guide developers on architectural conventions and import restrictions.                                                                                                                                                     |
| Exports                | None                                                                                                                                                                                                                       |
| Dependencies           | None                                                                                                                                                                                                                       |
| Used By                | Developers adhering to project conventions                                                                                                                                                                                 |
| What Breaks If Changed | Only documentation; no code impact.                                                                                                                                                                                        |
| Related Files          | `README.md`                                                                                                                                                                                                                |

---

## File: `src/index.css`

| Field                  | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `index.css`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Location               | `/client-frontend/src/index.css`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Type                   | Global CSS stylesheet                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Purpose                | Import fonts, Tailwind directives, define design tokens and global styles                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Summary                | Imports Google Fonts (Playfair Display) and Inter variable font; sets up Tailwind base/components/utilities; defines CSS custom properties for light and dark themes (background, foreground, primary, secondary, muted, accent, destructive, border, input, ring, sidebar colors, radius); applies base resets (`* { border-border }`, body bg/text, `html, body { h-full overflow-hidden }` — disables page-level scroll app-wide so only designated inner containers like `DashboardLayout`'s `<main>` scroll); includes fadeIn and fadeOut keyframes. |
| Key Responsibilities   | Bootstrap the design system, theme variables, Tailwind integration, global resets, and the app-wide scroll lock.                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Exports                | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Dependencies           | External: Google Fonts, `@fontsource-variable/inter`. Internal: `tailwindcss`                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Used By                | `src/main.jsx` (imported directly)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| What Breaks If Changed | Removing Tailwind directives breaks all utility classes; changing CSS custom properties alters the entire visual design; removing font imports changes typography; removing `html, body { overflow: hidden }` re-enables page scroll, which reveals empty space below any route whose content is shorter than the viewport.                                                                                                                                                                                                                               |
| Related Files          | `src/main.jsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

---

## File: `src/main.jsx`

| Field                  | Details                                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `main.jsx`                                                                                                                         |
| Location               | `/client-frontend/src/main.jsx`                                                                                                    |
| Type                   | React entry point                                                                                                                  |
| Purpose                | Mount the React app into the DOM                                                                                                   |
| Summary                | Creates a React root on `#root`, renders `<App>` wrapped in `<React.StrictMode>` and `<AppProvider>` (Redux). Imports `index.css`. |
| Key Responsibilities   | Bootstrap the React application.                                                                                                   |
| Exports                | None (side-effect module)                                                                                                          |
| Dependencies           | Internal: `src/app/app.jsx`, `src/app/provider.jsx`, `src/index.css`. External: `react`, `react-dom`.                              |
| Used By                | Vite entry (`<script type="module" src="/src/main.jsx">` in project root)                                                          |
| What Breaks If Changed | Changing the root element ID or removing the provider breaks the entire app.                                                       |
| Related Files          | `src/app/app.jsx`, `src/app/provider.jsx`                                                                                          |

---

## File: `src/app/app.jsx`

| Field                  | Details                                                                                                                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| File Name              | `app.jsx`                                                                                                                                                                                                                |
| Location               | `/client-frontend/src/app/app.jsx`                                                                                                                                                                                       |
| Type                   | React root component                                                                                                                                                                                                     |
| Purpose                | Main app component that dispatches user fetch on mount and renders router + toast notifications                                                                                                                          |
| Summary                | Uses `useDispatch` to call `fetchUser()` on mount; renders `AppRouter` and a `ToastContainer` (dark theme, top-right, 3s auto-close); includes a global background layer with radial gradient, noise, and image overlay. |
| Key Responsibilities   | Bootstrap auth state on mount, provide toast notification container, render routing tree.                                                                                                                                |
| Exports                | Default: `App` component                                                                                                                                                                                                 |
| Dependencies           | Internal: `src/stores/authSlice` (fetchUser), `src/app/router.jsx`. External: `react`, `react-redux`, `react-toastify`.                                                                                                  |
| Used By                | `src/main.jsx`                                                                                                                                                                                                           |
| What Breaks If Changed | Removing `fetchUser()` dispatch breaks initial auth check; removing ToastContainer suppresses all toasts.                                                                                                                |
| Related Files          | `src/main.jsx`, `src/app/router.jsx`, `src/stores/authSlice.js`                                                                                                                                                          |

---

## File: `src/app/provider.jsx`

| Field                  | Details                                                                                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `provider.jsx`                                                                                                                                       |
| Location               | `/client-frontend/src/app/provider.jsx`                                                                                                              |
| Type                   | React context provider wrapper                                                                                                                       |
| Purpose                | Wrap the app with Redux Provider                                                                                                                     |
| Summary                | Exports `AppProvider` which renders `<Provider store={store}>{children}</Provider>`, making the Redux store available throughout the component tree. |
| Key Responsibilities   | Provide Redux store context to the entire app.                                                                                                       |
| Exports                | Named: `AppProvider`                                                                                                                                 |
| Dependencies           | Internal: `src/stores/store.js`. External: `react-redux`.                                                                                            |
| Used By                | `src/main.jsx`                                                                                                                                       |
| What Breaks If Changed | Removing the Provider breaks all `useSelector`/`useDispatch` calls across the app.                                                                   |
| Related Files          | `src/stores/store.js`, `src/main.jsx`                                                                                                                |

---

## File: `src/app/router.jsx`

| Field                  | Details                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `router.jsx`                                                                                                                                                                                                                                                                                                                                                                                                         |
| Location               | `/client-frontend/src/app/router.jsx`                                                                                                                                                                                                                                                                                                                                                                                |
| Type                   | React Router configuration                                                                                                                                                                                                                                                                                                                                                                                           |
| Purpose                | Define all application routes with lazy-loaded pages and auth gating                                                                                                                                                                                                                                                                                                                                                 |
| Summary                | Uses `React.lazy` for all page components; renders `BrowserRouter` with routes: `/login` (public), protected routes under `ProtectedRoute` + `DashboardLayout` for `/dashboard`, `/projects`, `/projects/:id`, `/tasks`, `/meetings`, `/meetings/:id`, `/team`, `/settings`; redirects `/` based on auth state, `*` redirects to `/`. Shows `LoadingFallback` spinner during auth initialization and route suspense. |
| Key Responsibilities   | Route mapping, lazy loading, auth gating, fallback UI during loading.                                                                                                                                                                                                                                                                                                                                                |
| Exports                | Default: `AppRouter`                                                                                                                                                                                                                                                                                                                                                                                                 |
| Dependencies           | Internal: `src/components/ProtectedRoute`, `src/components/layout/DashboardLayout`, all lazy-loaded page components from `src/features/*`. External: `react`, `react-router-dom`, `react-redux`.                                                                                                                                                                                                                     |
| Used By                | `src/app/app.jsx`                                                                                                                                                                                                                                                                                                                                                                                                    |
| What Breaks If Changed | Removing routes breaks navigation; changing `ProtectedRoute` logic could bypass auth; incorrect lazy imports cause crashes.                                                                                                                                                                                                                                                                                          |
| Related Files          | `src/app/app.jsx`, `src/components/ProtectedRoute.jsx`, all page files                                                                                                                                                                                                                                                                                                                                               |

---

## File: `src/components/Badge.jsx`

| Field                  | Details                                                                                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `Badge.jsx`                                                                                                                                                               |
| Location               | `/client-frontend/src/components/Badge.jsx`                                                                                                                               |
| Type                   | Shared UI component                                                                                                                                                       |
| Purpose                | Render a small colored label/pill for status or priority display                                                                                                          |
| Summary                | Takes `children`, `className`, and `variant` props; supports variants: `default`, `critical`, `high`, `medium`, `low`, `success`. Applies matching bg/text color classes. |
| Key Responsibilities   | Display status/priority badges consistently across the UI.                                                                                                                |
| Exports                | Default: `Badge`                                                                                                                                                          |
| Dependencies           | External: `react`                                                                                                                                                         |
| Used By                | `MeetingsPage`, `MeetingDetailPage`, `MeetingInfoTab`, `MeetingsTab`, `ProjectDetailPage`, `ProjectsPage`, `TasksPage`, `TasksTab`, `TeamPage`, `TeamTab`                 |
| What Breaks If Changed | Changing variant styles affects all badge displays across the app.                                                                                                        |
| Related Files          | None                                                                                                                                                                      |

---

## File: `src/components/Button.jsx`

| Field                  | Details                                                                                                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `Button.jsx`                                                                                                                                                                            |
| Location               | `/client-frontend/src/components/Button.jsx`                                                                                                                                            |
| Type                   | Shared UI component                                                                                                                                                                     |
| Purpose                | Render a styled button with primary/secondary variants                                                                                                                                  |
| Summary                | Supports `children`, `onClick`, `className`, `variant` (`primary`/`secondary`), `disabled`, and `type` props. Uses uppercase tracking-widest text, rounded-xl, shadow, and flex layout. |
| Key Responsibilities   | Provide consistent button styling across the app.                                                                                                                                       |
| Exports                | Default: `Button`                                                                                                                                                                       |
| Dependencies           | External: `react`                                                                                                                                                                       |
| Used By                | `DashboardLayout`, `LoginCard`, `MeetingsPage`, `MeetingsTab`, `MeetingDetailPage`, `ProjectsPage`, `ProjectDetailPage`, `SettingsPage`, `TasksPage`, `TeamPage`, `TeamTab`             |
| What Breaks If Changed | Changing styles affects all button instances; removing disabled styling breaks UX.                                                                                                      |
| Related Files          | None                                                                                                                                                                                    |

---

## File: `src/components/Card.jsx`

| Field                  | Details                                                                                                                                                                                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `Card.jsx`                                                                                                                                                                                                                                          |
| Location               | `/client-frontend/src/components/Card.jsx`                                                                                                                                                                                                          |
| Type                   | Shared UI component                                                                                                                                                                                                                                 |
| Purpose                | Render a glass-effect container card                                                                                                                                                                                                                |
| Summary                | A container div with glass-style background (`bg-white/[0.08]`), border, rounded-2xl, shadow, inner glow radial gradient, and optional click handler that adds hover/cursor effects. Supports `children`, `className`, `onClick`, and spread props. |
| Key Responsibilities   | Provide consistent card containers across all pages.                                                                                                                                                                                                |
| Exports                | Default: `Card`                                                                                                                                                                                                                                     |
| Dependencies           | External: `react`                                                                                                                                                                                                                                   |
| Used By                | `DashboardPage`, `MeetingsPage`, `MeetingsTab`, `ProjectInfoTab`, `ProjectsPage`, `SettingsPage`, `TasksPage`, `TasksTab`, `TeamPage`, `TeamTab`                                                                                                    |
| What Breaks If Changed | Changing card styles affects every page that uses cards.                                                                                                                                                                                            |
| Related Files          | None                                                                                                                                                                                                                                                |

---

## File: `src/components/Dropdown.jsx`

| Field                  | Details                                                                                                                                                                                                                                                                                      |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `Dropdown.jsx`                                                                                                                                                                                                                                                                               |
| Location               | `/client-frontend/src/components/Dropdown.jsx`                                                                                                                                                                                                                                               |
| Type                   | Shared UI component                                                                                                                                                                                                                                                                          |
| Purpose                | Render a premium dropdown select with custom trigger support                                                                                                                                                                                                                                 |
| Summary                | A controlled dropdown with `label`, `options`, `value`, `onChange`, `className`, `variant` (primary/secondary), and optional `trigger` (custom trigger element). Includes click-outside-to-close behavior. Portaled dropdown menu with animation, filter icon, and selected-state indicator. |
| Key Responsibilities   | Provide filter/select dropdowns across the app.                                                                                                                                                                                                                                              |
| Exports                | Default: `Dropdown`                                                                                                                                                                                                                                                                          |
| Dependencies           | External: `react`, `lucide-react` (ChevronDown, Filter)                                                                                                                                                                                                                                      |
| Used By                | `MeetingsPage`, `MeetingsTab`                                                                                                                                                                                                                                                                |
| What Breaks If Changed | Breaking the portal or click-outside logic breaks the dropdown UX.                                                                                                                                                                                                                           |
| Related Files          | None                                                                                                                                                                                                                                                                                         |

---

## File: `src/components/Form.jsx`

| Field                  | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `Form.jsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Location               | `/client-frontend/src/components/Form.jsx`                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Type                   | Shared UI component (complex)                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Purpose                | Provide a declarative, fully controlled form system with built-in validation                                                                                                                                                                                                                                                                                                                                                                                               |
| Summary                | Exports a default `Form` component (renders from `fields` array config) and named individual field components: `TextField`, `TextareaField`, `MarkdownField`, `DropdownField`, `RadioField`, `CheckboxField`, `CheckboxToggle`, `UrlField`, `FileUploadField`. Supports validation (required, email, URL format), external error merging, two-column layout (`col: "left"/"right"`), loading state, and all standard input types including file upload with drag-and-drop. |
| Key Responsibilities   | Handle form rendering, validation, submission, and error display across the app.                                                                                                                                                                                                                                                                                                                                                                                           |
| Exports                | Default: `Form`. Named: `TextField`, `TextareaField`, `MarkdownField`, `DropdownField`, `RadioField`, `CheckboxField`, `CheckboxToggle`, `UrlField`, `FileUploadField`                                                                                                                                                                                                                                                                                                     |
| Dependencies           | External: `react`, `react-dom`, `lucide-react`                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Used By                | `MeetingsPage`, `MeetingsTab`, `MeetingDetailPage`, `ProjectDetailPage`, `ProjectsPage`, `TeamPage`, `TeamTab`                                                                                                                                                                                                                                                                                                                                                             |
| What Breaks If Changed | Breaking validation or field rendering affects all forms across the app (create/edit project, meeting, user, member forms).                                                                                                                                                                                                                                                                                                                                                |
| Related Files          | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

---

## File: `src/components/Input.jsx`

| Field                  | Details                                                                                                                                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `Input.jsx`                                                                                                                                                                                                |
| Location               | `/client-frontend/src/components/Input.jsx`                                                                                                                                                                |
| Type                   | Shared UI component                                                                                                                                                                                        |
| Purpose                | Provide styled text and password input fields                                                                                                                                                              |
| Summary                | Exports `Input` (standard text input with glass styling) and `PasswordInput` (input with show/hide toggle using Eye/EyeOff icons from lucide-react). Both accept all standard HTML input props via spread. |
| Key Responsibilities   | Provide consistent text/password input styling.                                                                                                                                                            |
| Exports                | Named: `Input`, `PasswordInput`                                                                                                                                                                            |
| Dependencies           | External: `react`, `lucide-react`                                                                                                                                                                          |
| Used By                | `LoginCard`                                                                                                                                                                                                |
| What Breaks If Changed | Changing styles breaks the login form's visual consistency.                                                                                                                                                |
| Related Files          | None                                                                                                                                                                                                       |

---

## File: `src/components/Label.jsx`

| Field                  | Details                                                                                                                                                                |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `Label.jsx`                                                                                                                                                            |
| Location               | `/client-frontend/src/components/Label.jsx`                                                                                                                            |
| Type                   | Shared UI component                                                                                                                                                    |
| Purpose                | Render a styled uppercase label element                                                                                                                                |
| Summary                | A `<label>` element with `text-[10px] font-black uppercase tracking-widest text-white/40` styling; accepts `children`, `className`, and spread props (e.g. `htmlFor`). |
| Key Responsibilities   | Provide consistent label styling for form inputs.                                                                                                                      |
| Exports                | Default: `Label`                                                                                                                                                       |
| Dependencies           | External: `react`                                                                                                                                                      |
| Used By                | `LoginCard`                                                                                                                                                            |
| What Breaks If Changed | Changing label style breaks form consistency.                                                                                                                          |
| Related Files          | None                                                                                                                                                                   |

---

## File: `src/components/Modal.jsx`

| Field                  | Details                                                                                                                                                                                                                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `Modal.jsx`                                                                                                                                                                                                                                                                                    |
| Location               | `/client-frontend/src/components/Modal.jsx`                                                                                                                                                                                                                                                    |
| Type                   | Shared UI component                                                                                                                                                                                                                                                                            |
| Purpose                | Render a reusable overlay modal dialog                                                                                                                                                                                                                                                         |
| Summary                | A portal-based modal with backdrop (blur, dark overlay), animated entry, close on Escape/backdrop click/X button, body scroll lock, configurable `size` (sm/md/lg/xl), optional `description`, optional `footer`, and optional `hideClose`. Injects modal keyframe animations at module level. |
| Key Responsibilities   | Provide modal dialogs for create/edit forms and management panels.                                                                                                                                                                                                                             |
| Exports                | Default: `Modal`                                                                                                                                                                                                                                                                               |
| Dependencies           | External: `react`, `react-dom`, `lucide-react` (X)                                                                                                                                                                                                                                             |
| Used By                | `MeetingsPage`, `MeetingsTab`, `MeetingDetailPage`, `ProjectDetailPage`, `ProjectsPage`, `TeamPage`, `TeamTab`                                                                                                                                                                                 |
| What Breaks If Changed | Breaking the portal, Escape handler, or scroll lock degrades modal UX across the app.                                                                                                                                                                                                          |
| Related Files          | None                                                                                                                                                                                                                                                                                           |

---

## File: `src/components/ProtectedRoute.jsx`

| Field                  | Details                                                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `ProtectedRoute.jsx`                                                                                                                   |
| Location               | `/client-frontend/src/components/ProtectedRoute.jsx`                                                                                   |
| Type                   | Auth guard component                                                                                                                   |
| Purpose                | Redirect unauthenticated users to `/login`                                                                                             |
| Summary                | Reads `state.auth.user` from Redux; if null, renders `<Navigate to="/login" replace />`; otherwise renders `children` or `<Outlet />`. |
| Key Responsibilities   | Protect private routes from unauthorized access.                                                                                       |
| Exports                | Default: `ProtectedRoute`                                                                                                              |
| Dependencies           | Internal: `src/stores/store.js` (indirect via Redux). External: `react`, `react-redux`, `react-router-dom`.                            |
| Used By                | `src/app/router.jsx`                                                                                                                   |
| What Breaks If Changed | Removing the null check or `Navigate` redirect bypasses all auth protection.                                                           |
| Related Files          | `src/app/router.jsx`, `src/stores/authSlice.js`                                                                                        |

---

## File: `src/components/TabBar.jsx`

| Field                  | Details                                                                                                                                                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `TabBar.jsx`                                                                                                                                                                                                                                                                    |
| Location               | `/client-frontend/src/components/TabBar.jsx`                                                                                                                                                                                                                                    |
| Type                   | Shared UI component                                                                                                                                                                                                                                                             |
| Purpose                | Render a horizontal tab strip with sliding indicator and overflow dropdown                                                                                                                                                                                                      |
| Summary                | Takes `tabs` (array of `{id/label, icon, count, important}`), `activeTab`, and `setActiveTab`. Important tabs always visible; others collapse into a "More" dropdown. Animated sliding underline indicator tracks active visible tab. Fades out when active tab is in dropdown. |
| Key Responsibilities   | Provide tab navigation for detail pages and filtering.                                                                                                                                                                                                                          |
| Exports                | Default: `TabBar`                                                                                                                                                                                                                                                               |
| Dependencies           | External: `react`, `lucide-react` (MoreHorizontal)                                                                                                                                                                                                                              |
| Used By                | `MeetingDetailPage`, `ProjectDetailPage`, `ProjectsPage`                                                                                                                                                                                                                        |
| What Breaks If Changed | Breaking indicator positioning or dropdown logic breaks tab navigation in multiple features.                                                                                                                                                                                    |
| Related Files          | None                                                                                                                                                                                                                                                                            |

---

## File: `src/components/layout/DashboardLayout.jsx`

| Field                  | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `DashboardLayout.jsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Location               | `/client-frontend/src/components/layout/DashboardLayout.jsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Type                   | Layout component (page shell)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Purpose                | Provide the authenticated app shell with sidebar, navbar, and content outlet                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Summary                | Renders a fixed `h-screen` shell: a full-width header (logo, search bar, notification bell with dot, user avatar/name/role), then a `flex-1 min-h-0` row with `Sidebar` on the left and a `<main overflow-y-auto>` on the right rendering `<Outlet>`. Only `<main>` scrolls internally — page-level scrolling is disabled globally (`html, body { overflow: hidden }` in `src/index.css`), so this is the sole scroll container per route. Scrolls to top (`window.scrollTo` + `mainRef.scrollTo`) on route change. |
| Key Responsibilities   | Wrap all authenticated pages with consistent layout chrome.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Exports                | Default: `DashboardLayout`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Dependencies           | Internal: `Sidebar`. External: `react`, `react-router-dom`, `react-redux`, `lucide-react` (Bell, Search, User).                                                                                                                                                                                                                                                                                                                                                                                                     |
| Used By                | `src/app/router.jsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| What Breaks If Changed | Breaking the layout affects every authenticated page.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Related Files          | `src/components/layout/Sidebar.jsx`, `src/app/router.jsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

---

## File: `src/components/layout/Sidebar.jsx`

| Field                  | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `Sidebar.jsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Location               | `/client-frontend/src/components/layout/Sidebar.jsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Type                   | Navigation component                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Purpose                | Render the two-tier app navigation (icon rail + accordion detail panel) and logout                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Summary                | Two-column nav driven by `NAV_ITEMS` (Dashboard, Projects, Team, Settings, Examples), each with a `sub` list and optional nested `children`. **Primary rail** (`w-[64px]`) shows icon-only buttons with hover tooltips (`TT` class); clicking a rail item with >1 sub-entry opens the **secondary panel** (`w-[220px]`), an accordion listing that section's sub-items and their children, closable via a footer "Close" button (`h-11`, height-matched to the rail's footer button so both footer borders align). Active section/sub/child derived from `location.pathname` via `matchesNavItem`. There is no button to collapse the primary rail anymore (removed) — only a thin `w-[18px]` auto-collapsed strip with a restore chevron (`handleRestore`) that exists as leftover dead state (`primaryOpen` never gets set to `false` from the UI). Logout button in the rail footer dispatches `logout()`. |
| Key Responsibilities   | Provide primary/secondary navigation, accordion drill-down, and logout functionality.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Exports                | Default: `Sidebar`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Dependencies           | Internal: `src/stores/authSlice` (logout). External: `react`, `react-router-dom`, `react-redux`, `lucide-react`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Used By                | `src/components/layout/DashboardLayout.jsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| What Breaks If Changed | Breaking `matchesNavItem` mis-highlights active nav; breaking `NAV_ITEMS` paths prevents accessing pages; breaking logout prevents session termination.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Related Files          | `src/components/layout/DashboardLayout.jsx`, `src/stores/authSlice.js`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

---

## File: `src/config/api-client.js`

| Field                  | Details                                                                                                                                                                                                                                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `api-client.js`                                                                                                                                                                                                                                                                                      |
| Location               | `/client-frontend/src/config/api-client.js`                                                                                                                                                                                                                                                          |
| Type                   | API client utility                                                                                                                                                                                                                                                                                   |
| Purpose                | Provide a centralized fetch-based API client with CSRF and auto-refresh                                                                                                                                                                                                                              |
| Summary                | Exports `apiClient(endpoint, options, retry?)` which prepends `BASE_URL`, sets JSON content-type, attaches CSRF token for state-changing requests (non-auth), uses `credentials: "include"`, and auto-refreshes on 401 (once) via `refreshToken()`. Manages concurrent refresh with promise caching. |
| Key Responsibilities   | Centralize API request logic, handle auth token refresh and CSRF injection.                                                                                                                                                                                                                          |
| Exports                | Named: `apiClient`                                                                                                                                                                                                                                                                                   |
| Dependencies           | Internal: `src/config/api.js`, `src/config/csrf.js`. External: `fetch` (browser built-in)                                                                                                                                                                                                            |
| Used By                | All feature API modules: `login.js`, `me.js`, `meeting.js`, `projects.js`, `users.js`                                                                                                                                                                                                                |
| What Breaks If Changed | Breaking the refresh logic causes 401 loops; breaking CSRF injection causes 403 errors on mutations.                                                                                                                                                                                                 |
| Related Files          | `src/config/api.js`, `src/config/csrf.js`, all feature API modules                                                                                                                                                                                                                                   |

---

## File: `src/config/api.js`

| Field                  | Details                                                                                                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| File Name              | `api.js`                                                                                                                                                                                                     |
| Location               | `/client-frontend/src/config/api.js`                                                                                                                                                                         |
| Type                   | API configuration constants                                                                                                                                                                                  |
| Purpose                | Define API base URL, endpoint paths, and CSRF config                                                                                                                                                         |
| Summary                | Reads `VITE_API_BASE_URL` from env (fallback `http://localhost:8000`); exports `API_CONFIG` object with `BASE_URL`, `ENDPOINTS` (LOGIN, REFRESH, LOGOUT, ME, PROJECTS, USERS), and CSRF cookie/header names. |
| Key Responsibilities   | Centralize all API endpoint constants and configuration.                                                                                                                                                     |
| Exports                | Named: `API_CONFIG`                                                                                                                                                                                          |
| Dependencies           | Internal: reads `import.meta.env.VITE_API_BASE_URL`. External: none                                                                                                                                          |
| Used By                | `api-client.js`, `csrf.js`, `login.js`, `me.js`, `meeting.js`, `projects.js`, `users.js`                                                                                                                     |
| What Breaks If Changed | Changing `BASE_URL` breaks all API calls; changing endpoint strings breaks all feature API modules.                                                                                                          |
| Related Files          | `src/config/api-client.js`, `src/config/csrf.js`, all feature API modules                                                                                                                                    |

---

## File: `src/config/csrf.js`

| Field                  | Details                                                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| File Name              | `csrf.js`                                                                                                                                                    |
| Location               | `/client-frontend/src/config/csrf.js`                                                                                                                        |
| Type                   | CSRF token utility                                                                                                                                           |
| Purpose                | Read the CSRF token from cookies                                                                                                                             |
| Summary                | Exports `getCSRFToken()` which parses `document.cookie` for the cookie matching `API_CONFIG.CSRF_COOKIE_NAME` and returns its value, or `null` if not found. |
| Key Responsibilities   | Extract CSRF token from cookies for state-changing requests.                                                                                                 |
| Exports                | Named: `getCSRFToken`                                                                                                                                        |
| Dependencies           | Internal: `src/config/api.js`                                                                                                                                |
| Used By                | `src/config/api-client.js`                                                                                                                                   |
| What Breaks If Changed | Breaking the cookie parsing logic prevents CSRF token injection, causing 403 on all mutations.                                                               |
| Related Files          | `src/config/api.js`, `src/config/api-client.js`                                                                                                              |

---

## File: `src/hooks/use-mobile.js`

| Field                  | Details                                                                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| File Name              | `use-mobile.js`                                                                                                                                                                |
| Location               | `/client-frontend/src/hooks/use-mobile.js`                                                                                                                                     |
| Type                   | Custom React hook                                                                                                                                                              |
| Purpose                | Detect mobile viewport width                                                                                                                                                   |
| Summary                | Exports `useIsMobile()` which uses `window.matchMedia` at 768px breakpoint; returns boolean indicating if viewport is below 768px. Updates on resize via media query listener. |
| Key Responsibilities   | Provide responsive breakpoint detection for components.                                                                                                                        |
| Exports                | Named: `useIsMobile`                                                                                                                                                           |
| Dependencies           | External: `react`                                                                                                                                                              |
| Used By                | Not currently imported by any component (available for future use)                                                                                                             |
| What Breaks If Changed | No current impact (unused); return value type changes could break future consumers.                                                                                            |
| Related Files          | None                                                                                                                                                                           |

---

## File: `src/lib/toast.js`

| Field                  | Details                                                                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `toast.js`                                                                                                                                     |
| Location               | `/client-frontend/src/lib/toast.js`                                                                                                            |
| Type                   | Toast notification utility                                                                                                                     |
| Purpose                | Provide convenience wrappers for react-toastify notifications                                                                                  |
| Summary                | Exports `showSuccess`, `showError`, and `showInfo` functions, each calling `toast.success/error/info` with a dark theme and Bounce transition. |
| Key Responsibilities   | Centralize toast notification configuration.                                                                                                   |
| Exports                | Named: `showSuccess`, `showError`, `showInfo`                                                                                                  |
| Dependencies           | External: `react-toastify`                                                                                                                     |
| Used By                | Not currently imported by any component (available for future use)                                                                             |
| What Breaks If Changed | No current impact (unused); future consumers depend on these named exports.                                                                    |
| Related Files          | `src/app/app.jsx` (ToastContainer)                                                                                                             |

---

## File: `src/lib/utils.js`

| Field                  | Details                                                                                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `utils.js`                                                                                                                                                      |
| Location               | `/client-frontend/src/lib/utils.js`                                                                                                                             |
| Type                   | Utility library                                                                                                                                                 |
| Purpose                | Provide a lightweight `cn()` class name joiner                                                                                                                  |
| Summary                | Exports `cn(...inputs)` which flattens, filters (truthy strings), joins with space, and trims class name inputs. Replaces `clsx`/`tailwind-merge` dependencies. |
| Key Responsibilities   | Concatenate CSS class names conditionally.                                                                                                                      |
| Exports                | Named: `cn`                                                                                                                                                     |
| Dependencies           | None                                                                                                                                                            |
| Used By                | Not currently imported by any component (available for future use)                                                                                              |
| What Breaks If Changed | Future consumers of `cn` would break if the function signature changes.                                                                                         |
| Related Files          | None                                                                                                                                                            |

---

## File: `src/stores/authSlice.js`

| Field                  | Details                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `authSlice.js`                                                                                                                                                                                                                                                                                                                                                                                              |
| Location               | `/client-frontend/src/stores/authSlice.js`                                                                                                                                                                                                                                                                                                                                                                  |
| Type                   | Redux Toolkit slice                                                                                                                                                                                                                                                                                                                                                                                         |
| Purpose                | Manage authentication state: user, loading, error, initialized                                                                                                                                                                                                                                                                                                                                              |
| Summary                | Defines `authSlice` with state: `user`, `loading`, `error`, `initialized`. Provides `loginUser` async thunk (calls login API then fetches user) and `fetchUser` async thunk (fetches current user). Reducers: `logout` (clears user). Handles pending/fulfilled/rejected for both thunks. Sets `initialized = true` after first fetchUser completes (success or failure).                                   |
| Key Responsibilities   | Manage auth state lifecycle, provide login/logout/fetch actions.                                                                                                                                                                                                                                                                                                                                            |
| Exports                | Named: `loginUser`, `fetchUser`, `logout`. Default: `authReducer`                                                                                                                                                                                                                                                                                                                                           |
| Dependencies           | Internal: `src/features/auth/api/login.js`, `src/features/auth/api/me.js`. External: `@reduxjs/toolkit`.                                                                                                                                                                                                                                                                                                    |
| Used By                | `src/stores/store.js` (reducer registration), `src/app/app.jsx` (fetchUser dispatch), `LoginCard` (loginUser dispatch), `Sidebar` (logout dispatch), `ProtectedRoute` (read user), `router.jsx` (read user/loading/initialized), `DashboardLayout` (read user), `MeetingDetailPage` (read user), `ProjectDetailPage` (read user), `ProjectsPage` (read user), `TeamPage` (read user), `TeamTab` (read user) |
| What Breaks If Changed | Breaking `loginUser` or `fetchUser` prevents all authentication; breaking `initialized` prevents router from rendering.                                                                                                                                                                                                                                                                                     |
| Related Files          | `src/stores/store.js`, `src/features/auth/api/login.js`, `src/features/auth/api/me.js`                                                                                                                                                                                                                                                                                                                      |

---

## File: `src/stores/store.js`

| Field                  | Details                                                                     |
| ---------------------- | --------------------------------------------------------------------------- |
| File Name              | `store.js`                                                                  |
| Location               | `/client-frontend/src/stores/store.js`                                      |
| Type                   | Redux store configuration                                                   |
| Purpose                | Create and export the Redux store                                           |
| Summary                | Uses `configureStore` from Redux Toolkit with a single `auth` reducer.      |
| Key Responsibilities   | Instantiate the Redux store with all reducers.                              |
| Exports                | Named: `store`                                                              |
| Dependencies           | Internal: `src/stores/authSlice.js`. External: `@reduxjs/toolkit`.          |
| Used By                | `src/app/provider.jsx`                                                      |
| What Breaks If Changed | Removing or misconfiguring the store breaks all Redux-dependent components. |
| Related Files          | `src/stores/authSlice.js`, `src/app/provider.jsx`                           |

---

## File: `src/features/auth/api/login.js`

| Field                  | Details                                                                                                               |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| File Name              | `login.js`                                                                                                            |
| Location               | `/client-frontend/src/features/auth/api/login.js`                                                                     |
| Type                   | API function                                                                                                          |
| Purpose                | Call the backend login endpoint                                                                                       |
| Summary                | Exports `loginApi(payload)` which sends a POST request to `/auth/login` with the credentials payload via `apiClient`. |
| Key Responsibilities   | Provide the login API call.                                                                                           |
| Exports                | Named: `loginApi`                                                                                                     |
| Dependencies           | Internal: `src/config/api-client.js`, `src/config/api.js`                                                             |
| Used By                | `src/stores/authSlice.js`                                                                                             |
| What Breaks If Changed | Breaking this function prevents user login.                                                                           |
| Related Files          | `src/stores/authSlice.js`, `src/config/api.js`                                                                        |

---

## File: `src/features/auth/api/me.js`

| Field                  | Details                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| File Name              | `me.js`                                                                    |
| Location               | `/client-frontend/src/features/auth/api/me.js`                             |
| Type                   | API function                                                               |
| Purpose                | Call the backend current-user endpoint                                     |
| Summary                | Exports `getMe()` which sends a GET request to `/auth/me` via `apiClient`. |
| Key Responsibilities   | Fetch the authenticated user's data.                                       |
| Exports                | Named: `getMe`                                                             |
| Dependencies           | Internal: `src/config/api-client.js`, `src/config/api.js`                  |
| Used By                | `src/stores/authSlice.js`, `src/features/auth/hooks/useAuth.js`            |
| What Breaks If Changed | Breaking this function prevents auth initialization and login flow.        |
| Related Files          | `src/stores/authSlice.js`, `src/features/auth/hooks/useAuth.js`            |

---

## File: `src/features/auth/components/LoginCard.jsx`

| Field                  | Details                                                                                                                                                                                                                                                                                                                |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `LoginCard.jsx`                                                                                                                                                                                                                                                                                                        |
| Location               | `/client-frontend/src/features/auth/components/LoginCard.jsx`                                                                                                                                                                                                                                                          |
| Type                   | Login form component                                                                                                                                                                                                                                                                                                   |
| Purpose                | Render the login form with email/password fields and validation                                                                                                                                                                                                                                                        |
| Summary                | Controlled form with email and password fields; dispatches `loginUser` on submit; client-side validation (required, email format, min length); displays error toasts from Redux auth error state; navigates to `/dashboard` on success. Dark glassmorphism card with logo, Input/PasswordInput components, and Button. |
| Key Responsibilities   | Handle user login flow with validation and error display.                                                                                                                                                                                                                                                              |
| Exports                | Default: `LoginCard`                                                                                                                                                                                                                                                                                                   |
| Dependencies           | Internal: `src/stores/authSlice` (loginUser), `src/components/Button`, `src/components/Input`, `src/components/Label`, `src/assets/logo.png`. External: `react`, `react-router-dom`, `react-redux`, `react-toastify`.                                                                                                  |
| Used By                | `src/features/auth/routes/login.jsx`                                                                                                                                                                                                                                                                                   |
| What Breaks If Changed | Breaking the login form prevents all user authentication.                                                                                                                                                                                                                                                              |
| Related Files          | `src/features/auth/routes/login.jsx`, `src/stores/authSlice.js`                                                                                                                                                                                                                                                        |

---

## File: `src/features/auth/hooks/useAuth.js`

| Field                  | Details                                                                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `useAuth.js`                                                                                                                                    |
| Location               | `/client-frontend/src/features/auth/hooks/useAuth.js`                                                                                           |
| Type                   | Custom React hook                                                                                                                               |
| Purpose                | Provide a local auth state hook (alternative to Redux)                                                                                          |
| Summary                | Exports `useAuth()` which calls `getMe()` on mount and returns `{ user, loading }`. Sets loading true initially, then false after API resolves. |
| Key Responsibilities   | Provide non-Redux auth state for components that don't use Redux store.                                                                         |
| Exports                | Named: `useAuth`                                                                                                                                |
| Dependencies           | Internal: `src/features/auth/api/me.js`. External: `react`.                                                                                     |
| Used By                | Not currently imported by any component (available as alternative)                                                                              |
| What Breaks If Changed | No current impact (unused).                                                                                                                     |
| Related Files          | `src/features/auth/api/me.js`                                                                                                                   |

---

## File: `src/features/auth/pages/ProfilePage.jsx`

| Field                  | Details                                                                                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `ProfilePage.jsx`                                                                                                                                              |
| Location               | `/client-frontend/src/features/auth/pages/ProfilePage.jsx`                                                                                                     |
| Type                   | Page component                                                                                                                                                 |
| Purpose                | Display the current user's profile (name, email, role, member-since) with an Edit action                                                                      |
| Summary                | Static card layout: avatar placeholder, name/email header, Edit button (no-op), and a field list (Full Name, Email, Role, Member Since) rendered from a hardcoded array. Not yet wired to real user data or `PATCH /auth/me`. |
| Key Responsibilities   | Render the profile view UI.                                                                                                                                    |
| Exports                | Default: `ProfilePage`                                                                                                                                         |
| Dependencies           | Internal: `src/components/Card`, `src/components/Button`. External: `react`, `lucide-react`.                                                                  |
| Used By                | `src/app/router.jsx` (route `/settings/profile`)                                                                                                               |
| What Breaks If Changed | Breaks the profile view route if the default export or route path changes.                                                                                    |
| Related Files          | `src/app/router.jsx`, `src/features/settings/pages/SettingsPage.jsx`                                                                                          |

---

## File: `src/features/auth/routes/login.jsx`

| Field                  | Details                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| File Name              | `login.jsx`                                                                |
| Location               | `/client-frontend/src/features/auth/routes/login.jsx`                      |
| Type                   | Route page component                                                       |
| Purpose                | Render the login page with card                                            |
| Summary                | Wraps `LoginCard` in a full-screen div.                                    |
| Key Responsibilities   | Provide the route-level login page container.                              |
| Exports                | Default: `LoginPage`                                                       |
| Dependencies           | Internal: `src/features/auth/components/LoginCard.jsx`. External: `react`. |
| Used By                | `src/app/router.jsx` (lazy-loaded)                                         |
| What Breaks If Changed | Breaking this component breaks the `/login` route.                         |
| Related Files          | `src/app/router.jsx`, `src/features/auth/components/LoginCard.jsx`         |

---

## File: `src/features/dashboard/pages/DashboardPage.jsx`

| Field                  | Details                                                                                                                                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| File Name              | `DashboardPage.jsx`                                                                                                                                                                                                                  |
| Location               | `/client-frontend/src/features/dashboard/pages/DashboardPage.jsx`                                                                                                                                                                    |
| Type                   | Page component                                                                                                                                                                                                                       |
| Purpose                | Render the main CRM dashboard with metrics and activity                                                                                                                                                                              |
| Summary                | Displays 4 metric cards (Total Revenue, Active Leads, Conversion Rate, Avg Deal Size) with hardcoded values and trends, a revenue trends bar chart (static), and a recent activity feed with timeline dots. All data is placeholder. |
| Key Responsibilities   | Provide the landing dashboard view.                                                                                                                                                                                                  |
| Exports                | Default: `DashboardPage`                                                                                                                                                                                                             |
| Dependencies           | External: `react`, `lucide-react` (TrendingUp, Users, DollarSign, Activity, Target)                                                                                                                                                  |
| Used By                | `src/app/router.jsx` (lazy-loaded, route: `/dashboard`)                                                                                                                                                                              |
| What Breaks If Changed | Breaking this component breaks the `/dashboard` route.                                                                                                                                                                               |
| Related Files          | `src/app/router.jsx`                                                                                                                                                                                                                 |

---

## File: `src/features/meetings/api/meeting.js`

| Field                  | Details                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `meeting.js`                                                                                                                                                                                                                                                                                                                                                                                   |
| Location               | `/client-frontend/src/features/meetings/api/meeting.js`                                                                                                                                                                                                                                                                                                                                        |
| Type                   | API functions                                                                                                                                                                                                                                                                                                                                                                                  |
| Purpose                | Provide all meeting-related API calls                                                                                                                                                                                                                                                                                                                                                          |
| Summary                | Exports CRUD functions for meetings under a project: `listProjectMeetings`, `getMeeting`, `createMeeting`, `updateMeeting`, `deleteMeeting`, `updateMeetingPolicy`; participant management: `listParticipants`, `addParticipant`, `removeParticipant`, `changeParticipantRole`; recording: `startRecording`, `stopRecording`. All paths are built relative to `API_CONFIG.ENDPOINTS.PROJECTS`. |
| Key Responsibilities   | Provide meeting API interaction layer.                                                                                                                                                                                                                                                                                                                                                         |
| Exports                | Named: `listProjectMeetings`, `getMeeting`, `createMeeting`, `updateMeeting`, `deleteMeeting`, `updateMeetingPolicy`, `listParticipants`, `addParticipant`, `removeParticipant`, `changeParticipantRole`, `startRecording`, `stopRecording`                                                                                                                                                    |
| Dependencies           | Internal: `src/config/api-client.js`, `src/config/api.js`                                                                                                                                                                                                                                                                                                                                      |
| Used By                | `MeetingsTab.jsx`, `MeetingDetailPage.jsx`, `MeetingsPage.jsx`                                                                                                                                                                                                                                                                                                                                 |
| What Breaks If Changed | Breaking any function breaks the corresponding feature in meetings pages.                                                                                                                                                                                                                                                                                                                      |
| Related Files          | `src/config/api-client.js`, `src/config/api.js`, meeting component/pages                                                                                                                                                                                                                                                                                                                       |

---

## File: `src/features/meetings/components/MeetingInfoTab.jsx`

| Field                  | Details                                                                                                                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `MeetingInfoTab.jsx`                                                                                                                                                                          |
| Location               | `/client-frontend/src/features/meetings/components/MeetingInfoTab.jsx`                                                                                                                        |
| Type                   | Tab component                                                                                                                                                                                 |
| Purpose                | Display meeting metadata and description                                                                                                                                                      |
| Summary                | Renders a two-column grid with metadata (scheduled time, duration/end time, meeting ID) and description/agenda with access level badge. Each meta item shown in a styled info card with icon. |
| Key Responsibilities   | Render meeting detail information.                                                                                                                                                            |
| Exports                | Default: `MeetingInfoTab`                                                                                                                                                                     |
| Dependencies           | Internal: `src/components/Badge`. External: `react`, `lucide-react`.                                                                                                                          |
| Used By                | Not currently used directly (functionality merged into `MeetingDetailPage.jsx`)                                                                                                               |
| What Breaks If Changed | No current impact (superseded by inline content in MeetingDetailPage).                                                                                                                        |
| Related Files          | `src/features/meetings/pages/MeetingDetailPage.jsx`                                                                                                                                           |

---

## File: `src/features/meetings/components/MeetingsTab.jsx`

| Field                  | Details                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `MeetingsTab.jsx`                                                                                                                                                                                                                                                                                                                                                                                  |
| Location               | `/client-frontend/src/features/meetings/components/MeetingsTab.jsx`                                                                                                                                                                                                                                                                                                                                |
| Type                   | Tab component (embedded in project detail)                                                                                                                                                                                                                                                                                                                                                         |
| Purpose                | Display and manage meetings within a project context                                                                                                                                                                                                                                                                                                                                               |
| Summary                | Complex component that lists meetings for a project (or all projects), allows creating, editing, deleting meetings, managing participants (add, remove, change roles), and navigating to meeting detail. Uses `forwardRef` to expose `openAddMeeting` to parent. Integrates with `ProjectDetailPage`. Includes action menus, create/edit/participants modals, and participant role-toggle buttons. |
| Key Responsibilities   | Provide embedded meeting management within project detail page.                                                                                                                                                                                                                                                                                                                                    |
| Exports                | Default: `MeetingsTab`                                                                                                                                                                                                                                                                                                                                                                             |
| Dependencies           | Internal: `Badge`, `Button`, `Card`, `Dropdown`, `Form`, `Modal`, `../api/meeting`, `../../projects/api/projects`, `../constants`. External: `react`, `react-dom`, `react-router-dom`, `lucide-react`.                                                                                                                                                                                             |
| Used By                | `src/features/projects/pages/ProjectDetailPage.jsx`                                                                                                                                                                                                                                                                                                                                                |
| What Breaks If Changed | Breaking this component breaks the Meetings tab in project detail view.                                                                                                                                                                                                                                                                                                                            |
| Related Files          | `src/features/projects/pages/ProjectDetailPage.jsx`, `src/features/meetings/api/meeting.js`, `src/features/meetings/constants.js`                                                                                                                                                                                                                                                                  |

---

## File: `src/features/meetings/constants.js`

| Field                  | Details                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `constants.js`                                                                                                                                                                                                                                                                                                                                                                  |
| Location               | `/client-frontend/src/features/meetings/constants.js`                                                                                                                                                                                                                                                                                                                           |
| Type                   | Constants and helper utilities                                                                                                                                                                                                                                                                                                                                                  |
| Purpose                | Define meeting form fields, metadata helpers, and date formatting                                                                                                                                                                                                                                                                                                               |
| Summary                | Exports `EDIT_MEETING_FIELDS` (form config with conditional gating fields), `ADD_PARTICIPANT_ROLE_FIELDS`; helper functions: `getStatusMeta` (maps status to label/variant), `getVisibilityMeta` (maps visibility to label/variant/icon), `getParticipantRoleMeta`, `formatDateTime` (locale-aware formatting), `toDateTimeLocalValue` (convert to datetime-local input value). |
| Key Responsibilities   | Centralize meeting-related constants and formatting logic.                                                                                                                                                                                                                                                                                                                      |
| Exports                | Named: `EDIT_MEETING_FIELDS`, `ADD_PARTICIPANT_ROLE_FIELDS`, `getStatusMeta`, `getVisibilityMeta`, `getParticipantRoleMeta`, `formatDateTime`, `toDateTimeLocalValue`                                                                                                                                                                                                           |
| Dependencies           | External: `lucide-react` (Lock, Shield, Globe)                                                                                                                                                                                                                                                                                                                                  |
| Used By                | `MeetingDetailPage.jsx`, `MeetingsTab.jsx`                                                                                                                                                                                                                                                                                                                                      |
| What Breaks If Changed | Breaking helpers affects status/visibility display and form field configuration across meeting pages.                                                                                                                                                                                                                                                                           |
| Related Files          | `src/features/meetings/pages/MeetingDetailPage.jsx`, `src/features/meetings/components/MeetingsTab.jsx`                                                                                                                                                                                                                                                                         |

---

## File: `src/features/meetings/pages/MeetingDetailPage.jsx`

| Field                  | Details                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `MeetingDetailPage.jsx`                                                                                                                                                                                                                                                                                                                                                          |
| Location               | `/client-frontend/src/features/meetings/pages/MeetingDetailPage.jsx`                                                                                                                                                                                                                                                                                                             |
| Type                   | Page component                                                                                                                                                                                                                                                                                                                                                                   |
| Purpose                | Display meeting details with tabs for Info, Participants, Transcript, Tasks                                                                                                                                                                                                                                                                                                      |
| Summary                | Complex page that loads meeting data (auto-resolves project ID if missing), displays title/status/visibility badges, provides Start/End Meeting and Edit buttons (Info tab), participant table with role management (Participants tab), and placeholder tabs for Transcript and Tasks. Includes modals for editing meeting, adding participants, and changing participant roles. |
| Key Responsibilities   | Provide full meeting detail view with participant management.                                                                                                                                                                                                                                                                                                                    |
| Exports                | Default: `MeetingDetailPage`                                                                                                                                                                                                                                                                                                                                                     |
| Dependencies           | Internal: `Badge`, `Button`, `Card`, `Form`, `Modal`, `TabBar`, `../api/meeting`, `../../projects/api/projects`, `../constants`. External: `react`, `react-dom`, `react-router-dom`, `react-redux`, `lucide-react`.                                                                                                                                                              |
| Used By                | `src/app/router.jsx` (lazy-loaded, route: `/meetings/:id`)                                                                                                                                                                                                                                                                                                                       |
| What Breaks If Changed | Breaking this component breaks the `/meetings/:id` route.                                                                                                                                                                                                                                                                                                                        |
| Related Files          | `src/app/router.jsx`, `src/features/meetings/api/meeting.js`, `src/features/meetings/constants.js`                                                                                                                                                                                                                                                                               |

---

## File: `src/features/meetings/pages/MeetingsPage.jsx`

| Field                  | Details                                                                                                                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| File Name              | `MeetingsPage.jsx`                                                                                                                                                                                                       |
| Location               | `/client-frontend/src/features/meetings/pages/MeetingsPage.jsx`                                                                                                                                                          |
| Type                   | Page component                                                                                                                                                                                                           |
| Purpose                | Display all meetings across projects with filtering and creation                                                                                                                                                         |
| Summary                | Loads all projects and meetings, displays in a card grid with project filter dropdown, search, status/visibility badges, action menu with delete, and a create meeting modal. Navigates to meeting detail on card click. |
| Key Responsibilities   | Provide meetings overview/list view.                                                                                                                                                                                     |
| Exports                | Default: `MeetingsPage`                                                                                                                                                                                                  |
| Dependencies           | Internal: `Badge`, `Button`, `Card`, `Dropdown`, `Form`, `Modal`, `../api/meeting`, `../../projects/api/projects`. External: `react`, `react-router-dom`, `lucide-react`.                                                |
| Used By                | `src/app/router.jsx` (lazy-loaded, route: `/meetings`)                                                                                                                                                                   |
| What Breaks If Changed | Breaking this component breaks the `/meetings` route.                                                                                                                                                                    |
| Related Files          | `src/app/router.jsx`, `src/features/meetings/api/meeting.js`, `src/features/projects/api/projects.js`                                                                                                                    |

---

## File: `src/features/projects/api/projects.js`

| Field                  | Details                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| File Name              | `projects.js`                                                                                                                                                                                                                                                                                                                                                                                    |
| Location               | `/client-frontend/src/features/projects/api/projects.js`                                                                                                                                                                                                                                                                                                                                         |
| Type                   | API functions                                                                                                                                                                                                                                                                                                                                                                                    |
| Purpose                | Provide all project-related API calls                                                                                                                                                                                                                                                                                                                                                            |
| Summary                | Exports CRUD for projects, owned/admin/deleted project queries, member management (add/remove/change role/search), and member permissions (get/update/delete). Uses `apiClient` with paths under `/project` prefix.                                                                                                                                                                              |
| Key Responsibilities   | Provide project API interaction layer.                                                                                                                                                                                                                                                                                                                                                           |
| Exports                | Named: `getProjects`, `getProject`, `getOwnedProjects`, `getAdminProjects`, `createProject`, `updateProject`, `deleteProject`, `getAllProjects`, `getDeletedProjects`, `getDeletedProject`, `reactivateProject`, `getProjectMembers`, `addProjectMember`, `removeProjectMember`, `changeMemberRole`, `searchUsers`, `getMemberPermissions`, `updateMemberPermissions`, `deleteMemberPermissions` |
| Dependencies           | Internal: `src/config/api-client.js`, `src/config/api.js`                                                                                                                                                                                                                                                                                                                                        |
| Used By                | `ProjectsPage.jsx`, `ProjectDetailPage.jsx`, `MeetingsPage.jsx`, `MeetingsTab.jsx`, `MeetingDetailPage.jsx`, `TeamTab.jsx`                                                                                                                                                                                                                                                                       |
| What Breaks If Changed | Breaking any function breaks the corresponding feature in project/meeting/team pages.                                                                                                                                                                                                                                                                                                            |
| Related Files          | `src/config/api-client.js`, `src/config/api.js`, project/meeting/team pages                                                                                                                                                                                                                                                                                                                      |

---

## File: `src/features/projects/components/ProjectInfoTab.jsx`

| Field                  | Details                                                                                                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `ProjectInfoTab.jsx`                                                                                                                                                                    |
| Location               | `/client-frontend/src/features/projects/components/ProjectInfoTab.jsx`                                                                                                                  |
| Type                   | Tab component                                                                                                                                                                           |
| Purpose                | Display project overview and details                                                                                                                                                    |
| Summary                | Two-column card layout showing dashboard overview (status, ID, deadline, availability) and project details (short description, full description). Uses Card component and lucide icons. |
| Key Responsibilities   | Render project information tab content.                                                                                                                                                 |
| Exports                | Default: `ProjectInfoTab`                                                                                                                                                               |
| Dependencies           | Internal: `src/components/Card`. External: `react`, `lucide-react` (Briefcase, CheckCircle).                                                                                            |
| Used By                | `src/features/projects/pages/ProjectDetailPage.jsx`                                                                                                                                     |
| What Breaks If Changed | Breaking this component breaks the Info tab in project detail view.                                                                                                                     |
| Related Files          | `src/features/projects/pages/ProjectDetailPage.jsx`                                                                                                                                     |

---

## File: `src/features/projects/components/TasksTab.jsx`

| Field                  | Details                                                                                                                                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `TasksTab.jsx`                                                                                                                                                                                                  |
| Location               | `/client-frontend/src/features/projects/components/TasksTab.jsx`                                                                                                                                                |
| Type                   | Tab component                                                                                                                                                                                                   |
| Purpose                | Display hardcoded tasks for a project                                                                                                                                                                           |
| Summary                | Renders a list of hardcoded tasks (Finalize color palette, Review API integration, Update wireframes) with completion toggle, due date, and priority badge. Uses Card and Badge components. No API integration. |
| Key Responsibilities   | Render project tasks tab (placeholder).                                                                                                                                                                         |
| Exports                | Default: `TasksTab`                                                                                                                                                                                             |
| Dependencies           | Internal: `src/components/Card`, `src/components/Button`, `src/components/Badge`. External: `react`, `lucide-react` (CheckCircle2, Circle, Plus).                                                               |
| Used By                | `src/features/projects/pages/ProjectDetailPage.jsx`                                                                                                                                                             |
| What Breaks If Changed | Breaking this component breaks the Tasks tab in project detail view.                                                                                                                                            |
| Related Files          | `src/features/projects/pages/ProjectDetailPage.jsx`                                                                                                                                                             |

---

## File: `src/features/projects/components/TeamTab.jsx`

| Field                  | Details                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `TeamTab.jsx`                                                                                                                                                                                                                                                                                                                                                                          |
| Location               | `/client-frontend/src/features/projects/components/TeamTab.jsx`                                                                                                                                                                                                                                                                                                                        |
| Type                   | Tab component (complex)                                                                                                                                                                                                                                                                                                                                                                |
| Purpose                | Display and manage project team members                                                                                                                                                                                                                                                                                                                                                |
| Summary                | Complex component using `forwardRef` to expose `openAddModal`. Lists project members in a table with role badges, status badges, and action buttons (mail, more). Includes modals for adding members (with searchable user autocomplete), changing roles, and a slide-over profile panel with permissions viewer/editor. Supports removing members and toggling permissions overrides. |
| Key Responsibilities   | Provide full team management within project detail page.                                                                                                                                                                                                                                                                                                                               |
| Exports                | Default: `TeamTab`                                                                                                                                                                                                                                                                                                                                                                     |
| Dependencies           | Internal: `Card`, `Button`, `Badge`, `Modal`, `Form`, `../api/projects`, `../constants`. External: `react`, `react-dom`, `react-redux`, `lucide-react`.                                                                                                                                                                                                                                |
| Used By                | `src/features/projects/pages/ProjectDetailPage.jsx`                                                                                                                                                                                                                                                                                                                                    |
| What Breaks If Changed | Breaking this component breaks the Team Members tab in project detail view.                                                                                                                                                                                                                                                                                                            |
| Related Files          | `src/features/projects/pages/ProjectDetailPage.jsx`, `src/features/projects/api/projects.js`, `src/features/projects/constants.js`                                                                                                                                                                                                                                                     |

---

## File: `src/features/projects/constants.js`

| Field                  | Details                                                                                                                                                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `constants.js`                                                                                                                                                                                                                |
| Location               | `/client-frontend/src/features/projects/constants.js`                                                                                                                                                                         |
| Type                   | Constants and helpers                                                                                                                                                                                                         |
| Purpose                | Define project form fields, status options, member role options, and formatting helpers                                                                                                                                       |
| Summary                | Exports `STATUS_OPTIONS` (5 statuses), `MEMBER_ROLE_OPTIONS` (admin, maintainer, member, viewer), `PROJECT_FIELDS` (form config with two-column layout including markdown field), `formatStatusLabel`, and `formatRoleLabel`. |
| Key Responsibilities   | Centralize project-related constants and formatting.                                                                                                                                                                          |
| Exports                | Named: `STATUS_OPTIONS`, `MEMBER_ROLE_OPTIONS`, `PROJECT_FIELDS`, `formatStatusLabel`, `formatRoleLabel`                                                                                                                      |
| Dependencies           | None                                                                                                                                                                                                                          |
| Used By                | `ProjectsPage.jsx`, `ProjectDetailPage.jsx`, `TeamTab.jsx`                                                                                                                                                                    |
| What Breaks If Changed | Changing form fields breaks project create/edit forms; changing status/role labels affects all project pages.                                                                                                                 |
| Related Files          | `src/features/projects/pages/ProjectsPage.jsx`, `src/features/projects/pages/ProjectDetailPage.jsx`, `src/features/projects/components/TeamTab.jsx`                                                                           |

---

## File: `src/features/projects/pages/ProjectDetailPage.jsx`

| Field                  | Details                                                                                                                                                                                                                                                                                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `ProjectDetailPage.jsx`                                                                                                                                                                                                                                                                                                                                                     |
| Location               | `/client-frontend/src/features/projects/pages/ProjectDetailPage.jsx`                                                                                                                                                                                                                                                                                                        |
| Type                   | Page component                                                                                                                                                                                                                                                                                                                                                              |
| Purpose                | Display project details with tabbed interface                                                                                                                                                                                                                                                                                                                               |
| Summary                | Loads project by ID, displays header with edit/reactivate buttons, tab bar (Project Info, Team, Tasks, Meetings), renders corresponding tab component for each, and provides edit modal with project form. Supports soft-deleted project banner with reactivate for super admins. Uses `forwardRef` to communicate with TeamTab and MeetingsTab for dynamic header buttons. |
| Key Responsibilities   | Provide full project detail view with tab-based sub-views.                                                                                                                                                                                                                                                                                                                  |
| Exports                | Default: `ProjectDetailPage`                                                                                                                                                                                                                                                                                                                                                |
| Dependencies           | Internal: `Button`, `TabBar`, `Modal`, `Form`, `../api/projects`, `../constants`, `ProjectInfoTab`, `TeamTab`, `TasksTab`, `MeetingsTab`. External: `react`, `react-router-dom`, `react-redux`, `lucide-react`.                                                                                                                                                             |
| Used By                | `src/app/router.jsx` (lazy-loaded, route: `/projects/:id`)                                                                                                                                                                                                                                                                                                                  |
| What Breaks If Changed | Breaking this component breaks the `/projects/:id` route.                                                                                                                                                                                                                                                                                                                   |
| Related Files          | `src/app/router.jsx`, `src/features/projects/api/projects.js`, `src/features/projects/constants.js`, tab components                                                                                                                                                                                                                                                         |

---

## File: `src/features/projects/pages/ProjectsPage.jsx`

| Field                  | Details                                                                                                                                                                                                                                                                                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `ProjectsPage.jsx`                                                                                                                                                                                                                                                                                                                                          |
| Location               | `/client-frontend/src/features/projects/pages/ProjectsPage.jsx`                                                                                                                                                                                                                                                                                             |
| Type                   | Page component                                                                                                                                                                                                                                                                                                                                              |
| Purpose                | Display and manage all projects with tabs and CRUD                                                                                                                                                                                                                                                                                                          |
| Summary                | Loads all projects, displays in a card grid with tab filtering (All, In Progress, On Hold, Completed, Owned, Can Admin, Deleted for super admins). Supports create/edit/delete projects via modals, reactivate deleted projects, and navigation to project detail. Uses `TabBar` with sliding indicator and overflow dropdown. Super admin only for create. |
| Key Responsibilities   | Provide projects overview/list view with full CRUD.                                                                                                                                                                                                                                                                                                         |
| Exports                | Default: `ProjectsPage`                                                                                                                                                                                                                                                                                                                                     |
| Dependencies           | Internal: `Card`, `Button`, `TabBar`, `Badge`, `Modal`, `Form`, `../api/projects`, `../constants`. External: `react`, `react-router-dom`, `react-redux`, `lucide-react`.                                                                                                                                                                                    |
| Used By                | `src/app/router.jsx` (lazy-loaded, route: `/projects`)                                                                                                                                                                                                                                                                                                      |
| What Breaks If Changed | Breaking this component breaks the `/projects` route.                                                                                                                                                                                                                                                                                                       |
| Related Files          | `src/app/router.jsx`, `src/features/projects/api/projects.js`, `src/features/projects/constants.js`                                                                                                                                                                                                                                                         |

---

## File: `src/features/reports/pages/ReportsPage.jsx`

| Field                  | Details                                                                                                                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `ReportsPage.jsx`                                                                                                                                              |
| Location               | `/client-frontend/src/features/reports/pages/ReportsPage.jsx`                                                                                                  |
| Type                   | Page component (unused)                                                                                                                                        |
| Purpose                | Render an intelligence reports page                                                                                                                            |
| Summary                | Displays data velocity chart placeholder, storage integrity metric, and a list of hardcoded archive reports with download buttons. Not connected to any route. |
| Key Responsibilities   | Provide reports view (not currently routed).                                                                                                                   |
| Exports                | Default: `ReportsPage`                                                                                                                                         |
| Dependencies           | External: `react`, `lucide-react` (FileText, Download, TrendingUp, BarChart3, Zap)                                                                             |
| Used By                | None (not imported in router)                                                                                                                                  |
| What Breaks If Changed | No impact (unused page).                                                                                                                                       |
| Related Files          | None                                                                                                                                                           |

---

## File: `src/features/settings/pages/SettingsPage.jsx`

| Field                  | Details                                                                                                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| File Name              | `SettingsPage.jsx`                                                                                                                                                                                                 |
| Location               | `/client-frontend/src/features/settings/pages/SettingsPage.jsx`                                                                                                                                                    |
| Type                   | Page component                                                                                                                                                                                                     |
| Purpose                | Render the settings page with configuration sections                                                                                                                                                               |
| Summary                | Displays 4 settings section cards (Account Profile, Security & Auth, Notifications, API Access) and a "Danger Zone" card with delete account button. All data/actions are static/placeholder. Uses Card component. |
| Key Responsibilities   | Provide settings view.                                                                                                                                                                                             |
| Exports                | Default: `SettingsPage`                                                                                                                                                                                            |
| Dependencies           | Internal: `src/components/Card`, `src/components/Button`. External: `react`, `lucide-react` (Settings, Shield, Bell, Key, Zap).                                                                                    |
| Used By                | `src/app/router.jsx` (lazy-loaded, route: `/settings`)                                                                                                                                                             |
| What Breaks If Changed | Breaking this component breaks the `/settings` route.                                                                                                                                                              |
| Related Files          | `src/app/router.jsx`                                                                                                                                                                                               |

---

## File: `src/features/tasks/pages/TasksPage.jsx`

| Field                  | Details                                                                                                                                                                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `TasksPage.jsx`                                                                                                                                                                                                |
| Location               | `/client-frontend/src/features/tasks/pages/TasksPage.jsx`                                                                                                                                                      |
| Type                   | Page component                                                                                                                                                                                                 |
| Purpose                | Render the tasks management page                                                                                                                                                                               |
| Summary                | Displays a list of hardcoded tasks with completion toggles, due dates, project labels, and priority badges. Supports list/calendar view toggle (calendar is placeholder). Uses Card, Button, Badge components. |
| Key Responsibilities   | Provide tasks overview view.                                                                                                                                                                                   |
| Exports                | Default: `TasksPage`                                                                                                                                                                                           |
| Dependencies           | Internal: `src/components/Card`, `src/components/Button`, `src/components/Badge`. External: `react`, `lucide-react`.                                                                                           |
| Used By                | `src/app/router.jsx` (lazy-loaded, route: `/tasks`)                                                                                                                                                            |
| What Breaks If Changed | Breaking this component breaks the `/tasks` route.                                                                                                                                                             |
| Related Files          | `src/app/router.jsx`                                                                                                                                                                                           |

---

## File: `src/features/team/api/users.js`

| Field                  | Details                                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| File Name              | `users.js`                                                                                                                           |
| Location               | `/client-frontend/src/features/team/api/users.js`                                                                                    |
| Type                   | API functions                                                                                                                        |
| Purpose                | Provide user management API calls (super admin)                                                                                      |
| Summary                | Exports `getUsers` (paginated, filterable), `createUser`, and `toggleUserActive`. All use `apiClient` with endpoints under `/users`. |
| Key Responsibilities   | Provide user admin API interaction layer.                                                                                            |
| Exports                | Named: `getUsers`, `createUser`, `toggleUserActive`                                                                                  |
| Dependencies           | Internal: `src/config/api-client.js`, `src/config/api.js`                                                                            |
| Used By                | `src/features/team/pages/TeamPage.jsx`                                                                                               |
| What Breaks If Changed | Breaking any function breaks the Team Management page.                                                                               |
| Related Files          | `src/features/team/pages/TeamPage.jsx`, `src/features/team/constants.js`                                                             |

---

## File: `src/features/team/constants.js`

| Field                  | Details                                                                                                                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| File Name              | `constants.js`                                                                                                                                                                                                                 |
| Location               | `/client-frontend/src/features/team/constants.js`                                                                                                                                                                              |
| Type                   | Constants and helpers                                                                                                                                                                                                          |
| Purpose                | Define user form fields, filter options, and status helpers                                                                                                                                                                    |
| Summary                | Exports `SUPER_ADMIN_OPTIONS`, `USER_CREATE_FIELDS` (form config), `FILTER_OPTIONS` (status filters), `ADMIN_FILTER_OPTIONS` (admin type filters), `formatUserStatusLabel`, `getUserStatusVariant`, and `formatToggleMessage`. |
| Key Responsibilities   | Centralize user management constants and formatting.                                                                                                                                                                           |
| Exports                | Named: `SUPER_ADMIN_OPTIONS`, `USER_CREATE_FIELDS`, `FILTER_OPTIONS`, `ADMIN_FILTER_OPTIONS`, `formatUserStatusLabel`, `getUserStatusVariant`, `formatToggleMessage`                                                           |
| Dependencies           | None                                                                                                                                                                                                                           |
| Used By                | `src/features/team/pages/TeamPage.jsx`                                                                                                                                                                                         |
| What Breaks If Changed | Changing form fields breaks user creation; changing filter options breaks team page filtering.                                                                                                                                 |
| Related Files          | `src/features/team/pages/TeamPage.jsx`, `src/features/team/api/users.js`                                                                                                                                                       |

---

## File: `src/features/team/pages/TeamPage.jsx`

| Field                  | Details                                                                                                                                                                                                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Name              | `TeamPage.jsx`                                                                                                                                                                                                                                                                                     |
| Location               | `/client-frontend/src/features/team/pages/TeamPage.jsx`                                                                                                                                                                                                                                            |
| Type                   | Page component                                                                                                                                                                                                                                                                                     |
| Purpose                | Render the team/user management page (super admin)                                                                                                                                                                                                                                                 |
| Summary                | Complex page with paginated user table (20 per page), search with debounce, status and admin type filter dropdowns, create user modal, and slide-over user profile panel with activate/deactivate toggle. Users table excludes current user. Handles loading, error, empty, and pagination states. |
| Key Responsibilities   | Provide super admin user management interface.                                                                                                                                                                                                                                                     |
| Exports                | Default: `TeamPage`                                                                                                                                                                                                                                                                                |
| Dependencies           | Internal: `Card`, `Button`, `Badge`, `Modal`, `Form`, `../api/users`, `../constants`. External: `react`, `react-redux`, `lucide-react`.                                                                                                                                                            |
| Used By                | `src/app/router.jsx` (lazy-loaded, route: `/team`)                                                                                                                                                                                                                                                 |
| What Breaks If Changed | Breaking this component breaks the `/team` route.                                                                                                                                                                                                                                                  |
| Related Files          | `src/app/router.jsx`, `src/features/team/api/users.js`, `src/features/team/constants.js`                                                                                                                                                                                                           |
