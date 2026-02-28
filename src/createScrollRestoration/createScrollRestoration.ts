import { debounce } from "../utils/debounce";
import {
  createSignal,
  createEffect,
  createMemo,
  onCleanup,
  type Accessor,
} from "solid-js";

type ScrollRestorationOptions = {
  debounceTime?: number;
  persist?: false | "localStorage" | "sessionStorage";
};

export default function createScrollRestoration<E extends HTMLElement>(
  element: Accessor<E | null>,
  key: Accessor<string>,
  { debounceTime = 100, persist = false }: ScrollRestorationOptions = {},
) {
  const [scrollRestoration, setScrollRestoration] = createSignal<
    Record<string, { scrollTop: number; scrollLeft: number }>
  >({});

  const currentScrollRestoration = createMemo(() => scrollRestoration()[key()]);
  const hasRestoration = createMemo(() => key() in scrollRestoration());

  createEffect(() => {
    const el = element();
    if (!el) return;

    const handleScroll = debounce(() => {
      const scrollTop = el.scrollTop;
      const scrollLeft = el.scrollLeft;

      setScrollRestoration((prevScrollRestoration) => ({
        ...prevScrollRestoration,
        [key()]: { scrollTop, scrollLeft },
      }));
    }, debounceTime);

    el.addEventListener("scroll", handleScroll);
    onCleanup(() => {
      el.removeEventListener("scroll", handleScroll);
    });
  });

  createEffect(() => {
    const el = element();
    if (!el) return;

    if (hasRestoration()) {
      el.scrollTo(
        currentScrollRestoration().scrollLeft,
        currentScrollRestoration().scrollTop,
      );
    } else {
      let initialScrollRestoration = {
        scrollTop: el.scrollTop,
        scrollLeft: el.scrollLeft,
      };

      if (persist === "localStorage") {
        const savedScrollRestoration = localStorage.getItem(
          `scrollRestoration-${key()}`,
        );
        if (savedScrollRestoration) {
          initialScrollRestoration = JSON.parse(savedScrollRestoration);
        }
      }

      if (persist === "sessionStorage") {
        const savedScrollRestoration = sessionStorage.getItem(
          `scrollRestoration-${key()}`,
        );
        if (savedScrollRestoration) {
          initialScrollRestoration = JSON.parse(savedScrollRestoration);
        }
      }

      setScrollRestoration((prevScrollRestoration) => ({
        ...prevScrollRestoration,
        [key()]: initialScrollRestoration,
      }));
    }
  });

  createEffect(() => {
    if (!persist || !currentScrollRestoration()) return;

    if (persist === "localStorage") {
      localStorage.setItem(
        `scrollRestoration-${key}`,
        JSON.stringify(currentScrollRestoration),
      );
    } else if (persist === "sessionStorage") {
      sessionStorage.setItem(
        `scrollRestoration-${key}`,
        JSON.stringify(currentScrollRestoration),
      );
    }
  });
}
