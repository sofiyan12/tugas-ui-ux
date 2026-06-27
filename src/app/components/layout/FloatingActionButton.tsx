import { Plus } from "lucide-react";
import { Link } from "react-router";

export function FloatingActionButton() {
  return (
    <Link
      to="/create-report"
      className="fixed bottom-20 right-6 lg:hidden w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-110 z-40"
    >
      <Plus className="w-6 h-6" />
    </Link>
  );
}
