import { useEffect, useState } from 'react';
import {
  _PodcastHit,
  _PodcastSearchResponse,
  typesense,
} from './lib/typesense';
import VoiceSearchPopup from './components/VoiceRecordingPopup';
import { Button } from './components/ui/button';
import { MicIcon } from 'lucide-react';
import Heading from './components/Heading';
import Hits from './components/Hits';
import SearchBox from './components/SearchBox';
import useSearchParams from './hooks/useSearchParams';
import SearchPagination from './components/SearchPagination';
import AudioPreview from './components/AudioPreview';

function App() {
  const { urlParams, push } = useSearchParams();
  const q = urlParams.get('q');
  const page = parseInt(urlParams.get('page') || '1');
  const [base64Audio, setBase64Audio] = useState<string | null>(null);
  const [data, setData] = useState<_PodcastHit[]>([]);
  const [maxPages, setMaxPages] = useState(100);
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

      setData(res.hits || []);
      push({
        q: res.request_params.voice_query?.transcribed_query.trim() || '',
        page: 1,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();

    (async (q: string) => {
      if (page >= maxPages) return setIsLastPage(true);
      try {
        const results = await typesense
          .collections('podcasts')
          .documents()
          .search({
            q,
            collection: 'podcasts',
            query_by: 'title,author,description',
            per_page: 20,
            page,
          });
        console.log(results);

        setData((results.hits as _PodcastHit[]) || []);
      } catch (error) {
        console.log(error);
      }
    })(q || '*');

    return () => {
      abortController.abort();
    };
  }, [page]);

  return (
    <main className='max-w-3xl m-auto py-10'>
      <Heading />
      <div className='flex gap-2 mb-8'>
        <SearchBox />
        <VoiceSearchPopup handleBase64AudioChange={handleBase64AudioChange}>
          <Button className='rounded-full' size='icon'>
            <MicIcon className='size-5' />
          </Button>
        </VoiceSearchPopup>
      </div>
      {data && <Hits data={data} />}
      <SearchPagination pagination={{ currentPage: page, maxPages }} />
      {base64Audio && <AudioPreview base64Audio={base64Audio} />}
    </main>
  );
}

export default App;
