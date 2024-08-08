import { useRef, useState } from "react";

type MediaStreamHookProps = {
  constraints: MediaStreamConstraints;
  verbose?: boolean;
  timeSliceMs?: number;
  mimeType?: string;
  sendMediaViaWebSocket?: (message: Blob) => void;
};

const useMediaStream = (props: MediaStreamHookProps) => {
  //
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingPermissions, setRecordingPermissions] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<
    "recording" | "inactive" | "paused" | "unavailable"
  >();
  //   const [mediaChunks, setMediaChunks] = useState<Blob[]>([]);
  const mediaChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [mediaURL, setMediaURL] = useState<string | null>(null);
  const mediaRef = useRef<HTMLVideoElement | null>(null);
  const [interstitialChunks, setInterstitialChunks] = useState<Blob[]>([]);

  const getPermissions = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia is not supported");
      setRecordingStatus("unavailable");
      return;
    }

    if (!props.constraints) {
      console.error("No constraints provided");
      return;
    }

    if (recordingPermissions) {
      console.info("Permissions already granted");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        props.constraints,
      );

      if (mediaRef.current) {
        mediaRef.current.srcObject = stream;
      }
      // clear the mediaChunks and set stream and permission
      mediaChunksRef.current = [];
      setStream(stream);

      const media = new MediaRecorder(stream, { mimeType: props.mimeType });
      mediaRecorderRef.current = media;

      props.verbose &&
        (console.log("stream set, tracks: ", stream.getTracks()),
        console.log("mediaRecorderRef.current", mediaRecorderRef.current));
      setRecordingPermissions(true);
    } catch (error) {
      console.error("Error getting media permissions", error);
    }
  };

  const startRecording = async () => {
    //
    if (recordingStatus === "unavailable") {
      console.error("recording is not supported");
      return;
    }

    if (recordingStatus === "recording") {
      console.error("recording is already in progress");
      return;
    }

    if (!mediaRecorderRef.current) {
      props.verbose &&
        console.info(
          "Mediarecorder not available, cannot start recording. Getting permissions",
        );
      await getPermissions();
      return startRecording();
    }

    if (!recordingPermissions) {
      await getPermissions();
    }

    props.verbose &&
      console.log("mediaRecorderRef.current", mediaRecorderRef.current);

    setRecordingStatus("recording");

    const localMediaChunks: Blob[] = [];
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        localMediaChunks.push(event.data);
        mediaChunksRef.current = localMediaChunks;
        if (props.sendMediaViaWebSocket) {
          props.sendMediaViaWebSocket(new Blob(mediaChunksRef.current));
        }
      }
      props.verbose &&
        console.log("localMediaChunks length", localMediaChunks.length);
    };

    mediaRecorderRef.current.start(props.timeSliceMs || 5000);
  };

  const stopRecording = () => {
    props.verbose &&
      (console.log("stopping recording"),
      console.log("mediaRecorderRef.current", mediaRecorderRef.current));

    if (!mediaRecorderRef.current) {
      console.error("No media recorder available, cannot stop recording");
      return;
    }

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = () => {
      setRecordingStatus("inactive");
      const mediaBlob = new Blob(mediaChunksRef.current, {
        type: props.mimeType,
      });
      const mediaURL = URL.createObjectURL(mediaBlob);
      setMediaURL(mediaURL);
    };
  };

  const deleteRecording = () => {
    if (!mediaURL) {
      console.error("No media URL available to delete");
      return;
    }
    mediaChunksRef.current = [];
    URL.revokeObjectURL(mediaURL);
  };

  return {
    recordingStatus,
    startRecording,
    deleteRecording,
    stopRecording,
    mediaURL,
    mediaRecorderRef,
    mediaRef,
  };
};

export default useMediaStream;
