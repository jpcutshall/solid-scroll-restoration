import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import createScrollRestoration from "./createScrollRestoration";

describe("createScrollRestoration", () => {
  let element: HTMLDivElement;
  let elementSignal: () => HTMLDivElement | null;
  let keySignal: () => string;

  beforeEach(() => {
    element = document.createElement("div");
    // Mock standard scroll behavior since jsdom doesn't fully support it
    Object.defineProperty(element, "scrollTop", { value: 0, writable: true });
    Object.defineProperty(element, "scrollLeft", { value: 0, writable: true });
    element.scrollTo = vi.fn();

    const [el, _setEl] = createSignal<HTMLDivElement | null>(element);
    elementSignal = el;

    const [key] = createSignal("test-key");
    keySignal = key;

    vi.useFakeTimers();
    localStorage.clear();
    sessionStorage.clear();
  });

  const TestComponent = (props: { persist?: false | "localStorage" | "sessionStorage"; overrideKey?: string }) => {
    createScrollRestoration(
      elementSignal,
      () => props.overrideKey || keySignal(),
      { persist: props.persist, debounceTime: 10 }
    );
    return null;
  };

  it("should update internally saved scroll position on scroll", () => {
    const { unmount } = render(() => <TestComponent />);

    element.scrollTop = 100;
    element.scrollLeft = 50;
    element.dispatchEvent(new Event("scroll"));

    vi.advanceTimersByTime(20);

    // Unmount and remount to see if it restores
    unmount();
    render(() => <TestComponent />);

    expect(element.scrollTo).toHaveBeenCalledWith(50, 100);
  });

  it("should persist scroll position to localStorage", () => {
    const { unmount } = render(() => <TestComponent persist="localStorage" />);

    element.scrollTop = 200;
    element.dispatchEvent(new Event("scroll"));
    vi.advanceTimersByTime(20);

    const saved = localStorage.getItem("scrollRestoration-test-key");
    expect(saved).toBe(JSON.stringify({ scrollTop: 200, scrollLeft: 0 }));

    unmount();
    
    // reset element
    element.scrollTop = 0;
    // Remount with a fresh component, it should read from localStorage
    render(() => <TestComponent persist="localStorage" />);

    expect(element.scrollTo).toHaveBeenCalledWith(0, 200);
  });

  it("should persist scroll position to sessionStorage", () => {
    const { unmount } = render(() => <TestComponent persist="sessionStorage" />);

    element.scrollTop = 300;
    element.dispatchEvent(new Event("scroll"));
    vi.advanceTimersByTime(20);

    const saved = sessionStorage.getItem("scrollRestoration-test-key");
    expect(saved).toBe(JSON.stringify({ scrollTop: 300, scrollLeft: 0 }));

    unmount();
    
    // reset element
    element.scrollTop = 0;
    // Remount with a fresh component, it should read from sessionStorage
    render(() => <TestComponent persist="sessionStorage" />);

    expect(element.scrollTo).toHaveBeenCalledWith(0, 300);
  });

  it("should handle null element gracefully", () => {
    const [el] = createSignal<HTMLDivElement | null>(null);

    // Should not throw when element is null
    render(() => {
      createScrollRestoration(el, keySignal, { debounceTime: 10 });
      return null;
    });
  });

  it("should debounce rapid scroll events", () => {
    render(() => <TestComponent />);

    // Fire multiple scroll events rapidly to trigger the clearTimeout branch
    element.scrollTop = 50;
    element.dispatchEvent(new Event("scroll"));

    element.scrollTop = 100;
    element.dispatchEvent(new Event("scroll"));

    element.scrollTop = 150;
    element.dispatchEvent(new Event("scroll"));

    vi.advanceTimersByTime(20);

    // Only the last scroll position should be saved
    const { unmount } = render(() => <TestComponent />);
    unmount();

    render(() => <TestComponent />);
    expect(element.scrollTo).toHaveBeenLastCalledWith(0, 150);
  });

  it("should restore scroll position from sessionStorage on fresh mount", () => {
    // Pre-populate sessionStorage as if from a previous page load
    sessionStorage.setItem(
      "scrollRestoration-session-key",
      JSON.stringify({ scrollTop: 500, scrollLeft: 25 })
    );

    render(() => <TestComponent persist="sessionStorage" overrideKey="session-key" />);

    expect(element.scrollTo).toHaveBeenCalledWith(25, 500);
  });

  it("should restore scroll position from localStorage on fresh mount", () => {
    // Pre-populate localStorage as if from a previous session
    localStorage.setItem(
      "scrollRestoration-local-key",
      JSON.stringify({ scrollTop: 750, scrollLeft: 10 })
    );

    render(() => <TestComponent persist="localStorage" overrideKey="local-key" />);

    expect(element.scrollTo).toHaveBeenCalledWith(10, 750);
  });

  it("should not persist when persist is false", () => {
    render(() => <TestComponent />);

    element.scrollTop = 100;
    element.dispatchEvent(new Event("scroll"));
    vi.advanceTimersByTime(20);

    // Nothing should be in storage
    expect(localStorage.getItem("scrollRestoration-test-key")).toBeNull();
    expect(sessionStorage.getItem("scrollRestoration-test-key")).toBeNull();
  });
});
