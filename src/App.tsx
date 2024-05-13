import { useEffect, useState } from 'react';
import {
  _PodcastHit,
  _PodcastSearchResponse,
  typesense,
} from './lib/typesense';
import VoiceSearchPopup from './components/VoiceRecordingPopup';
import { Button } from './components/ui/button';
import { LucideSearch, MicIcon } from 'lucide-react';
import Heading from './components/Heading';

function App() {
  const [base64Audio, setBase64Audio] = useState<string | null>(null);
  const [data, setData] = useState<_PodcastHit[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const abortController = new AbortController();

    if (!base64Audio) return setData([]);
    const fetchAutocomplete = async (base64Audio: string) => {
      try {
        const results = await typesense.multiSearch.perform({
          searches: [
            {
              collection: 'podcasts',
              query_by: 'title,author,description',
              voice_query: base64Audio,
              per_page: 20,
            },
          ],
        });
        const res = results.results?.[0] as _PodcastSearchResponse;

        setData(res.hits || []);
        setQuery(
          res.request_params.voice_query?.transcribed_query.trim() || ''
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchAutocomplete(base64Audio.split('data:audio/wav;base64,')[1]);

    return () => {
      abortController.abort();
    };
  }, [base64Audio]);

  return (
    <main className='max-w-3xl m-auto py-10'>
      <Heading />
      <div className='flex gap-2 mb-8'>
        <div className='relative w-full'>
          <LucideSearch className='absolute top-1/2 -translate-y-1/2 left-4 stroke-1 size-5 stroke-muted-foreground' />
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='flex h-10 w-full px-12 rounded-3xl border border-input bg-background py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50'
            placeholder='Search...'
          />
        </div>
        <VoiceSearchPopup
          handleBase64AudioChange={(base64Audio) => setBase64Audio(base64Audio)}
        >
          <Button className='rounded-full' size='icon'>
            <MicIcon className='size-5' />
          </Button>
        </VoiceSearchPopup>
      </div>
      {data && (
        <ul className='flex flex-col gap-2'>
          {data.map(
            ({ document: { title, description, author, image, id } }) => (
              <li
                className='p-2 flex h-28 hover:bg-muted transition rounded-lg border'
                key={id}
              >
                <img
                  className='h-full aspect-square rounded-lg'
                  src={image}
                  alt={`${title}: ${description}`}
                />
                <div className='flex flex-col items-start text-left px-4 py-0.5'>
                  <h3 className='text-base font-medium line-clamp-1'>
                    {title}
                  </h3>
                  <small className='text-xs mb-3 line-clamp-1'>{author}</small>
                  <p className='line-clamp-2 text-xs text-muted-foreground'>
                    {description}
                  </p>
                </div>
              </li>
            )
          )}
        </ul>
      )}
      {base64Audio && (
        <audio
          className='h-12 fixed bottom-4 right-4'
          controls
          src={base64Audio}
        ></audio>
      )}
    </main>
  );
}

export default App;
