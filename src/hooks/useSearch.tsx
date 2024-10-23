import {
  _PodcastHit,
  _PodcastSearchResponse,
  typesense,
} from '@/lib/typesense';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function useSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get('q');
  const currentPage = parseInt(searchParams.get('page') || '1');

  const [base64Audio, setBase64Audio] = useState<string | null>(null);
  const [hits, setHits] = useState<_PodcastHit[]>([]);
  const [maxNumPages, setMaxNumPages] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [isTranscribingVoice, setIsTranscribingVoice] = useState(false);

  const HITS_PER_PAGE = 20;

  const handleBase64AudioChange = async (audioString: string | null) => {
    if (!audioString) return;
    setBase64Audio(audioString);
    setIsLoading(true);
    setIsTranscribingVoice(true);
    const voice_query = audioString.split('data:audio/wav;base64,')[1];
    try {
      const results = await typesense.multiSearch.perform({
        searches: [
          {
            collection: 'podcasts',
            query_by: 'title,author,description',
            voice_query,
            per_page: HITS_PER_PAGE,
          },
        ],
      });
      const res = results.results?.[0] as _PodcastSearchResponse;
      const transcribedQuery =
        res.request_params.voice_query?.transcribed_query?.trim() || '';

      setHits(res.hits || []);
      setMaxNumPages(Math.ceil(res.found / HITS_PER_PAGE));

      searchParams.set('q', transcribedQuery);
      searchParams.set('page', '1');
      setSearchParams(searchParams);
    } catch (error) {
      toast.error('Sorry, there is an error. Please try again.');
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsTranscribingVoice(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    (async (q: string) => {
      try {
        const results = await typesense
          .collections('podcasts')
          .documents()
          .search({
            q,
            query_by: 'title,author,description',
            per_page: HITS_PER_PAGE,
            page: currentPage,
          });

        setHits((results.hits as _PodcastHit[]) || []);
        setMaxNumPages(Math.ceil(results.found / HITS_PER_PAGE));
      } catch (error) {
        toast.error('Sorry, there is an error. Please try again.');
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })(q || '*');
  }, [q, currentPage]);

  return {
    hits,
    isLastPage: currentPage >= maxNumPages,
    isLoading,
    isTranscribingVoice,
    base64Audio,
    pagination: { currentPage, maxNumPages },
    handleBase64AudioChange,
  };
}
