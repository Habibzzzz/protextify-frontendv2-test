const DATA_REFRESH_EVENT = "protextify:data-refresh";

export const emitDataRefresh = (scope = "global", meta = {}) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(DATA_REFRESH_EVENT, {
      detail: {
        scope,
        meta,
        emittedAt: Date.now(),
      },
    })
  );
};

export const subscribeDataRefresh = (handler) => {
  if (typeof window === "undefined") return () => {};

  const wrappedHandler = (event) => {
    handler(event?.detail || {});
  };

  window.addEventListener(DATA_REFRESH_EVENT, wrappedHandler);

  return () => {
    window.removeEventListener(DATA_REFRESH_EVENT, wrappedHandler);
  };
};

