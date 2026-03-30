export interface ImportWizardStep {
  key: string;
  title: string;
  description?: string;
}

export interface ImportWizardProps {
  title?: string;
  steps: ImportWizardStep[];
  active?: number;
  defaultActive?: number;
}
