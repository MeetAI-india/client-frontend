# 🚀 MeetAi - Client Frontend

MeetAi is a premium, feature-rich project management and meeting intelligence platform designed for modern teams. This repository houses the React-based frontend application, built for speed, scalability, and a superior user experience.

---

## 🛠️ Technology Stack

- **Framework:** [React 18](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- **Routing:** [React Router 6](https://reactrouter.com/)
- **State Management:** (Context API / Custom Hooks)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Linting:** ESLint with React-refresh support

---

## 🏗️ Project Structure

The project follows a **Feature-Based Architecture**, ensuring high modularity and scalability. All core logic is encapsulated within feature modules.

```bash
src
├── app               # Main application config (Router, Providers)
├── assets            # Global static assets
├── components        # Shared UI components (Atomic design)
├── features          # Domain-specific modules (Meetings, Projects, Auth, etc.)
│   └── [feature]
│       ├── api       # Feature-specific API hooks/calls
│       ├── components # Components scoped to this feature
│       └── pages      # Feature-specific page layouts
├── hooks             # Shared custom React hooks
├── lib               # Pre-configured library instances
├── utils             # Shared utility functions
└── stores            # Global state management
```

> [!NOTE]
> For a more detailed breakdown of the architectural constraints and folder organization, refer to [project-structure.md](./project-structure.md).

---

## 🌟 Feature Highlights (Current Implementation)

### 📁 Projects Module
High-level project management components designed for team collaboration.
- **Projects Dashboard:** Advanced filtering system for "Owned", "Completed", and "Deleted" projects.
- **Project Detail Page:** Interactive tabbed interface including Overview, Tasks, Team Members, and Meetings.
- **Dynamic Header System:** Context-aware actions that toggle buttons (e.g., "Edit Project" vs "Add Member") based on the active view.
- **Team Management:** Premium member invitation flow featuring searchable autocomplete and optimized modal interactions.

### 🎥 Meetings Module
Intelligence-driven meeting tracking and management.
- **Meetings Overview:** Centralized list of all scheduled and past meetings with real-time status tracking.
- **Meeting Detail View:** Comprehensive view for meeting summaries, transcripts, and action items.
- **Project Integration:** Seamless "Meetings Tab" embedded within project details for contextual discussion tracking.
- **Enhanced Navigation:** Smart routing logic allowing users to jump from project contexts directly into specific meeting details.

---

## 🚀 Development Workflow

### 1. Environment Setup
Ensure you have the latest environment variables in your `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

### 2. Local Development
Start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

### 3. Coding Standards
- Follow the feature-based structure defined in `project-structure.md`.
- Use Tailwind CSS for all styling; avoid inline styles.
- Ensure any new global components are added to the `src/components` directory.

---

## 📈 Recent Tasks & Implementation Status

- ✅ **Linking Meetings To Details:** Enabled navigation from meeting lists to individual detail pages.
- ✅ **Refactored Project Interface:** Integrated global Form components and consolidated complex tab logic.
- ✅ **Member Permission UI:** Implemented searchable fields for the Add Member modal.
- ✅ **Dynamic Actions:** Developed logic to update header buttons dynamically based on active project tabs.
- ✅ **Filters & Navigation:** Added robust project filtering (Archive/Active) and dark mode documentation support.
