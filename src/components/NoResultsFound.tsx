import { LucideSearchX } from 'lucide-react';

export default function NoResultsFound() {
  return (
    <div className='flex flex-col items-center gap-1'>
      <LucideSearchX className='size-16 stroke-1 stroke-muted-foreground' />
      <h3 className='text-foreground font-medium'>No results found</h3>
      <small className='text-sm text-muted-foreground'>
        Try another search
      </small>
    </div>
  );
}
