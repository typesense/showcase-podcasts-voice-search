import { ReactNode, useState } from 'react';
import RecordRTC from 'recordrtc';
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

export type _VoiceRecordingPopupProps = {
  children: ReactNode;
  handleBase64AudioChange: (base64Audio: string | null) => void;
};
export default function VoiceRecordingPopup({
  children,
  handleBase64AudioChange,
}: _VoiceRecordingPopupProps) {
  const [recorder, setRecorder] = useState<RecordRTC | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleRecording = () => {
    if (recorder) return handleStopRecording();
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(async function (stream) {
        const record = new RecordRTC(stream, {
          type: 'audio',
          mimeType: 'audio/wav',
          desiredSampRate: 16000,
          audioBitsPerSecond: 16 * 16000, // bitrate = bitDepth(16-bit) * sampleRate
          // https://github.com/muaz-khan/RecordRTC/issues/589
          recorderType: RecordRTC.StereoAudioRecorder, // force for all browsers
          numberOfAudioChannels: 1,
          disableLogs: true,
        });
        setRecorder(record);

        record.startRecording();
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
    if (!recorder) return;
    recorder.stopRecording(async () => {
      if (isCancelRecording) return;
      try {
        const blob = recorder.getBlob();
        const url = await fileOrBlobToBase64(blob);
        handleBase64AudioChange(url);
        setIsOpen(false);
      } catch (error) {
        console.log(error);
      }
    });
    setRecorder(null);
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
          <DialogTitle>Voice query</DialogTitle>
          <DialogDescription>
            To search by voice, go to your browser settings and allow access to
            microphone
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2 justify-center items-center mt-10'>
          <Button
            className={cn(
              'rounded-full w-20 h-20',
              recorder && 'bg-pink-600 hover:bg-pink-500'
            )}
            onClick={toggleRecording}
            size='icon'
          >
            <MicIcon className='size-8' />
          </Button>
          <small className='text-xs text-slate-400 min-h-4'>
            {recorder && 'Recording...'}
          </small>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
