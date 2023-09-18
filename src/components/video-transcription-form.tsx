import { Wand2 } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Slider } from "./ui/slider";
import { PromptSelect } from "./prompt-select";
import { FormEvent, useState } from "react";
//import { useCompletion } from "ai/react";

export interface VideoTranscriptionFormProps {
  temperature: number;
  setTextInput: (value: string) => void;
  setTemperature: (result: number) => void;
  formSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function VideoTranscriptionForm({
  temperature,
  setTextInput,
  setTemperature,
  formSubmit,
}: VideoTranscriptionFormProps) {
  //const [temperature, setTemperature] = useState(0.5);
  //const [videoId, setVideoId] = useState<string | null>(null);

  function handlePromptSelectChange(option: string) {
    setTextInput(option);
  }

  function handleTemperature(result: number) {
    setTemperature(result);
  }

  //   function handleVideoTranscriptionFormSubmit(
  //     event: FormEvent<HTMLFormElement>
  //   ) {
  //     event.preventDefault();
  //   }

  return (
    <form className="space-y-6" onSubmit={formSubmit}>
      <div className="space-y-2">
        <Label>Prompt</Label>
        <PromptSelect onSelect={handlePromptSelectChange} />
      </div>
      <div className="space-y-2">
        <Label className="">Modelo</Label>
        <Select disabled defaultValue="gpt3.5">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
          </SelectContent>
        </Select>
        <span className="block text-xs text-muted-foreground">
          This will be allowed to customize soon
        </span>
      </div>
      <Separator />
      <div className="space-y-2">
        <Label>Temperature</Label>
        <Slider
          min={0}
          max={1}
          step={0.1}
          value={[temperature]}
          onValueChange={(value) => handleTemperature(value[0])}
        />
        <span className="block text-xs text-muted-foreground italic leading-relaxed">
          Higher values tends to be more creative, but with more inconsistencies
        </span>
        <Button className="w-full">
          <Wand2 className="w-4 h-4 mr-2" />
          Execute
        </Button>
      </div>
    </form>
  );
}
