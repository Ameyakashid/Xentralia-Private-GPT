'use client';

import * as React from 'react';
import { Box, Typography } from '@mui/joy';
import { XENTRALIA_BRAND } from './xentralia.config';

export function XentraliaBranding() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
      <Typography
        level="h1"
        sx={{
          fontSize: '3rem',
          fontWeight: 'xl',
          color: XENTRALIA_BRAND.colors.text,
          mb: 1,
        }}
      >
        {XENTRALIA_BRAND.name}
      </Typography>
      <Typography
        level="body-md"
        sx={{
          color: XENTRALIA_BRAND.colors.textMuted,
          fontWeight: 'md',
        }}
      >
        {XENTRALIA_BRAND.tagline}
      </Typography>
    </Box>
  );
}
