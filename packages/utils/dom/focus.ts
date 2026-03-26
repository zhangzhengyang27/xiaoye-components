const focusableSelector =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function getFocusableElements(container: HTMLElement | null) {
  if (!container) {
    return [];
  }

  return [...container.querySelectorAll<HTMLElement>(focusableSelector)].filter(
    (element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true"
  );
}

export function focusFirstDescendant(container: HTMLElement | null) {
  const [first] = getFocusableElements(container);

  if (first) {
    first.focus();
    return first;
  }

  return null;
}

export function trapFocus(container: HTMLElement | null, event: KeyboardEvent) {
  if (!container || event.key !== "Tab") {
    return false;
  }

  const focusableElements = getFocusableElements(container);

  if (!focusableElements.length) {
    event.preventDefault();
    container.focus();
    return true;
  }

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  const active = document.activeElement as HTMLElement | null;

  if (event.shiftKey && (active === first || active === container)) {
    event.preventDefault();
    last.focus();
    return true;
  }

  if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
    return true;
  }

  return false;
}
