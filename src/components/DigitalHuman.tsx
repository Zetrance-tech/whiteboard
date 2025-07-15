import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

interface DigitalHumanPopupProps {
  onClose: () => void;
}

export const DigitalHumanPopup = ({ onClose }: DigitalHumanPopupProps) => {
  const iframeURL = "https://skyyskill.zetrance.com"; // Replace with your URL

 return (
    <div
      className="fixed top-0 right-0 z-50 w-[30vw] h-screen bg-white dark:bg-gray-900 border-l border-primary/20 dark:border-primary/10
                 shadow-2xl rounded-l-xl overflow-hidden flex flex-col backdrop-blur-xl backdrop-saturate-150 animate-in slide-in-from-right"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <Bot className="text-purple-600 animate-bounce" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
            AI Digital Human
          </h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full text-muted-foreground hover:text-primary text-xl"
        >
          ✕
        </Button>
      </div>

      {/* Iframe */}
      <iframe
        src={iframeURL}
        title="Digital Human"
        className="flex-1 w-full border-none"
        allow="microphone; camera"
      />
    </div>
  );
};
