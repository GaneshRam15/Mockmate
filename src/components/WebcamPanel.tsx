import { useEffect, useRef, useState } from 'react';
import { Video, VideoOff } from 'lucide-react';
import { Button } from './ui/button';

interface WebcamPanelProps {
  onStreamReady?: (stream: MediaStream) => void;
}

export default function WebcamPanel({ onStreamReady }: WebcamPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startWebcam = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: false,
        });

        currentStream = mediaStream;
        setStream(mediaStream);
        onStreamReady?.(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: unknown) {
        console.error('Error accessing webcam:', err);
        setError('Unable to access camera. Please check permissions.');
      }
    };

    startWebcam();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onStreamReady]);

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      {error ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <VideoOff className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }} // Mirror effect
          />

          {/* Video Toggle Button */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleVideo}
              className="bg-black/50 border-white/20 hover:bg-black/70"
            >
              {isVideoEnabled ? (
                <Video className="w-4 h-4 text-white" />
              ) : (
                <VideoOff className="w-4 h-4 text-white" />
              )}
            </Button>
          </div>

          {/* Recording Indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/80 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white text-xs font-medium">REC</span>
          </div>
        </>
      )}
    </div>
  );
}
