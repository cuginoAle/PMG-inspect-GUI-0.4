# Project Finder Component

An interactive split-view explorer for browsing and inspecting a hierarchical directory / project structure sourced from the protected API endpoint (`/protected/api/projects`). It combines a searchable, virtualized tree (via `react-arborist`) on the left and a contextual detail / placeholder pane on the right.

> Status: Early prototype. API endpoint is marked TODO for replacement with a production backend.

---

## High-Level Architecture

```
<ProjectFinder>
  <SplitView>
    ├─ left:  <ProjectsTreeView>
    │          └─ <Tree> (react-arborist)
    │              └─ row renderer → <TreeViewNode>
    │                   ├─ <FolderIcon />
    │                   └─ <FileIcon />
    └─ right: <ProjectContentView>
```

- `ProjectFinder` orchestrates data fetching + selected item state.
- `ProjectsTreeView` renders the search field and hierarchical tree.
- `TreeViewNode` encapsulates per-row visuals, icons, selection styling.
- `ProjectContentView` displays content or an empty-selection message.
- `SplitView` (base component) lays out left/right panes.

---

## Data Flow

1. `ProjectFinder` fetches from `/protected/api/projects` on mount.
2. Response shape (simplified) resembles:
   ```ts
   interface FileInfo {
     name: string;
     type: 'file';
     size: number;
     lastModified: string;
     pciScore?: number;
   }
   interface DirectoryInfo {
     name: string;
     type: 'directory';
     contents: Array<FileInfo | DirectoryInfo>;
   }
   interface DirectoryResponse {
     path: string;
     contents: Array<FileInfo | DirectoryInfo>;
   }
   ```
3. The `contents` array becomes the `data` prop of `<Tree>`.
4. Node selection propagates upward via `onSelect` → sets `selectedProject` (currently typed as `Project | undefined`, see Type Notes).
5. Right panel reacts to `selectedProject`.

---

## Type Notes & Current Mismatch

- The global exported `Project` type (`src/app/types/index.ts`) is:
  ```ts
  type Project = { id: string; name: string; description: string };
  ```
- The API returns `FileInfo | DirectoryInfo` objects which do **not** include `id` or `description`.
- In `ProjectFinder` we currently treat leaf file nodes as `Project` instances. This is a provisional overlap; you likely need either:
  1. A distinct domain type: `FileSystemNode` separate from `Project`.
  2. An adapter that maps API nodes → normalized `Project` objects with generated IDs.

> Recommendation: Introduce a union type `TreeNode = FileInfo | DirectoryInfo` and adjust the selection state to `TreeNode | undefined` unless truly representing a domain-level “Project”.

---

## Components Breakdown

### 1. `ProjectFinder`

Responsible for:

- Client-side fetch (inside `useEffect`).
- Holding `projects` state (array from API `contents`).
- Tracking `selectedProject`.
- Passing callbacks to children.

Potential Improvements:

- Loading & error states.
- AbortController for fetch cancellation.
- Basic auth header injection (currently implicit / missing in code snippet).
- Data normalization & memoization.

### 2. `ProjectsTreeView`

Key props:

- `projects: Project[]` (should become `TreeNode[]`).
- `onSelect?: (project: Project | undefined) => void`.

Features implemented:

- Search box (Radix `TextField.Root`) updates local `searchTerm`.
- Virtualized hierarchical rendering via `react-arborist <Tree>`.
- Custom row: toggles expand on container click; separate button in row calls `node.select()`.
- Selection restricted to leaf nodes (`node[0].isLeaf`). Non-leaf clears selection.

Important `Tree` props used:

- `data`: hierarchical array.
- `idAccessor`: `'id'` (but nodes don’t have `id` yet unless you add one) — currently a latent bug if API data lacks `id`.
- `childrenAccessor`: `'contents'` matches API.
- `rowHeight`: 32 for consistent layout.
- `searchTerm`: filters nodes internally (string match on default accessor fields—may need custom `searchMatch` for richer logic).

Potential Improvements:

