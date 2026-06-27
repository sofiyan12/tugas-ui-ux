import { useState, useEffect } from "react";
import { CheckCircle, Cloud, CloudOff } from "lucide-react";

interface AutoSaveIndicatorProps {
  lastSaved?: Date;
}

export function AutoSaveIndicator({ lastSaved }: AutoSaveIndicatorProps) {
  const [status, setStatus] = useState<"saved" | "saving" | "error">("saved");

  useEffect(() => {
    if (lastSaved) {
      setStatus("saving");
      const timer = setTimeout(() => {
        setStatus("saved");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lastSaved]);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {status === "saved" && (
        <>
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="hidden sm:inline">Semua perubahan disimpan</span>
          <span className="sm:hidden">Tersimpan</span>
        </>
      )}
      {status === "saving" && (
        <>
          <Cloud className="w-4 h-4 animate-pulse" />
          <span>Menyimpan...</span>
        </>
      )}
      {status === "error" && (
        <>
          <CloudOff className="w-4 h-4 text-destructive" />
          <span className="hidden sm:inline">Gagal menyimpan</span>
          <span className="sm:hidden">Galat</span>
        </>
      )}
    </div>
  );
}
