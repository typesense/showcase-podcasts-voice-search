import { useEffect, useState } from 'react';
import './App.css';
import { typesense } from './lib/typesense';
import VoiceSearchPopup from './components/VoiceRecordingPopup';
import { Button } from './components/ui/button';
import { MicIcon } from 'lucide-react';

function App() {
  const [base64Audio, setBase64Audio] = useState<string | null>(null);
  const [data, setData] = useState<unknown[]>([]);

  useEffect(() => {
    const abortController = new AbortController();

    if (!base64Audio) return setData([]);
    const fetchAutocomplete = async (base64Audio: string) => {
      try {
        const results = await typesense.multiSearch.perform({
          searches: [
            {
              collection: 'DiffusionDB',
              query_by: 'prompt',
              voice_query: base64Audio,
            },
          ],
        });
        console.log(results);

        setData(results.results?.[0].hits as unknown[]);
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
    <>
      <h1 className='text-3xl font-semibold'>Voice query</h1>
      <h2 className='m-auto w-max text-sm'>
        powered by{' '}
        <a
          href='https://typesense.org/'
          target='_blank'
          rel='noopener noreferrer'
          className='text-typesense-accent'
        >
          type<b>sense|</b>
        </a>
      </h2>{' '}
      <div className='flex gap-2'>
        <input
          type='text'
          className='flex h-10 w-full rounded-3xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
        />
        <VoiceSearchPopup
          handleBase64AudioChange={(base64Audio) => setBase64Audio(base64Audio)}
        >
          <Button className='rounded-full' size='icon'>
            <MicIcon className='size-5' />
          </Button>
        </VoiceSearchPopup>
      </div>
      {base64Audio && (
        <audio className='h-12' controls src={base64Audio}></audio>
      )}
      {data && <small> {JSON.stringify(data)}</small>}
    </>
  );
}

export default App;
