// src/hooks/useAsyncData.js
import { useState, useEffect, useCallback, useRef } from "react";
import { subscribeDataRefresh } from "../utils/refetchBus";

export const useAsyncData = (asyncFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastRefreshAtRef = useRef(0);

  // Options with sensible defaults
  const {
    refetchOnWindowFocus = true,
    pollIntervalMs = null, // e.g., 30000 for 30s
  } = options || {};

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      setData(result);
    } catch (err) {
      // Format error dari BE: { statusCode, message }
      const formattedError = {
        statusCode: err?.response?.data?.statusCode || err?.statusCode || 400,
        message:
          err?.response?.data?.message || err?.message || "Terjadi kesalahan",
      };
      setError(formattedError);
      setData(null); // Reset data on error
      console.error("Async data fetch error:", formattedError);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto refetch on window focus (helps after grading/payment etc.)
  useEffect(() => {
    if (!refetchOnWindowFocus) return;
    const onFocus = () => fetchData();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchData, refetchOnWindowFocus]);

  // Optional lightweight polling
  useEffect(() => {
    if (!pollIntervalMs || typeof pollIntervalMs !== "number") return;
    const interval = setInterval(() => fetchData(), pollIntervalMs);
    return () => clearInterval(interval);
  }, [fetchData, pollIntervalMs]);

  // Global refetch bus for important mutations (class creation, payments, submissions, etc.)
  useEffect(() => {
    const unsubscribe = subscribeDataRefresh(() => {
      const now = Date.now();
      // Avoid burst refetches when multiple mutations happen back-to-back.
      if (now - lastRefreshAtRef.current < 1200) return;
      lastRefreshAtRef.current = now;
      fetchData();
    });

    return unsubscribe;
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

export default useAsyncData;
