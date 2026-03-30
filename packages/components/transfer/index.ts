import Transfer from "./src/transfer.vue";
import type { TransferItem, TransferKey, TransferProps } from "./src/transfer";
import { withInstall } from "@xiaoye/utils";

export type { TransferItem, TransferKey, TransferProps };

export const XyTransfer = withInstall(Transfer, "xy-transfer");
export default XyTransfer;
