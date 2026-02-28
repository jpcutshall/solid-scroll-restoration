# solid-scroll-restoration

A lightweight SolidJS primitive for saving and restoring scroll positions on any scrollable element. Supports in-memory, `localStorage`, and `sessionStorage` persistence — perfect for preserving scroll state across route changes or page reloads.

## Installation

```bash
npm install solid-scroll-restoration
# or
pnpm add solid-scroll-restoration
# or
yarn add solid-scroll-restoration
```

> **Peer dependency:** `solid-js` ^1.9.10

## Quick Start

```tsx
import { createSignal } from "solid-js";
import createScrollRestoration from "solid-scroll-restoration";

const ScrollableList = () => {
  const [scrollElement, setScrollElement] = createSignal<HTMLDivElement | null>(null);

  createScrollRestoration(scrollElement, () => "my-list");

  return (
    <div ref={setScrollElement} style={{ height: "400px", overflow: "auto" }}>
      {/* scrollable content */}
    </div>
  );
};
```

When the component unmounts and remounts, the scroll position is automatically restored.

## API

### `createScrollRestoration(element, key, options?)`

| Parameter | Type | Description |
|---|---|---|
| `element` | `Accessor<HTMLElement \| null>` | A signal returning the scrollable DOM element (typically set via `ref`). |
| `key` | `Accessor<string>` | A signal returning a unique string key used to identify this scroll position. Changing the key will save/restore a different scroll position. |
| `options` | `ScrollRestorationOptions` | Optional configuration object. |

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `debounceTime` | `number` | `100` | Milliseconds to debounce the scroll event listener before saving the position. |
| `persist` | `false \| "localStorage" \| "sessionStorage"` | `false` | Where to persist scroll positions. When `false`, positions are only stored in memory and lost on full page reload. |

## Usage Examples

### Basic (In-Memory Only)

Scroll positions are kept in a SolidJS signal and restored when the component remounts within the same session. A full page reload will reset them.

```tsx
createScrollRestoration(scrollElement, () => "feed");
```

### Persist with `sessionStorage`

Scroll positions survive full page reloads within the same browser tab. Ideal for single-page apps with client-side routing.

```tsx
createScrollRestoration(scrollElement, () => "feed", {
  persist: "sessionStorage",
});
```

### Persist with `localStorage`

Scroll positions persist across tabs, windows, and browser sessions.

```tsx
createScrollRestoration(scrollElement, () => "feed", {
  persist: "localStorage",
});
```

### Dynamic Keys (e.g. Route-Based)

Use a reactive key to track separate scroll positions for different routes or views:

```tsx
import { useLocation } from "@solidjs/router";

const App = () => {
  const [scrollElement, setScrollElement] = createSignal<HTMLDivElement | null>(null);
  const location = useLocation();

  createScrollRestoration(scrollElement, () => location.pathname, {
    persist: "sessionStorage",
  });

  return (
    <div ref={setScrollElement} style={{ height: "100vh", overflow: "auto" }}>
      {/* routed content */}
    </div>
  );
};
```

### Custom Debounce Time

Reduce save frequency for performance-sensitive scenarios:

```tsx
createScrollRestoration(scrollElement, () => "feed", {
  debounceTime: 250,
});
```

## How It Works

1. **Listens** for `scroll` events on the target element (debounced).
2. **Saves** `{ scrollTop, scrollLeft }` to an in-memory signal, keyed by the string you provide.
3. **Persists** (optional) the saved position to `localStorage` or `sessionStorage` under the key `scrollRestoration-<your-key>`.
4. **Restores** the position when the component remounts — first checking in-memory state, then falling back to storage if persistence is enabled.

## License

MIT
