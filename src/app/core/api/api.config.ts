declare global {
  interface Window {
    __CHILLSAGE_API_BASE_URL__?: string;
  }
}

const DEFAULT_API_BASE_URL = 'http://localhost:3037/api';

export const API_BASE_URL = window.__CHILLSAGE_API_BASE_URL__?.trim() || DEFAULT_API_BASE_URL;
