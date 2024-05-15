import VoiceSearchPopup from './components/VoiceRecordingPopup';
import { Button } from './components/ui/button';
import { MicIcon } from 'lucide-react';
import Heading from './components/Heading';
import Hits from './components/Hits';
import SearchBox from './components/SearchBox';
import SearchPagination from './components/SearchPagination';
import AudioPreview from './components/AudioPreview';
import useSearch from './hooks/useSearch';

function App() {
  const { hits, base64Audio, pagination, handleBase64AudioChange } =
    useSearch();
  console.log(pagination);

  return (
    <main className='max-w-3xl m-auto pt-10 pb-20 flex flex-col gap-8'>
      <Heading />
      <div className='flex gap-2'>
        <SearchBox />
        <VoiceSearchPopup handleBase64AudioChange={handleBase64AudioChange}>
          <Button className='rounded-full' size='icon'>
            <MicIcon className='size-5' />
          </Button>
        </VoiceSearchPopup>
      </div>
      <Hits hits={hits} />
      <SearchPagination pagination={pagination} />
      {base64Audio && <AudioPreview base64Audio={base64Audio} />}
    </main>
  );
}

export default App;
