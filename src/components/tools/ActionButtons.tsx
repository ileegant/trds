import { RefreshCw, Share2, Coffee } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { Button } from "../ui/Button";

interface ActionButtonsProps {
  handleShare: () => void;
  isSharing: boolean;
}

export const ActionButtons = ({ handleShare, isSharing }: ActionButtonsProps) => {
  return (
    <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Button
        onClick={handleShare}
        disabled={isSharing}
      >
        {isSharing ? (
          <RefreshCw className="w-5 h-5 animate-spin" />
        ) : (
          <Share2 className="w-5 h-5" />
        )}
        <span>{isSharing ? "Зберігаємо..." : "Поділитись в THREADS"}</span>
      </Button>
           
      <Button
        variant="secondary"
        href={SITE_CONFIG.links.donate}
        rel="noopener noreferrer"
      >
        <Coffee className="w-4 h-4" />
        <span>Хабар розробнику (Кава)</span>
      </Button>
    </div>
  );
};