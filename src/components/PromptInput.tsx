
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="prompt" className="text-sm font-medium text-gray-300">
        Your Creative Prompt
      </Label>
      <Textarea
        id="prompt"
        placeholder="Describe how you want to transform your image(s)... e.g. 'Make it look like a watercolor painting in the style of Monet'"
        className="min-h-[100px] bg-input text-foreground border-border focus:border-violet-500 focus:ring-violet-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-xs text-gray-500">
        Be specific with details like style, mood, colors, and artistic references
      </p>
    </div>
  );
};

export default PromptInput;
