import { useState } from 'react';
import api from '../utils/api';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const call = async (apiCall: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { call, loading, error, setError };
}