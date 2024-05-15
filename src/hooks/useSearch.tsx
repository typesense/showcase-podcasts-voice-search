import {
  _PodcastHit,
  _PodcastSearchResponse,
  typesense,
} from '@/lib/typesense';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function useSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get('q');
  const currentPage = parseInt(searchParams.get('page') || '1');

  const [base64Audio, setBase64Audio] = useState<string | null>(null);
  const [hits, setHits] = useState<_PodcastHit[]>([]);
  const [maxNumPages, setMaxNumPages] = useState(5);
  const [isLastPage, setIsLastPage] = useState(false);

  const handleBase64AudioChange = async (audioString: string | null) => {
    if (!audioString) return;
    setBase64Audio(audioString);
    const voice_query = audioString.split('data:audio/wav;base64,')[1];
    try {
      const results = await typesense.multiSearch.perform({
        searches: [
          {
            collection: 'podcasts',
            query_by: 'title,author,description',
            voice_query,
            per_page: 20,
          },
        ],
      });
      const res = results.results?.[0] as _PodcastSearchResponse;
      console.log('voice', results.results);

      setHits(res.hits || []);
      setMaxNumPages(Math.ceil(res.found / 20));
      searchParams.set(
        'q',
        res.request_params.voice_query?.transcribed_query.trim() || ''
      );
      searchParams.set('page', '1');
      setSearchParams(searchParams);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();

    (async (q: string) => {
      if (currentPage >= maxNumPages) return setIsLastPage(true);
      try {
        const results = await typesense
          .collections('podcasts')
          .documents()
          .search({
            q,
            query_by: 'title,author,description',
            per_page: 20,
            page: currentPage,
          });
        console.log(results);

        setHits((results.hits as _PodcastHit[]) || []);
        setMaxNumPages(Math.ceil(results.found / 20));
      } catch (error) {
        console.log(error);
      }
    })(q || '*');

    return () => {
      abortController.abort();
    };
  }, [q, currentPage]);

  return {
    hits,
    base64Audio,
    pagination: { currentPage, maxNumPages },
    handleBase64AudioChange,
  };
}
