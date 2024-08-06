import useWebSocketHume from "@/hooks/useWebSocketHume";
import { useRef, useState } from "react";

const EmotionLayout = () => {
  const { sendMessage } = useWebSocketHume();
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<
    "recording" | "inactive" | "paused"
  >();
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const getVideoPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(stream);
      setPermission(true);
      console.log("stream", stream);
      console.log("tracks", stream.getTracks());
    } catch (error) {
      console.error("Error getting video permission", error);
    }
  };

  const startRecording = () => {
    //
    setRecordingStatus("recording");
    if (!stream) {
      console.error("No stream available, cannot start recording");
      return;
    }
    const media = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorder.current = media;
    // mediaRecorder.current.start();
    const localVideoChunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (event) => {
      localVideoChunks.push(event.data);
      console.log("length of localVideoChunks", localVideoChunks.length);
      sendMessage(new Blob(localVideoChunks));
    };
    mediaRecorder.current.start(2000); // Start recording and collect data every 5 seconds
    setVideoChunks(localVideoChunks);
  };

  const create = async () => {
    if (!permission) {
      await getVideoPermission();
      return;
    }
    if (!stream) {
      console.error("No stream available, cannot start recording");
      return;
    }
    const media = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorder.current = media;
  };

  const startRecordingPromise = async (length: number): Promise<Blob> => {
    //
    await create();
    return new Promise((resolve: (blob: Blob) => void, reject) => {
      //
      setRecordingStatus("recording");
      if (!stream) {
        console.error("No stream available, cannot start recording");
        reject("No stream available, cannot start recording");
        return;
      }
      if (!mediaRecorder.current) {
        console.error("No media recorder available, cannot start recording");
        reject("No media recorder available, cannot start recording");
        return;
      }
      mediaRecorder.current.ondataavailable = (blobEvent) => {
        console.log("ondata available event", blobEvent);
        resolve(blobEvent.data);
      };
      if (recordingStatus !== "recording") {
        mediaRecorder.current.start();
      }
      setTimeout(() => {
        () => console.log("timer elapsed");
      }, length);
      if (recordingStatus === "recording") {
        mediaRecorder.current.stop();
      }
    });
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");
    if (!mediaRecorder.current) {
      console.error("No media recorder available, cannot stop recording");
      return;
    }
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      console.log("videoChunks", videoChunks);
      const videoBlob = new Blob(videoChunks, { type: "video/webm" });
      const videoUrl = URL.createObjectURL(videoBlob);
      setVideoBlob(videoBlob);
      setVideoUrl(videoUrl);
      setVideoChunks([]);
    };
  };

  const ButtonTray = () => {
    return (
      <>
        <button
          onClick={getVideoPermission}
          className="m-2 rounded-sm bg-slate-300 px-2 py-1"
        >
          Get Video Permission
        </button>
        <button
          onClick={startRecording}
          className="m-2 rounded-sm bg-slate-300 px-2 py-1"
        >
          Start Recording
        </button>
        <button
          onClick={stopRecording}
          className="m-2 rounded-sm bg-slate-300 px-2 py-1"
        >
          Stop Recording
        </button>
        <button
          //   onClick={sendMessage}
          className="m-2 rounded-sm bg-slate-300 px-2 py-1"
        >
          Send Message
        </button>
        <button
          onClick={async () => {
            console.log(" start recording promise called");
            await startRecordingPromise(1000);
          }}
          className="m-2 rounded-sm bg-slate-300 px-2 py-1"
        >
          Start Recording Promise
        </button>
      </>
    );
  };

  return (
    <>
      <ButtonTray />
      {videoUrl && <video controls src={videoUrl} className="w-1/2"></video>}
    </>
  );
};

export default EmotionLayout;
