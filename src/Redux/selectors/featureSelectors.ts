import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { normalizeFeatureName } from '@/src/config/featureAccess';

// Raw subscription features array
const selectSubscriptionFeatures = (state: RootState) =>
  state.auth.user?.subscription_features || [];

export const selectNormalizedFeatureSet = createSelector(
  [selectSubscriptionFeatures],
  (features) => {
    const set = new Set<string>();
    for (const f of features) {
      const norm = normalizeFeatureName(f?.name);
      if (norm) set.add(norm);
    }
    return set;
  }
);
