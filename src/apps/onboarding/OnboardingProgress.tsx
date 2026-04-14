'use client';

import * as React from 'react';
import { Box, CircularProgress, Typography } from '@mui/joy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { XENTRALIA_BRAND } from '~/modules/xentralia/xentralia.config';
import { useOnboardingState } from './store-onboarding';

const STAGES = [
  'Analyzing your requirements',
  'Configuring AI persona',
  'Preparing multi-model comparison'
];

export function OnboardingProgress() {
  const { processingStage } = useOnboardingState();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
        maxWidth: 500,
        backgroundColor: 'rgba(30,41,59,0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(148,163,184,0.1)',
        borderRadius: 'lg',
        p: 4,
        mx: 'auto',
      }}
    >
      <Typography level="h3" sx={{ color: XENTRALIA_BRAND.colors.text, mb: 2, textAlign: 'center' }}>
        Setting up your workspace...
      </Typography>

      {STAGES.map((stage, index) => {
        const isCompleted = processingStage > index;
        const isCurrent = processingStage === index;
        const isPending = processingStage < index;

        return (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              opacity: isPending ? 0.4 : 1,
              transition: 'opacity 0.3s ease',
            }}
          >
            <Box sx={{ width: 24, display: 'flex', justifyContent: 'center' }}>
              {isCompleted ? (
                <CheckCircleOutlineIcon sx={{ color: XENTRALIA_BRAND.colors.primary }} />
              ) : isCurrent ? (
                <CircularProgress size="sm" sx={{ color: XENTRALIA_BRAND.colors.primary }} />
              ) : (
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: XENTRALIA_BRAND.colors.textMuted }} />
              )}
            </Box>
            <Typography
              level={isCurrent ? 'title-md' : 'body-md'}
              sx={{
                color: isCurrent ? XENTRALIA_BRAND.colors.text : XENTRALIA_BRAND.colors.textMuted,
                transition: 'all 0.3s ease',
              }}
            >
              {stage}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
