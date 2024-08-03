// Steps:
// 1. record audio from user
// 2. allow user to listen to recorded audio

import axiosClient from "@/services/axiosClient";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { set } from "zod";

const mimeType = "audio/webm";

const VoiceLayout = () => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<
    "recording" | "inactive" | "paused"
  >();
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const { mutate, isSuccess } = useMutation({
    mutationKey: ["transcribe"],
    mutationFn: async () => {
      console.log("transcribe");
      if (!audioUrl) {
        console.error("No audio url available to transcribe");
        return;
      }

      const formData = new FormData();
      if (!audioBlob) {
        console.error("No audio blob available to transcribe");
        return;
      }
      formData.append("audio_body", audioBlob, "audio_body");

      const response = await axiosClient.post<{ text: string }>(
        "/v3/demo/transcribe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log("response", response);
      return response.data;
    },
  });

  const transcribeAudio = () => {
    mutate();
  };

  const getMicrophonePermission = async () => {
    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setPermission(true);
      setStream(streamData);
      console.log("streamData", streamData);
    } catch (error) {
      console.error("Error getting microphone permission", error);
    }
  };

  const startRecording = () => {
    //
    setRecordingStatus("recording");
    if (!stream) {
      console.error("No stream available, cannot start recording");
      return;
    }
    const media = new MediaRecorder(stream, { mimeType: mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();
    const localAudioChunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (event) => {
      console.log("ondata available event", event);
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    //
    setRecordingStatus("inactive");
    if (!mediaRecorder.current) {
      console.error("No media recorder available, cannot stop recording");
      return;
    }
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      console.log("recording stopped");
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      setAudioBlob(audioBlob);
      setAudioChunks([]);
    };
  };

  const ButtonTray = () => {
    return (
      <>
        <button
          className="m-2 flex items-center gap-2 rounded-sm bg-slate-300 px-2 py-1"
          onClick={getMicrophonePermission}
        >
          <div
            className={`inline-block rounded-full ${permission ? "bg-green-500" : "bg-red-500"} p-2`}
          ></div>
          {permission
            ? "Microphone Permission Granted"
            : "Get Microphone Permission"}
        </button>
        {permission && (
          <div>
            <button
              className="m-2 rounded-sm bg-slate-300 px-2 py-1"
              onClick={startRecording}
            >
              Start Recording
            </button>
            <button
              className="m-2 rounded-sm bg-slate-300 px-2 py-1"
              onClick={stopRecording}
            >
              Stop Recording
            </button>
            <button
              className="m-2 rounded-sm bg-slate-600 px-2 py-1 text-white"
              onClick={transcribeAudio}
            >
              Transcribe
            </button>
          </div>
        )}
      </>
    );
  };

  const AudioPlayer = () => {
    return (
      <>
        {audioUrl && (
          <div className="flex flex-col">
            <audio controls src={audioUrl} className="mt-4" />
            <a
              download
              href={audioUrl}
              className="m-2 rounded-sm bg-slate-300 px-2 py-1"
            >
              Download
            </a>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col items-start">
      {/* {stream && stream.getTracks().map((track) => <p>{track.label}</p>)} */}
      <ButtonTray />
      <AudioPlayer />
    </div>
  );
};

export default VoiceLayout;
