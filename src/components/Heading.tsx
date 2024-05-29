export default function Heading() {
  return (
    <div className='text-center' id='top'>
      <h1 className='text-3xl font-semibold mb-1'>
        <a href='/'>Search podcasts with voice</a>
      </h1>
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
      </h2>
    </div>
  );
}
