export default function AudioPreview({ base64Audio }: { base64Audio: string }) {
  return (
    <audio
      className='h-12 fixed bottom-4 right-4'
      controls
      src={base64Audio}
    ></audio>
  );
}
