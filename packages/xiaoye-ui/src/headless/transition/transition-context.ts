import { provide, ref, watch } from "vue";
import type { ComputedRef, Ref, ShallowRef, TriggerFunc } from "./types";

export interface TransitionChildContext {
  isVisible: Ref<boolean>;
  isTransitioning: Ref<boolean>;
  show: Ref<boolean>;
  registerTransition: (enter: TriggerFunc, leave: TriggerFunc) => () => void;
}

export const TRANSITION_CHILD_CONTEXT = Symbol("xy-transition-child-context");

export function provideTransitionContext() {
  const isVisible = ref(false);
  const isTransitioning = ref(false);
  const show = ref(false);
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

  watch(
    show,
    (val) => {
      isVisible.value = val;
    },
    { immediate: true }
  );

  const context: TransitionChildContext = {
    isVisible,
    isTransitioning,
    show,
    registerTransition
  };

  provide(TransitionChild_CONTEXT, context);

  return { enter, leave, context };
}
