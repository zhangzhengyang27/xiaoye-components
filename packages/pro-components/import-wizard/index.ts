import ImportWizard from "./src/import-wizard.vue";
import type { ImportWizardProps, ImportWizardStep } from "./src/import-wizard";
import { withInstall } from "@xiaoye/utils";

export type { ImportWizardProps, ImportWizardStep };

export const XyImportWizard = withInstall(ImportWizard, "xy-import-wizard");

export default XyImportWizard;
