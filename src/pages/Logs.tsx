import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { localProvider } from '@/services/localStorage';
import { OutputLog } from '@/types';
import { FileText, ExternalLink, Share2, Copy, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<OutputLog[]>([]);

  const loadLogs = async () => {
    const allLogs = await localProvider.getOutputLogs();
    setLogs(allLogs.sort((a, b) => new Date(b.completed_date).getTime() - new Date(a.completed_date).getTime()));
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">输出日志 & SOP</h1>
        <p className="text-muted-foreground mt-1">执行即资产。沉淀每一个可复用的 SOP。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {logs.length > 0 ? logs.map((log) => (
          <Card key={log.id} className="group hover:border-primary/50 transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="bg-primary/10 text-primary p-2 rounded-xl">
                  <FileText size={20} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button className="p-1.5 hover:bg-muted rounded-lg"><Copy size={14} /></button>
                  <button className="p-1.5 hover:bg-muted rounded-lg"><Share2 size={14} /></button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{log.title}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-full uppercase">
                  {log.category}
                </span>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                  log.value_level === '高' ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                )}>
                  价值：{log.value_level}
                </span>
              </div>
              
              <div className="text-xs text-muted-foreground mb-4">
                完成日期：{log.completed_date}
              </div>

              {log.output_link ? (
                <a 
                  href={log.output_link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 bg-muted hover:bg-primary/10 hover:text-primary rounded-xl text-xs font-bold transition-all"
                >
                  <ExternalLink size={14} />
                  查看产出文档
                </a>
              ) : (
                <div className="w-full flex items-center justify-center gap-2 py-2 border border-dashed rounded-xl text-xs text-muted-foreground italic">
                  <BookOpen size={14} />
                  仅记录，无外链
                </div>
              )}
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-full py-40 text-center border-2 border-dashed rounded-[2rem] bg-muted/5">
            <div className="text-muted-foreground">尚未沉淀任何执行日志</div>
            <p className="text-xs text-muted-foreground/60 mt-2">完成任务后，系统会自动为您生成日志候选</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
