import { useMemo, useState } from "react";
import type { AppData, DailyReview } from "@/types";
import type { TaskActions } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/field";
import { autoReview, makeId } from "@/utils/task";
import { nowISO, todayISO } from "@/utils/date";

function reviewDraft(data: AppData): DailyReview {
  const now = nowISO();
  return { id: makeId("review"), user_id: null, date: todayISO(), reason: "", score: 7, note: "", created_at: now, updated_at: now, ...autoReview(data) };
}

export function Review({ data, actions }: { data: AppData; actions: TaskActions }) {
  const existing = useMemo(() => data.daily_reviews.find((item) => item.date === todayISO()), [data.daily_reviews]);
  const [review, setReview] = useState<DailyReview>(() => existing ?? reviewDraft(data));
  const stuck = data.tasks.filter((task) => task.is_stuck || task.delay_count >= 3);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">每日复盘</h1>
        <p className="text-sm text-slate-500">自动带入今日完成、未完成、顺延和输出，再补上判断。</p>
      </div>
      {stuck.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader><CardTitle>需要重新拆解的卡住任务</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {stuck.map((task) => <p key={task.id} className="rounded-md bg-white px-3 py-2 text-sm text-orange-800">{task.title} · 已延期 {task.delay_count} 次</p>)}
          </CardContent>
        </Card>
      )}
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          actions.upsertReview(review);
          actions.setMessage("今日复盘已保存");
        }}
      >
        <Card><CardContent className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5 text-sm font-medium text-slate-700">复盘日期<Input type="date" value={review.date} onChange={(event) => setReview({ ...review, date: event.target.value })} /></label>
          <label className="space-y-1.5 text-sm font-medium text-slate-700">今日评分 1-10<Input type="number" min={1} max={10} value={review.score} onChange={(event) => setReview({ ...review, score: Number(event.target.value) })} /></label>
          <label className="space-y-1.5 text-sm font-medium text-slate-700 md:col-span-2">今天完成了什么<Textarea value={review.completed_summary} onChange={(event) => setReview({ ...review, completed_summary: event.target.value })} /></label>
          <label className="space-y-1.5 text-sm font-medium text-slate-700 md:col-span-2">今天没完成什么<Textarea value={review.unfinished_summary} onChange={(event) => setReview({ ...review, unfinished_summary: event.target.value })} /></label>
          <label className="space-y-1.5 text-sm font-medium text-slate-700 md:col-span-2">没完成原因<Textarea value={review.reason} onChange={(event) => setReview({ ...review, reason: event.target.value })} /></label>
          <label className="space-y-1.5 text-sm font-medium text-slate-700 md:col-span-2">明天顺延任务<Textarea value={review.rollover_tasks} onChange={(event) => setReview({ ...review, rollover_tasks: event.target.value })} /></label>
          <label className="space-y-1.5 text-sm font-medium text-slate-700 md:col-span-2">今日有效产出<Textarea value={review.outputs} onChange={(event) => setReview({ ...review, outputs: event.target.value })} /></label>
          <label className="space-y-1.5 text-sm font-medium text-slate-700 md:col-span-2">明日最重要三件事<Textarea value={review.tomorrow_top3} onChange={(event) => setReview({ ...review, tomorrow_top3: event.target.value })} /></label>
          <label className="space-y-1.5 text-sm font-medium text-slate-700 md:col-span-2">备注<Textarea value={review.note} onChange={(event) => setReview({ ...review, note: event.target.value })} /></label>
        </CardContent></Card>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setReview({ ...review, ...autoReview(data) })}>重新自动汇总</Button>
          <Button type="submit">保存复盘</Button>
        </div>
      </form>
    </div>
  );
}
