export default function Heading() {
  return (
    <div className='text-center'>
      <h1 className='text-3xl font-semibold mb-1'>Voice query</h1>
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
