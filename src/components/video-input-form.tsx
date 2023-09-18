import { FileVideo, Upload } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from "@/lib/api";

type Status =
  | "waiting"
  | "converting"
  | "uploading"
  | "generating"
  | "success"
  | "error";

const statusMessages = {
  converting: "Converting...",
  uploading: "Uploading...",
  generating: "Generating...",
  success: "Sucesso",
  error: "Error",
};

export interface VideoInputFormProps {
  sendVideoId: (videoId: string) => void;
}

export default function VideoInputForm({ sendVideoId }: VideoInputFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const promptInputRef = useRef<HTMLTextAreaElement | null>(null);
  const [status, setStatus] = useState<Status>("waiting");

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;
    if (!files) {
      return;
    }
    const selectedFile = files[0];
    setVideoFile(selectedFile);
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null;
    }

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  async function convertVideoToAudio(video: File) {
    console.log(`Converting...`);

    const ffmpeg = await getFFmpeg();
    await ffmpeg.writeFile("input.mp4", await fetchFile(video));

    ffmpeg.on("progress", (progress) => {
      console.log(`Progress: ${Math.round(progress.progress * 100)} `);
    });

    ffmpeg.exec([
      "-i",
      "input.mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ]);

    const audioData = await ffmpeg.readFile("output.mp3");
    const audioFileBlob = new Blob([audioData], { type: "audio/mpeg" });
    const audioFile = new File([audioFileBlob], "audio.mp3", {
      type: "audio/mpeg",
    });
    console.log(`*** CONVERTED ***`);
    return audioFile;
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = promptInputRef.current?.value;
    if (!videoFile) {
      return;
    }

    setStatus("converting");
    const audioFile = await convertVideoToAudio(videoFile);
    const data = new FormData();
    data.append("file", audioFile);

    setStatus("uploading");
    const response = await api.post("/videos", data);
    const videoId = response.data.video.id;

    setStatus("generating");
    await api.post(`/videos/${videoId}/transcription`, { prompt });

    setStatus("success");
    sendVideoId(videoId);
  }

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
      <label
        htmlFor="video"
        className="relative border flex flex-col rounded-md aspect-video cursor-pointer border-dashed items-center justify-center text-muted-foreground hover:bg-primary/5 text-sm"
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className="pointer-events-none absolute inset-0"
          />
        ) : (
          <>
            <FileVideo className="w-4 h-4" />
            Load Video
          </>
        )}
      </label>
      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />
      <Separator />
      <div className="space-y-1">
        <Label htmlFor="transcription_prompt">Transcrition Prompt</Label>
        <Textarea
          disabled={status !== "waiting"}
          ref={promptInputRef}
          className="min-h-20"
          id="transcription_prompt"
          placeholder="Include keywords mentioned in the video (spliting by ',')"
        />
      </div>

      <Button disabled={status !== "waiting"} type="submit" className="w-full">
        {status === "waiting" ? (
          <>
            <Upload className="w-4 h-4 mr-2" />
            <Separator orientation="vertical" />
            Load Video
          </>
        ) : (
          `${statusMessages[status]}`
        )}
      </Button>
    </form>
  );
}
