import { useSearchParams } from 'react-router-dom';
import {
  //LucideSearch,
  MicIcon,
} from 'lucide-react';
import {
  // FormEvent,
  useEffect,
  useState,
} from 'react';
import { Button } from './ui/button';
import VoiceRecordingPopup, {
  _VoiceRecordingPopupProps,
} from './VoiceRecordingPopup';
// import { EXAMPLE_SEARCH_TERMS } from '@/data/CONSTANTS';
// import { Badge } from '@/components/ui/badge';

export default function SearchBar({
  handleBase64AudioChange,
  isLoading,
}: Pick<_VoiceRecordingPopupProps, 'handleBase64AudioChange'> & {
  isLoading: boolean;
}) {
  const [
    searchParams, // setSearchParams
  ] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [query, setQuery] = useState(q);

  // function search(e: FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   searchParams.set('q', query);
  //   searchParams.set('page', '1');
  //   setSearchParams(searchParams);
  // }
  useEffect(() => {
    setQuery(q);
  }, [q]);

  const render = () => {
    if (query)
      return (
        <fieldset
          disabled
          className='flex h-14 w-full px-10 py-2 rounded-3xl border border-input bg-background text-sm disabled:cursor-not-allowed'
        >
          <legend className='self-start text-xs text-muted-foreground'>
            Transcribed query
          </legend>
          <input
            type='text'
            value={query}
            disabled
            className='w-full h-full bg-background disabled:cursor-not-allowed'
            placeholder='Search...'
            id='searchBox'
          />
        </fieldset>
      );
    return (
      <small className='text-muted-foreground'>Press and speak to search</small>
    );
  };
  return (
    <div className='w-full'>
      <div className='flex flex-col gap-2 items-center'>
        {/* <form onSubmit={search} className='relative flex-1'>
          <LucideSearch className='absolute top-1/2 -translate-y-1/2 left-4 stroke-1 size-5 stroke-muted-foreground' />
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='flex h-10 w-full px-12 rounded-3xl border border-input bg-background py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50'
            placeholder='Search...'
          />
        </form> */}
        {!isLoading && (
          <>
            <VoiceRecordingPopup
              handleBase64AudioChange={handleBase64AudioChange}
            >
              <Button className='rounded-full size-16' size='icon'>
                <MicIcon className='size-7' />
              </Button>
            </VoiceRecordingPopup>
            {render()}
          </>
        )}
      </div>
      {/* <div className='mt-2 flex max-w-full gap-1 overflow-x-auto text-nowrap'>
        {EXAMPLE_SEARCH_TERMS.map((item) => (
          <a href={`/?q=${item}&page=1`} type='submit' key={item}>
            <Badge variant={'secondary'}>{item}</Badge>
          </a>
        ))}
      </div> */}
    </div>
  );
}
