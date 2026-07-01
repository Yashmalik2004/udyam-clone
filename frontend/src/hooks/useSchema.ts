import { useState, useEffect } from 'react';
import { fetchFormSchema } from '../services/schema.service';
import type { FormSchema } from '../types/schema.types';

/**
 * Custom hook to fetch and manage the dynamic form schema.
 * Caches the schema in state to prevent multiple network calls.
 */
export const useSchema = () => {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadSchema = async () => {
      try {
        setLoading(true);
        const data = await fetchFormSchema();
        if (isMounted) {
          setSchema(data);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch form schema');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSchema();

    return () => {
      isMounted = false;
    };
  }, []);

  return { schema, loading, error };
};
