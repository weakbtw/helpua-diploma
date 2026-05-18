export function showToast(message) {
  const event = new CustomEvent('show-toast', { detail: message });
  window.dispatchEvent(event);
}
