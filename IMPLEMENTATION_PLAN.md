# Implementation Plan — Openlog

## Architecture
- **Framework**: Next.js 16 (App Router), all client components ("use client")
- **Styling**: Tailwind CSS v4, dark-only theme
- **State**: React Context + useReducer for session/app state
- **Persistence**: Dexie.js → IndexedDB (`OpencodeSessionDB`)
- **Icons**: lucide-react
- **Markdown**: react-markdown + rehype-highlight

## Phase 1: Scaffold ✓ (done)

## Phase 2: Data Layer & Types
### Task 2.1: Install core dependencies
Dexie.js, lucide-react, react-markdown, rehype-highlight, highlight.js

### Task 2.2: Create TypeScript types (src/types/export.ts)
Full type definitions for Info, Message, Part, all tool input/output shapes

### Task 2.3: Create Dexie database layer (src/lib/db.ts)
Initialize IndexedDB, CRUD operations for sessions, upsert logic

## Phase 3: Drop Zone Component
### Task 3.1: Create DropZone component (src/components/DropZone.tsx)
Drag-and-drop + click-to-browse, file validation (.json only), JSON parse, error display

### Task 3.2: Create SessionContext (src/lib/SessionContext.tsx)
React context + reducer: list sessions, active session, add/remove/update

### Task 3.3: Wire DropZone → Context → Dexie
On valid parse → save via Dexie → set as active session

## Phase 4: Session Sidebar
### Task 4.1: Create Sidebar component (src/components/Sidebar.tsx)
Left sidebar, session list (title, model badge, date), active highlight, delete with confirmation

### Task 4.2: "New Session" button
Returns to drop zone view, clears active session

## Phase 5: Session Header
### Task 5.1: Create SessionHeader component (src/components/SessionHeader.tsx)
Editable title, model badge, mode badge, version, cost, token breakdown, duration, directory breadcrumb

## Phase 6: Message List
### Task 6.1: Create MessageList + MessageCard components (src/components/messages/)
Chronological list, user/assistant grouping by parentID, message info bar per message

## Phase 7: Part Renderers
### Task 7.1: TextPart — markdown rendering with code blocks
### Task 7.2: ReasoningPart — collapsible <details>, Anthropic signature badge, duration
### Task 7.3: StepStart/StepFinish — snapshot badge + stats footer
### Task 7.4: AgentPart — subagent name chip
### Task 7.5: Tool card — expandable card framework (shared wrapper)
### Task 7.6: BashCard — command + terminal output + exit code
### Task 7.7: ReadCard — file path + syntax highlighting + line range
### Task 7.8: GlobCard — pattern + match count + file list
### Task 7.9: TaskCard — description + subagent type + prompt + output
### Task 7.10: QuestionCard — questions + highlighted answers
### Task 7.11: WriteCard, EditCard, TodoWriteCard — generic tool cards
### Task 7.12: FilePart, PatchPart — extra part types from export data

## Phase 8: Filters & Keyboard
### Task 8.1: FilterBar component — role, tool type, agent dropdowns
### Task 8.2: Client-side filter logic — instant hiding
### Task 8.3: Keyboard shortcuts — Esc to close, click-to-copy IDs

## Phase 9: Polish
### Task 9.1: Global dark theme CSS (zinc-900 palette)
### Task 9.2: Spacing, typography, icons consistency pass
### Task 9.3: Empty states, error handling, loading indicators
