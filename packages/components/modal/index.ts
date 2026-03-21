import Modal from "./src/modal.vue";
import type { ModalProps } from "./src/modal.vue";
import { withInstall } from "@xiaoye/utils";

export type { ModalProps };

export const XyModal = withInstall(Modal, "xy-modal");
export default XyModal;
