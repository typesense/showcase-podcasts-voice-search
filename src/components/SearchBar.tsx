import { useSearchParams } from 'react-router-dom';
import { LucideSearch, MicIcon } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Button } from './ui/button';
import VoiceRecordingPopup, {
  _VoiceRecordingPopupProps,
} from './VoiceRecordingPopup';

export default function SearchBar({
  handleBase64AudioChange,
}: Pick<_VoiceRecordingPopupProps, 'handleBase64AudioChange'>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [query, setQuery] = useState(q);

  function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    searchParams.set('q', query);
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  }
  useEffect(() => {
    setQuery(q);
  }, [q]);

  return (
    <div className='flex gap-2 w-full'>
      <form onSubmit={search} className='relative flex-1'>
        <LucideSearch className='absolute top-1/2 -translate-y-1/2 left-4 stroke-1 size-5 stroke-muted-foreground' />
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='flex h-10 w-full px-12 rounded-3xl border border-input bg-background py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50'
          placeholder='Search...'
        />
      </form>
      <VoiceRecordingPopup handleBase64AudioChange={handleBase64AudioChange}>
        <Button className='rounded-full' size='icon'>
          <MicIcon className='size-5' />
        </Button>
      </VoiceRecordingPopup>
    </div>
  );
}