- Ensure stable unique IDs (e.g., path-based) if natural IDs missing.
- Debounce search input (e.g., `useDeferredValue` or `useDebounce`).
- Keyboard navigation hints / aria roles for accessibility.
- Persist open state (e.g., to localStorage or URL params).

### 3. `TreeViewNode`

Responsibilities:

- Rendering file vs folder icons.
- Reflecting selection & open state styling.
- Invoking `node.select()` via button (not the whole row to allow expanding separately via outer div).

Potential Enhancements:

- Double-click to expand/collapse when directory.
- Context menu (rename, delete, download, etc.).
- Lazy loading indicator (spinner) if later you introduce async child loading.

### 4. `FileIcon` / `FolderIcon`

- `FileIcon` chooses an icon component based on extension map (json, image, video) with a fallback.
- `FolderIcon` uses two stacked `MinusIcon`s + CSS classes to reflect open state.

Ideas:

- Expand extension map (ts, tsx, md, txt, csv, pdf, etc.).
- Color coding via CSS modules or data attributes.
- Add ARIA labels for screen readers.

### 5. `ProjectContentView`

- Simple conditional render.
- Displays a placeholder when `selectedProject` undefined.

Future Directions:

- Render file preview (text, JSON tree, image thumbnail, video player).
- Breadcrumb navigation.
- Metadata panel (size, modified date).

---

## User Interactions Summary

Action → Result:

- Click tree row container (background div): toggles open/closed (expand / collapse) because `onClick={() => node.toggle()}`.
- Click file name button: selects the node (leaf only triggers `onSelect` upstream).
- Type in search box: Filters nodes live (case-insensitive default) via `react-arborist` search.

Edge Cases:

- Selecting a directory clears selection (explicit logic in `onSelect`).
- If `idAccessor` points to a missing field, expansion state can reset unexpectedly; fix by supplying stable IDs.

---

## Accessibility (A11y) Considerations (To Improve)

Current gaps:

# Project Finder Component

An interactive split-view explorer for browsing and inspecting a hierarchical directory / project structure sourced from the protected API endpoint (`/protected/api/projects`). It combines a searchable, virtualized tree (via `react-arborist`) on the left and a contextual detail / placeholder pane on the right.

> Status: Early prototype. API endpoint is marked TODO for replacement with a production backend.

