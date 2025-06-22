'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

type FlowState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

export function useFlowState<T, U>(flow: (input: U) => Promise<T>) {
  const [state, setState] = useState<FlowState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });
  const { toast } = useToast();

  const runFlow = useCallback(
    async (input: U) => {
      setState({ data: null, isLoading: true, error: null });
      try {
        const result = await flow(input);
        setState({ data: result, isLoading: false, error: null });
        return result;
      } catch (e: any) {
        const errorMessage = e.message || 'An unexpected error occurred.';
        setState({ data: null, isLoading: false, error: errorMessage });
        toast({
          variant: 'destructive',
          title: 'AI Suggesion Failed',
          description: errorMessage,
        });
        return null;
      }
    },
    [flow, toast]
  );
  
  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);


  return { ...state, runFlow, reset };
}
