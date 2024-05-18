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
      url: import.meta.env.VITE_TYPESENSE_URL || 'http://localhost:8108',
    },
  ],
  connectionTimeoutSeconds: 60 * 60,
});
