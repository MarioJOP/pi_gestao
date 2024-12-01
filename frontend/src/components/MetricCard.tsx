import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  className?: string;
}

const MetricCard = ({ title, className }: MetricCardProps) => {
  return (
    <div className={cn("bg-card-bg p-6 rounded-3xl shadow-sm", className)}>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {/* Placeholder for metric value */}
      <div className="mt-2 h-20 flex items-center justify-center text-gray-400">
        Dados em breve
      </div>
    </div>
  );
};

export default MetricCard;