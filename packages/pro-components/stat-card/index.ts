import StatCard from "./src/stat-card.vue";
import type { StatCardProps, StatTrend } from "./src/stat-card";
import { withInstall } from "@xiaoye/utils";

export type { StatCardProps, StatTrend };

export const XyStatCard = withInstall(StatCard, "xy-stat-card");
export default XyStatCard;
