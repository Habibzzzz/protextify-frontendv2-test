// src/services/payments.js
import api from "./api";
import { emitDataRefresh } from "../utils/refetchBus";

/**
 * Membuat transaksi pembayaran untuk aktivasi assignment atau top-up kredit.
 * @param {object} transactionData { amount, assignmentId? }
 * @returns {object} { transactionId, snapToken, paymentUrl, status }
 */
const createTransaction = async (transactionData) => {
  try {
    // Kirim hanya field yang diperlukan oleh BE
    const payload = {
      amount: transactionData.amount,
    };
    if (transactionData.assignmentId) {
      payload.assignmentId = transactionData.assignmentId;
    }
    const response = await api.post("/payments/create-transaction", payload);
    emitDataRefresh("payments", { action: "create-transaction" });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Mengirim webhook pembayaran (testing only, biasanya dipakai oleh Midtrans)
 * @param {object} webhookData
 * @returns {object} { message }
 */
const sendPaymentWebhook = async (webhookData) => {
  try {
    const response = await api.post("/payments/webhook", webhookData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Mendapat riwayat transaksi pembayaran instruktur (dengan pagination & filter)
 * @param {object} filters { page, limit, status, startDate, endDate, assignmentId }
 * @returns {object} { data, page, limit, total, totalPages }
 */
const getTransactionHistory = async (filters = {}) => {
  try {
    const response = await api.get("/payments/transactions", {
      params: {
        page: filters.page || 1,
        limit: filters.limit || 10,
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
        assignmentId: filters.assignmentId,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Mendapat detail transaksi pembayaran by ID
 * @param {string} transactionId
 * @returns {object} detail transaksi
 */
const getTransactionById = async (transactionId) => {
  try {
    const response = await api.get(`/payments/transactions/${transactionId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Mendapat status pembayaran berdasarkan orderId (polling)
 * @param {string} orderId
 * @returns {object} { status, ... }
 */
const getPaymentStatus = async (orderId) => {
  try {
    const response = await api.get(`/payments/status/${orderId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Menghasilkan dan mengunduh invoice transaksi.
 * @param {string} transactionId
 * @returns {Promise<object>} { downloadUrl, expiresAt, filename }
 */
const downloadInvoice = async (transactionId) => {
  try {
    const response = await api.post(
      `/payments/transactions/${transactionId}/download-invoice`
    );
    return response;
  } catch (error) {
    console.error("Failed to download invoice:", error);
    throw error;
  }
};

/**
 * Mengirim invoice transaksi ke email pengguna.
 * @param {string} transactionId
 * @returns {Promise<object>} { message }
 */
const emailInvoice = async (transactionId) => {
  try {
    const response = await api.post(
      `/payments/transactions/${transactionId}/email-invoice`
    );
    return response;
  } catch (error) {
    console.error("Failed to email invoice:", error);
    throw error;
  }
};

/**
 * Mengekspor riwayat transaksi ke CSV berdasarkan filter.
 * @param {object} filters { status, startDate, endDate, search }
 * @returns {Promise<object>} { downloadUrl, expiresAt, filename }
 */
const exportTransactions = async (filters) => {
  try {
    const response = await api.post("/payments/transactions/export", filters);
    return response;
  } catch (error) {
    console.error("Failed to export transactions:", error);
    throw error;
  }
};

/**
 * Membatalkan transaksi pembayaran
 * @param {string} transactionId
 * @returns {object} response BE
 */
const cancelPayment = async (transactionId) => {
  try {
    const response = await api.patch(
      `/payments/transactions/${transactionId}/cancel`
    );
    emitDataRefresh("payments", { action: "cancel", transactionId });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Mendapat daftar metode pembayaran yang tersedia
 * @returns {Array} array metode pembayaran
 */
const getPaymentMethods = async () => {
  try {
    const response = await api.get("/payments/methods");
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Mendapat statistik pembayaran (opsional, untuk dashboard)
 * @param {string} period
 * @returns {object} statistik pembayaran
 */
const getPaymentStats = async (period = "30d") => {
  try {
    const response = await api.get("/payments/stats", {
      params: { period },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Generate payment URL untuk metode tertentu (opsional, jika BE support)
 * @param {string} transactionId
 * @param {string} paymentMethod
 * @returns {object} { paymentUrl }
 */
const generatePaymentUrl = async (transactionId, paymentMethod) => {
  try {
    const response = await api.post(
      `/payments/transactions/${transactionId}/generate-url`,
      { paymentMethod }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const paymentsService = {
  createTransaction,
  sendPaymentWebhook,
  getTransactionHistory,
  getTransactionById,
  getPaymentStatus,
  downloadInvoice,
  emailInvoice,
  exportTransactions,
  cancelPayment,
  getPaymentMethods,
  getPaymentStats,
  generatePaymentUrl,
};

export default paymentsService;
