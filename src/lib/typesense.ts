import Typesense from 'typesense';
import {
  SearchResponse,
  SearchResponseHit,
} from 'typesense/lib/Typesense/Documents';

export type _Podcast = {
  title: string;
  image: string;
  description: string;
  categories: string;
  author: string;
  id: string;
};
export type _PodcastHit = SearchResponseHit<_Podcast>;
export type _PodcastSearchResponse = SearchResponse<_Podcast>;

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
