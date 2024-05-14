export default function useSearchParams() {
  const push = (obj) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(obj).forEach(([k, v]) => {
      if (v) {
        params.set(k, v);
      } else {
        params.delete(k);
      }
    });
    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  return { urlParams: new URLSearchParams(window.location.search), push };
}
