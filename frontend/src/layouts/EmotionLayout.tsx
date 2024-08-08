import useMediaStream from "@/hooks/useMediaStream";
import useWebSocketHume from "@/hooks/useWebSocketHume";

const EmotionLayout = () => {
  const windowSizeMs = 2000;
  const { sendMessage, messages } = useWebSocketHume({ windowSizeMs });
  const mediaStreamProps = {
    constraints: { video: true, audio: false },
    verbose: true,
    timeSliceMs: windowSizeMs,
    mimeType: "video/webm",
    sendMediaViaWebSocket: sendMessage,
  };
  const { startRecording, stopRecording, mediaURL, mediaRef, recordingStatus } =
    useMediaStream(mediaStreamProps);
  const ButtonTray = () => {
    return (
      <>
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
      </>
    );
  };

  const renderVideo = () => {
    if (recordingStatus === "inactive" && mediaURL) {
      return <video controls src={mediaURL} className="w-1/2"></video>;
    }
    if (recordingStatus === "recording") {
      console.log(
        "recording status sufficient to show live video",
        recordingStatus,
      );
      return <video ref={mediaRef} autoPlay className="w-1/2"></video>;
    }
  };

  return (
    <>
      <ButtonTray />
      <video ref={mediaRef} controls autoPlay className="w-1/2"></video>
      {renderVideo()}
      {messages.map((msg, idx) => (
        <div key={idx} className="mx-4 flex w-full whitespace-pre-wrap">
          {`${msg.name}: ${msg.score}`}
        </div>
      ))}
    </>
  );
};

export default EmotionLayout;