---

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Quick Start](#quick-start)
3. [Data Flow](#data-flow)
4. [Type Notes & Current Mismatch](#type-notes--current-mismatch)
5. [Proposed Normalized Types](#proposed-normalized-types)
6. [Components Breakdown](#components-breakdown)
7. [User Interactions Summary](#user-interactions-summary)
8. [Accessibility (A11y)](#accessibility-a11y-considerations-to-improve)
9. [Performance Notes](#performance-notes)
10. [Error Handling & Loading](#error-handling--loading-missing-now)
11. [Custom Search / Matching](#custom-search--matching)
12. [ID Normalization Example](#example-id-normalization-recommended)
13. [Styling Overview](#styling-overview)
14. [Known Issues / Technical Debt](#known-issues--technical-debt)
15. [Testing Strategy](#testing-strategy-ideas)
16. [Advanced Usage Snippets](#advanced-usage-snippets)
17. [Extension Points / Roadmap](#extension-points--roadmap)
18. [Contributing](#contributing)
19. [FAQ](#faq)

---

## High-Level Architecture

```
<ProjectFinder>
  <SplitView>
    ├─ left:  <ProjectsTreeView>
    │          └─ <Tree> (react-arborist)
    │              └─ row renderer → <TreeViewNode>
    │                   ├─ <FolderIcon />
    │                   └─ <FileIcon />
    └─ right: <ProjectContentView>
```

- `ProjectFinder` orchestrates data fetching + selected item state.
- `ProjectsTreeView` renders the search field and hierarchical tree.
- `TreeViewNode` encapsulates per-row visuals, icons, selection styling.
- `ProjectContentView` displays content or an empty-selection message.
- `SplitView` (base component) lays out left/right panes.

---

## Quick Start

Minimal integration in a Next.js page:

```tsx
import { ProjectFinder } from 'containers/project-finder';

export default function Page() {
  return <ProjectFinder />;
}
```

Development checklist:

1. Ensure protected API route `/protected/api/projects` works (basic auth middleware enabled).
2. (Optional) Wrap `fetch` with credentials / headers if auth required locally.
3. Add stable IDs via `attachIds` (see example below) before passing data into `<Tree>`.
4. Add loading & error UI (copy snippet from this README) for production readiness.
5. Add tests (see Testing Strategy) before refactors.

---

## Data Flow

1. `ProjectFinder` fetches from `/protected/api/projects` on mount.
2. Response shape (simplified) resembles:
   ```ts
   interface FileInfo {
     name: string;
     type: 'file';
     size: number;
     lastModified: string;
   }
   interface DirectoryInfo {
     name: string;
     type: 'directory';
     contents: Array<FileInfo | DirectoryInfo>;
   }
   interface DirectoryResponse {
     path: string;
     contents: Array<FileInfo | DirectoryInfo>;
   }
   ```
3. The `contents` array becomes the `data` prop of `<Tree>`.
4. Node selection propagates upward via `onSelect` → sets `selectedProject` (currently typed as `Project | undefined`, see Type Notes).
5. Right panel reacts to `selectedProject`.

---

## Type Notes & Current Mismatch

- The global exported `Project` type (`src/app/types/index.ts`) is:
  ```ts
  type Project = { id: string; name: string; description: string };
  ```
- The API returns `FileInfo | DirectoryInfo` objects which do **not** include `id` or `description`.
- In `ProjectFinder` we currently treat leaf file nodes as `Project` instances. This is a provisional overlap; you likely need either:
  1. A distinct domain type: `FileSystemNode` separate from `Project`.
  2. An adapter that maps API nodes → normalized `Project` objects with generated IDs.

> Recommendation: Introduce a union type `TreeNode = FileInfo | DirectoryInfo` and adjust the selection state to `TreeNode | undefined` unless truly representing a domain-level “Project”.

---

## Proposed Normalized Types

Create a dedicated module (e.g. `src/domain/filesystem/types.ts`) to clarify intent and prevent leakage of provisional types:

```ts
// Raw API nodes
export interface FileNodeRaw {
  name: string;
  type: 'file';
  size: number;
  lastModified: string;
}
export interface DirNodeRaw {
  name: string;
  type: 'directory';
  contents: Array<FileNodeRaw | DirNodeRaw>;
}
export type RawTreeNode = FileNodeRaw | DirNodeRaw;

// Normalized (adds id + path + parent reference safety)
export interface BaseNode {
  id: string;
  name: string;
  path: string;
  parentId?: string;
}
export interface FileNode extends BaseNode {
  kind: 'file';
  size: number;
  lastModified: string;
}
export interface DirNode extends BaseNode {
  kind: 'directory';
  children: string[];
}
export type NormalizedNode = FileNode | DirNode;

export interface NormalizedTree {
  nodes: Record<string, NormalizedNode>;
  rootIds: string[];
}
```

Benefits:

- Stable IDs decoupled from name changes.
- O(1) random access; easy to overlay metadata or permissions.
- Easier diffing & real-time updates.

---

## Components Breakdown

### 1. `ProjectFinder`

Responsible for:

- Client-side fetch (inside `useEffect`).
- Holding `projects` state (array from API `contents`).
- Tracking `selectedProject`.
- Passing callbacks to children.

Potential Improvements:

- Loading & error states.
- AbortController for fetch cancellation.
- Basic auth header injection (currently implicit / missing in code snippet).
- Data normalization & memoization.

### 2. `ProjectsTreeView`

Key props:

- `projects: Project[]` (should become `TreeNode[]`).
- `onSelect?: (project: Project | undefined) => void`.

Features implemented:

- Search box (Radix `TextField.Root`) updates local `searchTerm`.
- Virtualized hierarchical rendering via `react-arborist <Tree>`.
- Custom row: toggles expand on container click; separate button in row calls `node.select()`.
- Selection restricted to leaf nodes (`node[0].isLeaf`). Non-leaf clears selection.

Important `Tree` props used:

- `data`: hierarchical array.
- `idAccessor`: `'id'` (but nodes don’t have `id` yet unless you add one) — currently a latent bug if API data lacks `id`.
- `childrenAccessor`: `'contents'` matches API.
- `rowHeight`: 32 for consistent layout.
- `searchTerm`: filters nodes internally (string match on default accessor fields—may need custom `searchMatch` for richer logic).

Potential Improvements:

- Ensure stable unique IDs (e.g., path-based) if natural IDs missing.
- Debounce search input (e.g., `useDeferredValue` or `useDebounce`).
- Keyboard navigation hints / aria roles for accessibility.
- Persist open state (e.g., to localStorage or URL params).
- Provide a custom `searchMatch` for extension-aware search (see below).

### 3. `TreeViewNode`

Responsibilities:

- Rendering file vs folder icons.
- Reflecting selection & open state styling.
- Invoking `node.select()` via button (not the whole row to allow expanding separately via outer div).

Potential Enhancements:

- Double-click to expand/collapse when directory.
- Context menu (rename, delete, download, etc.).
- Lazy loading indicator (spinner) if later you introduce async child loading.

### 4. `FileIcon` / `FolderIcon`

- `FileIcon` chooses an icon component based on extension map (json, image, video) with a fallback.
- `FolderIcon` uses two stacked `MinusIcon`s + CSS classes to reflect open state.

Ideas:

- Expand extension map (ts, tsx, md, txt, csv, pdf, etc.).
- Color coding via CSS modules or data attributes.
- Add ARIA labels for screen readers.

### 5. `ProjectContentView`

- Simple conditional render.
- Displays a placeholder when `selectedProject` undefined.

Future Directions:

- Render file preview (text, JSON tree, image thumbnail, video player).
- Breadcrumb navigation.
- Metadata panel (size, modified date).

---

## User Interactions Summary

Action → Result:

- Click tree row container (background div): toggles open/closed (expand / collapse) because `onClick={() => node.toggle()}`.
- Click file name button: selects the node (leaf only triggers `onSelect` upstream).
- Type in search box: Filters nodes live (case-insensitive default) via `react-arborist` search.

Edge Cases:

- Selecting a directory clears selection (explicit logic in `onSelect`).
- If `idAccessor` points to a missing field, expansion state can reset unexpectedly; fix by supplying stable IDs.

---

## Accessibility (A11y) Considerations (To Improve)

Current gaps:

- No explicit roles (`tree`, `treeitem`), relying on library defaults (verify DOM output).
- Click targets rely on visual icons only; add `aria-label` or `title`.
- Keyboard navigation features depend on `react-arborist`; confirm they remain intact after custom row.

Recommendations:

- Wrap row in a button or give `role="treeitem"` and `tabIndex={0}`.
- Provide `aria-expanded` for directories.
- Add `aria-selected` on selected leaf node.

---

## Performance Notes

`react-arborist` virtualizes rows → large trees remain performant. Still:

- Avoid recreating large `data` arrays each render; memoize or keep stable reference.
- Extract search filtering to library’s props or custom search matcher rather than manual array filtering.
- Consider lazy loading deep branches if backend cost grows (supply placeholder children and load on `onToggle`).

---

## Error Handling & Loading (Missing Now)

Suggested pattern:

```ts
const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'ready'>(
  'idle',
);
useEffect(() => {
  const controller = new AbortController();
  setStatus('loading');
  fetch('/protected/api/projects', { signal: controller.signal })
    .then((r) => {
      if (!r.ok) throw new Error(r.statusText);
      return r.json();
    })
    .then((data) => {
      setProjects(data.contents);
      setStatus('ready');
    })
    .catch((e) => {
      if (e.name !== 'AbortError') setStatus('error');
    });
  return () => controller.abort();
}, []);
```

Then conditionally render skeletons, retry button, etc.

### Example Loading + Error UI Wrapper

```tsx
if (status === 'loading')
  return <div style={{ padding: 16 }}>Loading projects…</div>;
if (status === 'error')
  return (
    <div style={{ padding: 16 }}>
      <p>Failed to load projects.</p>
      <button onClick={retry}>Retry</button>
    </div>
  );
```

---

## Testing Strategy Ideas

1. Unit Tests:
   - Row renderer selects only leaf nodes.
   - Search term propagates to `<Tree>`.
2. Integration / Component Tests (e.g., React Testing Library):
   - Mock fetch returning fixture JSON; assert nodes render.
   - Simulate click on directory row toggles open state (look for nested children appear).
   - Selecting directory clears detail panel.
3. Visual Regression:
   - Storybook stories: default, large dataset, deep nesting, empty state, error.
4. Performance / Large Data:
   - Generate synthetic 5k node tree and measure initial render time.

Suggested file structure for tests:

```
src/
  containers/
    project-finder/
      __tests__/
        project-finder.fetch.test.tsx
        projects-tree-view.interactions.test.tsx
        tree-normalization.util.test.ts
```

Sample React Testing Library snippet:

```ts
test('selects leaf node only', async () => {
  render(<ProjectsTreeView projects={mockData} onSelect={onSelect} />);
  await user.click(screen.getByText('folderA')); // directory
  expect(onSelect).toHaveBeenCalledWith(undefined);
  await user.click(screen.getByText('file.json')); // leaf
  expect(onSelect).toHaveBeenLastCalledWith(
    expect.objectContaining({ name: 'file.json' }),
  );
});
```

---

## Extension Points / Roadmap

Short Term:

- Proper domain modeling for file vs project concepts.
- Unique ID derivation: e.g., path join accumulation.
- Loading & error UX.
- Keyboard + a11y polish.

Medium Term:

- File preview renderer framework (pluggable by extension MIME type).
- Context menu actions (rename/delete/download) with optimistic updates.
- Persist open & selection state across sessions.

Long Term:

- Server-driven incremental loading (chunked / pagination for huge repos).
- Real-time updates via WebSocket or SSE (e.g., file changes).
- Permissions & multi-user collaboration indicators.

---

## Example ID Normalization (Recommended)

```ts
function attachIds(nodes: Array<FileInfo | DirectoryInfo>, parentPath = '') {
  return nodes.map((n) => {
    const path = parentPath ? `${parentPath}/${n.name}` : n.name;
    const base = { ...n, id: path } as any; // extend shape
    if (n.type === 'directory') {
      base.contents = attachIds(n.contents, path);
    }
    return base;
  });
}
```

Then feed `attachIds(data.contents)` into `<Tree idAccessor="id" />`.

### Enhanced Normalization (Flat Map Form)

```ts
function normalize(nodes, parentPath = '', acc = { nodes: {}, rootIds: [] }) {
  nodes.forEach((n) => {
    const path = parentPath ? `${parentPath}/${n.name}` : n.name;
    const id = path; // or hash(path)
    if (!parentPath) acc.rootIds.push(id);
    if (n.type === 'directory') {
      acc.nodes[id] = {
        id,
        name: n.name,
        path,
        kind: 'directory',
        children: n.contents.map((c) => `${path}/${c.name}`),
      };
      normalize(n.contents, path, acc);
    } else {
      acc.nodes[id] = {
        id,
        name: n.name,
        path,
        kind: 'file',
        size: n.size,
        lastModified: n.lastModified,
      };
    }
  });
  return acc;
}
```

---

## Styling Overview

- CSS Modules (`style.module.css`) control spacing, selection highlighting, and icon theming.
- Row height fixed to 32px (matches `rowHeight`). Ensure any padding changes keep consistent height or adjust `rowHeight` prop.

---

## Known Issues / Technical Debt

| Area     | Issue                                  | Impact                             | Priority |
| -------- | -------------------------------------- | ---------------------------------- | -------- |
| Types    | `Project` mismatch with API node shape | Possible runtime assumptions break | High     |
| IDs      | `idAccessor='id'` but IDs absent       | Collapsing/reseting state          | High     |
| A11y     | Minimal ARIA semantics                 | Screen reader usability            | Medium   |
| Error UX | No loading/error states                | Poor feedback                      | Medium   |
| Search   | Not debounced                          | Excess renders on fast typing      | Low      |

---

## Custom Search / Matching

If default fuzzy inclusion is insufficient, supply `searchMatch` (scoring) OR `searchTerm` + pre-filter your data.

Guidelines:

- Return `0` for no match, positive number for match (higher = stronger).
- Keep it pure & fast (avoid allocations in hot path).
- Normalize case once outside if possible.

Example (multi-token AND match):

```ts
const terms = search.trim().toLowerCase().split(/\s+/);
<Tree
  searchTerm={search}
  searchMatch={(node) => {
    const name = node.data.name.toLowerCase();
    return terms.every(t => name.includes(t)) ? 1 : 0;
  }}
>
```

---

## Advanced Usage Snippets

### Row Renderer (Icon toggles folder, name selects)

```tsx
{
  ({ node, style }) => (
    <div style={style} className="tree-row">
      <span
        onClick={() => !node.isLeaf && node.toggle()}
        role="button"
        aria-label={node.isOpen ? 'Collapse folder' : 'Expand folder'}
      >
        {node.isLeaf ? (
          <FileIcon ext={ext} />
        ) : (
          <FolderIcon isOpen={node.isOpen} />
        )}
      </span>
      <button onClick={() => node.select()} aria-selected={node.isSelected}>
        {node.data.name}
      </button>
    </div>
  );
}
```

### Hooking Into Toggle For Lazy Loading

```tsx
<Tree
  data={data}
  onToggle={async (node) => {
    if (!node.isLeaf && !node.childrenLoaded) {
      const children = await fetchChildren(node);
      node.update(p => ({ ...p, contents: children }));
      node.childrenLoaded = true; // custom flag
    }
  }}
>
```

### Basic Auth Fetch Wrapper

```ts
async function fetchProjects(signal?: AbortSignal) {
  const res = await fetch('/protected/api/projects', {
    signal,
    headers: { Authorization: 'Basic ' + btoa('admin:password123') },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

---

## Quick Usage Snippet

```tsx
import { ProjectFinder } from 'containers/project-finder';

export default function Page() {
  return <ProjectFinder />;
}
```

---

## Contributing

- Keep tree row pure & fast (avoid heavy hooks inside row render).
- When adding new file type icons, extend `fileIconMap` + CSS class.
- Add tests for selection logic when modifying `onSelect`.

---

## License / Attribution

Internal prototype. Contains icons from `@radix-ui/react-icons` and uses `react-arborist` for virtualization + tree state management.

---

## FAQ

Q: Why does expand/collapse sometimes reset?  
A: Missing stable node IDs—generate path-based IDs and provide them via `idAccessor`.

Q: Why doesn’t my selection trigger the right panel?  
A: Only leaf nodes propagate selection by design—adjust `onSelect` condition if directories should also select.

Q: Can I lazy load large directories?  
A: Yes—return placeholder children and use `onToggle` to fetch + merge real children, then call `node.reload()` (see react-arborist docs).

Q: How do I implement a custom search (e.g., extension-specific boosting)?  
A: Provide `searchMatch`:

```tsx
<Tree
  data={data}
  searchTerm={search}
  searchMatch={(node, term) => {
    const name = node.data.name.toLowerCase();
    term = term.toLowerCase();
    if (name.includes(term)) return 1;
    if (term === 'config' && name.endsWith('.json')) return 0.5;
    return 0;
  }}
>
```

Q: How can I differentiate single vs double click (select vs open)?  
A: Use a timer or `onDoubleClick` on the row; on double click call `node.toggle()`, on single click call `node.select()`.

Q: Best way to persist expansion state?  
A: Listen to `onToggle` and store `node.id` open set in `localStorage`; seed via `defaultOpenIds` prop on initial mount.

---

End of documentation.
