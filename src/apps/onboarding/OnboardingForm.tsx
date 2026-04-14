'use client';

import * as React from 'react';
import { Box, Button, FormControl, FormHelperText, FormLabel, Input, Option, Select, Textarea } from '@mui/joy';
import { INDUSTRY_OPTIONS, XENTRALIA_BRAND } from '~/modules/xentralia/xentralia.config';
import { useOnboardingState } from './store-onboarding';
import { hasValidationErrors, validateOnboardingForm, ValidationErrors } from './onboarding.types';

export function OnboardingForm() {
  const { companyName, useCase, industry, setCompanyName, setUseCase, setIndustry, generatePersona } = useOnboardingState();
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateOnboardingForm({ companyName, useCase, industry });
    setErrors(validationErrors);

    if (!hasValidationErrors(validationErrors)) {
      setIsSubmitting(true);
      try {
        await generatePersona();
      } catch (err) {
        console.error('Failed to generate persona', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
        maxWidth: 500,
        backgroundColor: '#1d1d1d',
        border: '1px solid #2c2c2c',
        borderRadius: 'lg',
        p: 4,
        mx: 'auto',
      }}
    >
      <FormControl error={!!errors.companyName} required>
        <FormLabel sx={{ color: XENTRALIA_BRAND.colors.text }}>Company Name</FormLabel>
        <Input
          placeholder="e.g., Acme Corporation"
          value={companyName}
          onChange={(e) => {
            setCompanyName(e.target.value);
            if (errors.companyName) setErrors({ ...errors, companyName: undefined });
          }}
          sx={{ backgroundColor: '#111111', color: XENTRALIA_BRAND.colors.text }}
        />
        {errors.companyName && <FormHelperText>{errors.companyName}</FormHelperText>}
      </FormControl>

      <FormControl error={!!errors.useCase} required>
        <FormLabel sx={{ color: XENTRALIA_BRAND.colors.text }}>Use Case</FormLabel>
        <Textarea
          minRows={4}
          placeholder="e.g., Answer customer support questions about our products..."
          value={useCase}
          onChange={(e) => {
            setUseCase(e.target.value);
            if (errors.useCase) setErrors({ ...errors, useCase: undefined });
          }}
          sx={{ backgroundColor: '#111111', color: XENTRALIA_BRAND.colors.text }}
          endDecorator={
            <Box sx={{ ml: 'auto', fontSize: 'xs', color: XENTRALIA_BRAND.colors.textMuted }}>
              {useCase.length}/1000
            </Box>
          }
        />
        {errors.useCase && <FormHelperText>{errors.useCase}</FormHelperText>}
      </FormControl>

      <FormControl error={!!errors.industry}>
        <FormLabel sx={{ color: XENTRALIA_BRAND.colors.text }}>Industry (Optional)</FormLabel>
        <Select
          placeholder="Select an industry..."
          value={industry}
          onChange={(_e, newValue) => {
            setIndustry(newValue);
            if (errors.industry) setErrors({ ...errors, industry: undefined });
          }}
          sx={{ backgroundColor: '#111111', color: XENTRALIA_BRAND.colors.text }}
        >
          {INDUSTRY_OPTIONS.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
        {errors.industry && <FormHelperText>{errors.industry}</FormHelperText>}
      </FormControl>

      <Button
        type="submit"
        size="lg"
        loading={isSubmitting}
        sx={{
          mt: 2,
          backgroundColor: '#ffffff',
          color: '#111111',
          fontWeight: 'xl',
          '&:hover': {
            backgroundColor: '#e8e8e8',
          },
        }}
      >
        Create Persona
      </Button>
    </Box>
  );
}
