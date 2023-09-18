import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { api } from "@/lib/api";

interface Prompt {
  id: string;
  title: string;
  template: string;
}

interface PromptSelectProps {
  onSelect: (template: string) => void;
}

export function PromptSelect({ onSelect }: PromptSelectProps) {
  const [prompts, setPrompts] = useState<Prompt[] | null>(null);

  useEffect(() => {
    api.get("/prompts").then((response) => setPrompts(response.data));
  }, []);

  function handleSelectPrompt(id: string) {
    onSelect(prompts?.find((prompt) => prompt.id === id)?.template || "");
  }

  return (
    <Select onValueChange={handleSelectPrompt}>
      <SelectTrigger>
        <SelectValue placeholder="Select a prompt..." />
      </SelectTrigger>
      <SelectContent>
        {prompts?.map((prompt) => (
          <SelectItem key={prompt.id} value={prompt.id}>
            {prompt.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
