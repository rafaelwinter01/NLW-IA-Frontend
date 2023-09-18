import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Github } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import VideoInputForm from "./components/video-input-form";
import VideoTranscriptionForm from "./components/video-transcription-form";
import { useState } from "react";
import { useCompletion } from "ai/react";

export function App() {
  const [videoId, setVideoId] = useState<string | null>(null);
  //const [input, setInput] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [temperature, setTemperature] = useState(0.5);

  function handleVideoId(videoId: string) {
    setVideoId(videoId);
  }

  function handleSetResult(result: string) {
    setOutputText(result);
  }

  function handleTextInput(textInput: string) {
    setInput(textInput);
  }

  function handleTemperature(temperature: number) {
    setTemperature(temperature);
  }

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: "http://localhost:3333/ai/generate",
    body: {
      videoId,
      temperature,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">upload.ai</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido por Rafael Winter
          </span>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline">
            <Github className="w-4 h-4 mr-2" />
            Github
          </Button>
        </div>
      </div>

      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-6">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Add the prompt for the AI..."
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="AI result..."
              value={completion}
              readOnly
            />
          </div>
          <p className="text-sm text-muted-foreground">
            You can use the variable{" "}
            <code className="text-purple-300">{"{transcription}"}</code> in your
            prompt to add the content of the description of your selected video
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <VideoInputForm sendVideoId={handleVideoId} />

          <Separator />

          <VideoTranscriptionForm
            setTextInput={handleTextInput}
            temperature={temperature}
            setTemperature={handleTemperature}
            formSubmit={handleSubmit}
          />
        </aside>
      </main>
    </div>
  );
}
