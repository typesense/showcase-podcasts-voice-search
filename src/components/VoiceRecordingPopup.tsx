import { ReactNode, useRef, useState } from 'react';
import { fileOrBlobToBase64 } from '../utils/base64Utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { MicIcon } from 'lucide-react';
import { cn } from '@/lib/shadcn';
import { toast } from 'sonner';
import hark from 'hark';
import { IMediaRecorder, MediaRecorder } from 'extendable-media-recorder';

export type _VoiceRecordingPopupProps = {
  children: ReactNode;
  handleBase64AudioChange: (base64Audio: string | null) => void;
};
let stopped_speaking_timeout: NodeJS.Timeout;
export default function VoiceRecordingPopup({
  children,
  handleBase64AudioChange,
}: _VoiceRecordingPopupProps) {
  const recorderRef = useRef<IMediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleRecording = () => {
    if (recorderRef.current) return handleStopRecording();
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(async function (stream) {
        streamRef.current = stream;
        // https://github.com/chrisguttandin/extendable-media-recorder
        const audioContext = new AudioContext({ sampleRate: 16000 });
        const mediaStreamAudioSourceNode = new MediaStreamAudioSourceNode(
          audioContext,
          { mediaStream: stream }
        );
        const mediaStreamAudioDestinationNode =
          new MediaStreamAudioDestinationNode(audioContext);

        mediaStreamAudioSourceNode.connect(mediaStreamAudioDestinationNode);

        recorderRef.current = new MediaRecorder(
          mediaStreamAudioDestinationNode.stream,
          { mimeType: 'audio/wav' }
        );

        recorderRef.current.onerror = (e) => console.log(e);
        recorderRef.current.start();
        setIsRecording(true);

        const WAIT_SECONDS = 0.5; // fire search event if the user done speaking
        const INITIAL_WAIT_SECONDS = 5; // cancel recording if the user does not speak after 5 seconds

        stopped_speaking_timeout = setTimeout(() => {
          handleStopRecording({ isCancelRecording: true });
          toast.error('Did not hear that. Please try again.');
        }, INITIAL_WAIT_SECONDS * 1000);

        const speechEvents = hark(stream);

        speechEvents.on('speaking', () =>
          clearTimeout(stopped_speaking_timeout)
        );

        speechEvents.on('stopped_speaking', () => {
          stopped_speaking_timeout = setTimeout(() => {
            handleStopRecording();
          }, WAIT_SECONDS * 1000);
        });
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === 'NotAllowedError')
          toast.error('Permission denied!', {
            description:
              'Please go to your browser settings and allow access to microphone',
          });
      });
  };

  const handleStopRecording = ({ isCancelRecording = false } = {}) => {
    clearTimeout(stopped_speaking_timeout);
    // stop user media recording
    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });
    if (!recorderRef.current) return;

    const localAudioChunks: Blob[] = [];
    recorderRef.current.ondataavailable = (event) => {
      if (typeof event.data === 'undefined') return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    recorderRef.current.onstop = async () => {
      if (!isCancelRecording) {
        const blob = new Blob(localAudioChunks, {
          type: recorderRef.current?.mimeType,
        });
        const base64 = await fileOrBlobToBase64(blob);
        handleBase64AudioChange(base64);
      }
      recorderRef.current = null;
      setIsOpen(false);
      setIsRecording(false);
    };

    recorderRef.current.stop();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        !open && handleStopRecording({ isCancelRecording: true });
        open && toggleRecording();
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[424px]'>
        <DialogHeader>
          <DialogTitle>Search with your voice</DialogTitle>
          <DialogDescription>
            Try saying: 'finance', 'sports', 'travel', 'coaching',...
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2 justify-center items-center mt-10'>
          <Button
            className={cn(
              'rounded-full w-20 h-20',
              isRecording && 'bg-pink-600 hover:bg-pink-500'
            )}
            onClick={toggleRecording}
            size='icon'
          >
            <MicIcon className='size-8' />
          </Button>
          <small className='text-xs text-slate-400 min-h-4'>
            {isRecording && 'Listening...'}
          </small>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
