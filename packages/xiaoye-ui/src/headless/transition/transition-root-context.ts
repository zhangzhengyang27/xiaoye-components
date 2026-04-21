import type { Ref, ShallowRef, TriggerFunc } from "./types";

export interface TransitionRootContext {
  show: Ref<boolean>;
  isVisible: Ref<boolean>;
  isTransitioning: Ref<boolean>;
  registerTransition: (enter: TriggerFunc, leave: TriggerFunc) => () => void;
  open: () => Promise<void>;
  close: () => Promise<void>;
}

export const TRANSITION_ROOT_CONTEXT = Symbol("xy-transition-root-context");

export function createTransitionRootContext(initialShow = false) {
  const show = ref(initialShow);
  const isVisible = ref(initialShow);
  const isTransitioning = ref(false);
  const transitions: Array<{ enter: TriggerFunc; leave: TriggerFunc }> = [];
  let leaveTimer: ReturnType<typeof setTimeout> | null = null;

  function registerTransition(enter: TriggerFunc, leave: TriggerFunc) {
    transitions.push({ enter, leave });
    return () => {
      const index = transitions.findIndex((t) => t.enter === enter && t.leave === leave);
      if (index > -1) {
        transitions.splice(index, 1);
      }
    };
  }

  async function enter() {
    if (leaveTimer) {
      clearTimeout(leaveTimer);
      leaveTimer = null;
    }

    isTransitioning.value = true;
    show.value = true;

    await Promise.all(transitions.map((t) => t.enter()));

    isTransitioning.value = false;
  }

  async function leave() {
    if (transitions.length === 0) {
      show.value = false;
      isTransitioning.value = false;
      isVisible.value = false;
      return;
    }

    isTransitioning.value = true;

    await Promise.all(transitions.map((t) => t.leave()));

    isTransitioning.value = false;
    show.value = false;
    isVisible.value = false;
  }

  async function open() {
    if (show.value) return;
    await enter();
  }

  async function close() {
    if (!show.value) return;
    await leave();
  }

  const context: TransitionRootContext = {
    show,
    isVisible,
    isTransitioning,
    registerTransition,
    open,
    close
  };

  return { context, registerTransition };
}
