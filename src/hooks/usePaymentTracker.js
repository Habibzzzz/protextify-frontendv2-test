// src/hooks/usePaymentTracker.js
import { useState, useEffect, useRef, useCallback } from "react";
import { paymentsService } from "../services";
import { PAYMENT_CONFIG, PAYMENT_STATUS } from "../utils/constants";

export const usePaymentTracker = (
  orderId,
  initialStatus, // 1. Tambahkan initialStatus
  options = {},
  isActive = false
) => {
  const [status, setStatus] = useState(
    initialStatus || PAYMENT_STATUS.PENDING // 2. Gunakan initialStatus
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const {
    pollingInterval = PAYMENT_CONFIG.POLLING_INTERVAL,
    maxAttempts = PAYMENT_CONFIG.MAX_POLLING_ATTEMPTS,
    timeout = PAYMENT_CONFIG.PAYMENT_TIMEOUT,
    onStatusChange,
    onSuccess,
    onFailure,
    onTimeout,
  } = options;

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      console.log(
        `%c[PaymentTracker] STOP POLLING (Interval ID: ${intervalRef.current})`,
        "color: red; font-weight: bold;"
      );
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const checkStatus = useCallback(async () => {
    if (!orderId) return;

    console.log(
      `%c[PaymentTracker] CHECKING STATUS (Attempt: ${
        attempts + 1
      }) for Order ID: ${orderId}`,
      "color: blue;"
    );
    setLoading(true);

    try {
      const response = await paymentsService.getPaymentStatus(orderId);
      const newStatus = response.status;
      console.log(`[PaymentTracker] API Response: Status is ${newStatus}`);

      if ([PAYMENT_STATUS.SUCCESS, PAYMENT_STATUS.FAILED].includes(newStatus)) {
        console.log(
          `[PaymentTracker] Final status (${newStatus}) received. Stopping polling.`
        );
        stopPolling();
        if (newStatus === PAYMENT_STATUS.SUCCESS && onSuccess) {
          console.log("[PaymentTracker] Calling onSuccess callback.");
          onSuccess(response);
        } else if (newStatus === PAYMENT_STATUS.FAILED && onFailure) {
          console.log("[PaymentTracker] Calling onFailure callback.");
          onFailure(response);
        }
      }

      if (newStatus !== status) {
        console.log(
          `[PaymentTracker] Status changed from ${status} to ${newStatus}. Updating state.`
        );
        setStatus(newStatus);
        if (onStatusChange) onStatusChange(newStatus, response);
      }

      setAttempts((prev) => prev + 1);

      if (attempts + 1 >= maxAttempts) {
        stopPolling();
      }
    } catch (err) {
      console.error("[PaymentTracker] API Error:", err.message);
      setError({ message: "Gagal cek status pembayaran" });
      stopPolling();
      if (onFailure) onFailure(err);
    } finally {
      setLoading(false);
    }
  }, [
    orderId,
    status,
    attempts,
    maxAttempts,
    onStatusChange,
    onSuccess,
    onFailure,
    stopPolling,
  ]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return;
    console.log(
      `%c[PaymentTracker] START POLLING for Order ID: ${orderId}`,
      "color: green; font-weight: bold;"
    );
    checkStatus();
    intervalRef.current = setInterval(checkStatus, pollingInterval);
  }, [checkStatus, orderId, pollingInterval]);

  const refreshStatus = () => {
    checkStatus();
  };

  useEffect(() => {
    console.log(
      `[PaymentTracker] Effect triggered. isActive: ${isActive}, initialStatus: ${initialStatus}`
    );

    // 3. Hanya mulai polling jika tab aktif DAN status awal adalah PENDING.
    if (orderId && isActive && initialStatus === PAYMENT_STATUS.PENDING) {
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [orderId, isActive, initialStatus, startPolling, stopPolling]);

  return {
    status,
    loading,
    error,
    attempts,
    refreshStatus,
    isPolling: !!intervalRef.current,
  };
};
