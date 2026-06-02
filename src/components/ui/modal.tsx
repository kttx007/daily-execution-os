import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/30 p-3 sm:items-center sm:justify-center">
      <div className="max-h-[92vh] w-full overflow-auto rounded-lg bg-white shadow-2xl sm:max-w-3xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
          <h2 className="text-base font-semibold text-slate-950">{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label="关闭">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
