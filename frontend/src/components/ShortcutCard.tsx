import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ShortcutCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  category: string;
  className?: string;
}

const ShortcutCard = ({ icon: Icon, title, subtitle, category, className }: ShortcutCardProps) => {
  return (
    <div className={cn("bg-card-bg p-6 rounded-3xl shadow-sm cursor-pointer hover:shadow-md transition-shadow", className)}>
      <div className="mb-4">
        <span className="inline-block p-2 bg-white rounded-lg">
          <Icon className="w-6 h-6" />
        </span>
      </div>
      <div className="mb-2">
        <span className="text-sm font-medium text-gray-600">{category}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
    </div>
  );
};

export default ShortcutCard;