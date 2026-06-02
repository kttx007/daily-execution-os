import type { Priority, Quadrant, Status } from "@/types";
import { Badge } from "@/components/ui/badge";
import { PRIORITY_META, QUADRANT_META, STATUS_META } from "@/utils/constants";

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge className={PRIORITY_META[priority].tone}>{priority}</Badge>;
}

export function QuadrantBadge({ quadrant }: { quadrant: Quadrant }) {
  return <Badge className={QUADRANT_META[quadrant].tone}>{quadrant}</Badge>;
}

export function StatusBadge({ status }: { status: Status }) {
  return <Badge className={STATUS_META[status].tone}>{status}</Badge>;
}
