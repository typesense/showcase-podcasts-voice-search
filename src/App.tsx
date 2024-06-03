import Heading from './components/Heading';
import Hits from './components/Hits';
import SearchPagination from './components/SearchPagination';
import AudioPreview from './components/AudioPreview';
import useSearch from './hooks/useSearch';
import LoaderSVG from './components/LoaderSVG';
import NoResultsFound from './components/NoResultsFound';
import SearchBar from './components/SearchBar';
import { Button } from './components/ui/button';
import { GithubIcon } from './components/icons';
import { useEffect } from 'react';
import { connect } from 'extendable-media-recorder-wav-encoder';
import { register } from 'extendable-media-recorder';

function App() {
  const {
    hits,
    base64Audio,
    isLoading,
    isTranscribingVoice,
    pagination,
    handleBase64AudioChange,
  } = useSearch();
  const isNoResult = hits.length === 0;

  useEffect(() => {
    (async () => register(await connect()))();
  }, []);

  return (
    <main className='max-w-3xl max-md:px-2 m-auto pt-6 pb-20 flex flex-col gap-8 items-center'>
      <Header />
      <div className='w-full flex flex-col gap-6'>
        <Heading />
        <SearchBar
          isLoading={isLoading}
          handleBase64AudioChange={handleBase64AudioChange}
        />
      </div>

      {isLoading ? (
        <LoaderSVG isTranscribingVoice={isTranscribingVoice} />
      ) : (
        <>
          <Hits hits={hits} />
          {isNoResult ? (
            <NoResultsFound />
          ) : (
            <SearchPagination pagination={pagination} />
          )}
        </>
      )}

      {base64Audio && <AudioPreview base64Audio={base64Audio} />}
    </main>
  );
}
const Header = () => (
  <header className=' w-full flex justify-end mb-[-1.5rem]'>
    <a
      href='https://github.com/typesense/showcase-podcasts-voice-search'
      target='_blank'
      rel='noopener noreferrer'
    >
      <Button
        className='rounded-full'
        variant={'ghost'}
        size={'icon'}
        title='Souce code'
      >
        <GithubIcon className='size-6' />
      </Button>
    </a>
  </header>
);

export default App;
