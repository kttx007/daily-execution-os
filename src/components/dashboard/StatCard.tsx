import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  onClick,
  ariaLabel,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone: string;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      aria-label={ariaLabel ?? `查看${label}明细`}
      className={cn(
        "w-full rounded-lg border border-slate-200 bg-white p-4 text-left shadow-soft transition",
        onClick && "cursor-pointer hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
        !onClick && "cursor-default",
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-950">{value}</p>
        </div>
        <span className={`rounded-lg p-2 ${tone}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </button>
  );
}
