import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function untuk menggabungkan class names dengan Tailwind
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format mata uang Indonesia
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Truncate text dengan ellipsis
 */
export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Capitalize first letter
 */
export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Generate random string untuk token
 */
export function generateRandomString(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Sleep function untuk delay
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if user has permission
 */
export function hasPermission(userRole, requiredRole) {
  return userRole === requiredRole;
}

/**
 * Get initials from full name
 */
export function getInitials(fullName) {
  return fullName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Format date
 */
export const formatDate = (date, format = "dd/MM/yyyy") => {
  if (!date) return "-";

  const d = new Date(date);

  if (format === "dd/MM/yyyy") {
    return d.toLocaleDateString("id-ID");
  } else if (format === "dd/MM/yyyy HH:mm") {
    return d.toLocaleString("id-ID");
  } else if (format === "dd MMMM yyyy") {
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } else if (format === "dd MMMM yyyy HH:mm") {
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return d.toLocaleDateString("id-ID");
};

/**
 * Format date and time
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

/**
 * Formats a date string into a relative time string (e.g., "2 jam yang lalu").
 * Uses Intl.RelativeTimeFormat for localization.
 * @param {string | Date} date - The date to format.
 * @returns {string} The formatted relative time string.
 */
export const formatRelativeTime = (date) => {
  if (!date) return "";
  const dateObj = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((dateObj - now) / 1000);

  const rtf = new Intl.RelativeTimeFormat("id", { numeric: "auto" });

  const units = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const unit in units) {
    const interval = diffInSeconds / units[unit];
    if (Math.abs(interval) >= 1) {
      return rtf.format(Math.round(interval), unit);
    }
  }
  return rtf.format(diffInSeconds, "second");
};
