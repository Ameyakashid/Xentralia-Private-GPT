import * as React from 'react';

import { Onboarding } from '../src/apps/onboarding/Onboarding';
import { withNextJSPerPageLayout } from '~/common/layout/withLayout';

export default withNextJSPerPageLayout({ type: 'noop' }, () => {
  return <Onboarding />;
});
