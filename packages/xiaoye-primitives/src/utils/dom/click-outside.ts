export function bindClickOutside(
  container: HTMLElement,
  handler: (event: Event) => void
) {
  const listener = (event: Event) => {
    const target = event.target as Node | null;

    if (!target || container.contains(target)) {
      return;
    }

    handler(event);
  };

  document.addEventListener("mousedown", listener);
  document.addEventListener("touchstart", listener);

  return () => {
    document.removeEventListener("mousedown", listener);
    document.removeEventListener("touchstart", listener);
  };
}

