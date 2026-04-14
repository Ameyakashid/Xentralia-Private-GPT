'use client';

import * as React from 'react';
import { useRouter } from 'next/router';
import { Box } from '@mui/joy';

import { XentraliaBranding } from '~/modules/xentralia/XentraliaBranding';
import { OnboardingForm } from './OnboardingForm';
import { OnboardingProgress } from './OnboardingProgress';
import { useOnboardingState } from './store-onboarding';
import { ROUTE_APP_CHAT } from '~/common/app.routes';

export function Onboarding() {
  const router = useRouter();
  const { currentStep, generatedPersonaId } = useOnboardingState();

  React.useEffect(() => {
    if (currentStep === 'complete' && generatedPersonaId) {
      router.push({
        pathname: ROUTE_APP_CHAT,
        query: { persona: generatedPersonaId, beam: 'true' }
      });
    }
  }, [currentStep, generatedPersonaId, router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111111',
        p: 3,
      }}
    >
      <Box sx={{ mb: 4 }}>
        <XentraliaBranding />
      </Box>

      {currentStep === 'form' ? (
        <OnboardingForm />
      ) : (
        <OnboardingProgress />
      )}
    </Box>
  );
}
