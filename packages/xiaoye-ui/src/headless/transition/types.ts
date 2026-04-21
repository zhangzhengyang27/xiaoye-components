export type TriggerFunc = () => void | Promise<void>;

export interface Ref<T> {
  value: T;
}

export interface ShallowRef<T> {
  value: T;
}

export interface ComputedRef<T> {
  value: T;
}
