import useSearchParams from '@/hooks/useSearchParams';
import { LucideSearch } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

export default function SearchBox() {
  const { urlParams, push } = useSearchParams();
  const q = urlParams.get('q') || '';
  const [query, setQuery] = useState(q);

  function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    push({ q: query });
  }
  useEffect(() => {
    setQuery(q);
  }, [q]);

  return (
    <form onSubmit={search} className='relative w-full'>
      <LucideSearch className='absolute top-1/2 -translate-y-1/2 left-4 stroke-1 size-5 stroke-muted-foreground' />
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className='flex h-10 w-full px-12 rounded-3xl border border-input bg-background py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50'
        placeholder='Search...'
      />
    </form>
  );
}
