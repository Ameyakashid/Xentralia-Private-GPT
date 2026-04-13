import { INDUSTRY_OPTIONS } from '~/modules/xentralia/xentralia.config';

export interface OnboardingFormData {
  companyName: string;
  useCase: string;
  industry: string | null;
}

export interface ValidationErrors {
  companyName?: string;
  useCase?: string;
  industry?: string;
}

export function validateOnboardingForm(data: OnboardingFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const companyName = data.companyName.trim();
  if (!companyName) {
    errors.companyName = 'Company name is required';
  } else if (companyName.length < 2) {
    errors.companyName = 'Company name must be at least 2 characters';
  } else if (companyName.length > 100) {
    errors.companyName = 'Company name must be less than 100 characters';
  }

  const useCase = data.useCase.trim();
  if (!useCase) {
    errors.useCase = 'Use case is required';
  } else if (useCase.length < 20) {
    errors.useCase = 'Use case must be at least 20 characters';
  } else if (useCase.length > 1000) {
    errors.useCase = 'Use case must be less than 1000 characters';
  }

  if (data.industry) {
    const validIndustries = INDUSTRY_OPTIONS.map(opt => opt.value);
    if (!validIndustries.includes(data.industry)) {
      errors.industry = 'Invalid industry selected';
    }
  }

  return errors;
}

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
