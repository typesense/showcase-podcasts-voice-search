import { _PodcastHit } from '@/lib/typesense';

export default function Hits({ hits }: { hits: _PodcastHit[] }) {
  return (
    <ul className='flex flex-col gap-2'>
      {hits.map(({ document: { title, description, author, image, id } }) => (
        <li
          className='p-2 flex h-28 hover:bg-muted transition rounded-lg border'
          key={id}
        >
          <img
            className='aspect-square rounded-lg min-h-full'
            src={image}
            alt={`${title}: ${description}`}
          />
          <div className='flex flex-col items-start text-left px-4 py-0.5'>
            <h3 className='text-base font-medium line-clamp-1 text-foreground'>
              {title}
            </h3>
            <small className='text-xs mb-3 line-clamp-1 text-foreground'>
              {author}
            </small>
            <p className='line-clamp-2 text-xs text-muted-foreground'>
              {description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
