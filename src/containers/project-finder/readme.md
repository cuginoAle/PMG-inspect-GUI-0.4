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

---

End of documentation.
