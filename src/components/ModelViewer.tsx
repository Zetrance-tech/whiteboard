import { Button } from "@/components/ui/button";
import { Box } from "lucide-react"; // Icon for 3D model

interface ModelProps {
  onClose: () => void;
}

export const Model = ({ onClose }: ModelProps) => {
  const iframeURL =
    "https://sketchfab.com/models/8a1ca8e3ca224cdeb9264674416bde38/embed"; // Your 3D model URL

  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-[30vw] h-[90vh] bg-white dark:bg-gray-900 border border-primary/20 dark:border-primary/10
                 shadow-2xl rounded-xl overflow-hidden flex flex-col backdrop-blur-xl backdrop-saturate-150 animate-in slide-in-from-bottom"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <Box className="text-indigo-600 animate-pulse" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
            3D Model Viewer
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
        title="3D Model Viewer"
        className="flex-1 w-full border-none"
        allow="autoplay; fullscreen; vr"
      />
    </div>
  );
};
