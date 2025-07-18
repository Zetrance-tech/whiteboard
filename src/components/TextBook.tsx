import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react"; // ✅ Better suited icon for a book

interface BookProps {
  onClose: () => void;
}

export const Book = ({ onClose }: BookProps) => {
  const iframeURL = "https://epathshala.nic.in/process.php"; // Your Book URL

  return (
    <div
      className="fixed top-0 right-0 z-50 w-[30vw] h-screen bg-white dark:bg-gray-900 border-l border-primary/20 dark:border-primary/10
                 shadow-2xl rounded-l-xl overflow-hidden flex flex-col backdrop-blur-xl backdrop-saturate-150 animate-in slide-in-from-right"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <BookOpen className="text-indigo-600 animate-pulse" /> {/* Changed icon */}
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
            Book
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
        title="Book"
        className="flex-1 w-full border-none"
        allow="autoplay; fullscreen; vr"
      />
    </div>
  );
};
