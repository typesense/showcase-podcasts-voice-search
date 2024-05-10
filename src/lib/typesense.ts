import Typesense from 'typesense';

export const typesense = new Typesense.Client({
  apiKey: import.meta.env.VITE_TYPESENSE_SEARCH_ONLY_API_KEY || 'xyz',
  nodes: [
    {
      host: import.meta.env.VITE_TYPESENSE_HOST || 'localhost',
      port: parseInt(import.meta.env.VITE_TYPESENSE_PORT || '8108'),
      protocol: import.meta.env.VITE_TYPESENSE_PROTOCOL || 'http',
    },
  ],
  connectionTimeoutSeconds: 60 * 60,
});
