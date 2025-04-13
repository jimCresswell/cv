// src/hooks/use-click-outside.ts
import { useEffect, type RefObject } from "react";

type EventType = "mousedown" | "mouseup" | "touchstart" | "touchend";

/**
 * Custom hook to detect clicks outside a specified element or elements.
 *
 * @param refs - A single ref or an array of refs to the element(s) to track.
 * @param handler - The callback function to execute when a click outside is detected.
 * @param eventType - The type of event to listen for (default: 'mousedown').
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  refs: RefObject<T | null> | RefObject<T | null>[],
  handler: (event: MouseEvent | TouchEvent) => void,
  eventType: EventType = "mousedown",
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      // Ensure target is an instanceof Node
      if (!target || !target.isConnected) {
        return;
      }

      const elements = (Array.isArray(refs) ? refs : [refs])
        .map((ref) => ref.current)
        .filter((el): el is T => el !== null); // Filter out null refs

      // Do nothing if the click is inside any of the tracked elements or their descendants
      if (elements.some((el) => el.contains(target))) {
        return;
      }

      handler(event);
    };

    document.addEventListener(eventType, listener);
    // Add touch event listener as well for mobile devices
    if (eventType === "mousedown") {
      document.addEventListener("touchstart", listener);
    }

    return () => {
      document.removeEventListener(eventType, listener);
      if (eventType === "mousedown") {
        document.removeEventListener("touchstart", listener);
      }
    };
  }, [refs, handler, eventType]); // Re-run if refs or handler change
}
