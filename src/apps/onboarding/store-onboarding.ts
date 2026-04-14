import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { generatePersona } from '~/modules/xentralia/persona-generator';
import { prependSimplePersona, useAppPersonasStore } from '../../apps/personas/store-app-personas';

export type OnboardingStep = 'form' | 'processing' | 'complete';

interface OnboardingStore {
  companyName: string;
  useCase: string;
  industry: string | null;
  generatedPersonaId: string | null;
  currentStep: OnboardingStep;
  processingStage: number;

  setCompanyName: (companyName: string) => void;
  setUseCase: (useCase: string) => void;
  setIndustry: (industry: string | null) => void;

  generatePersona: () => Promise<void>;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(persist(
  (set, get) => ({
    companyName: '',
    useCase: '',
    industry: null,
    generatedPersonaId: null,
    currentStep: 'form',
    processingStage: 0,

    setCompanyName: (companyName) => set({ companyName }),
    setUseCase: (useCase) => set({ useCase }),
    setIndustry: (industry) => set({ industry }),

    generatePersona: async () => {
      set({ currentStep: 'processing', processingStage: 0 });

      // Simulate stage 1: Analyzing requirements
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ processingStage: 1 });

      // Simulate stage 2: Configuring AI persona
      const { companyName, useCase, industry } = get();
      const persona = generatePersona({ companyName, useCase, industry });

      // Save to Big-AGI's simple persona store
      prependSimplePersona(persona.systemPrompt, `${persona.title} - ${persona.description}`);

      // Wait for it to be persisted in the store so we can retrieve the generated ID
      const newPersonaId = useAppPersonasStore.getState().simplePersonas[0]?.id || persona.id;

      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ processingStage: 2 });

      // Simulate stage 3: Preparing multi-model comparison
      await new Promise(resolve => setTimeout(resolve, 1000));

      set({
        processingStage: 3,
        currentStep: 'complete',
        generatedPersonaId: newPersonaId
      });
    },

    reset: () => set({
      companyName: '',
      useCase: '',
      industry: null,
      generatedPersonaId: null,
      currentStep: 'form',
      processingStage: 0
    }),
  }),
  {
    name: 'app-onboarding',
    version: 1,
  }
));

export function useOnboardingState() {
  return useOnboardingStore(useShallow(state => ({
    companyName: state.companyName,
    useCase: state.useCase,
    industry: state.industry,
    generatedPersonaId: state.generatedPersonaId,
    currentStep: state.currentStep,
    processingStage: state.processingStage,
    setCompanyName: state.setCompanyName,
    setUseCase: state.setUseCase,
    setIndustry: state.setIndustry,
    generatePersona: state.generatePersona,
    reset: state.reset,
  })));
}
