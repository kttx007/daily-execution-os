import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { storage } from '@/services/storageService';
import { OutputLog } from '@/types';
import { FileText, ExternalLink, Share2, Copy, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<OutputLog[]>([]);

  const loadLogs = async () => {
    const allLogs = await storage.getOutputLogs();
    setLogs(allLogs.sort((a, b) => new Date(b.completed_date).getTime() - new Date(a.completed_date).getTime()));
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-24 max-w-7xl mx-auto">
      <header className="flex justify-between items-center bg-white/5 p-8 rounded-[2rem] border border-white/10 glass-card">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-black tracking-[0.2em]">
            <FileText size={16} />
            <span className="text-[10px] uppercase">Asset Repository</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">输出日志 & SOP</h1>
          <p className="text-muted-foreground text-sm font-medium">执行即资产。沉淀每一个可复用的 SOP。</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {logs.length > 0 ? logs.map((log) => (
          <Card key={log.id} className="glass-card hover:bg-white/5 transition-all group border border-white/5">
            <CardHeader className="p-8 pb-4 border-b border-white/5 flex flex-row justify-between items-start">
              <div className="bg-white/5 text-primary p-3 rounded-2xl border border-white/10">
                <FileText size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all">
                <button className="p-2 hover:bg-white/10 rounded-xl text-muted-foreground hover:text-white transition-all"><Copy size={16} /></button>
                <button className="p-2 hover:bg-white/10 rounded-xl text-muted-foreground hover:text-white transition-all"><Share2 size={16} /></button>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <h3 className="font-black text-xl text-zinc-100 group-hover:text-white leading-tight tracking-tight">{log.title}</h3>
              <div className="flex flex-wrap gap-3">
                <span className="text-[10px] font-black bg-white/5 px-2.5 py-1 rounded-md uppercase tracking-widest text-muted-foreground/60 border border-white/5">
                  {log.category}
                </span>
                <span className={cn(
                  "text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest border",
                  log.value_level === '高' 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                    : "bg-white/5 text-muted-foreground/40 border-white/5"
                )}>
                  Value: {log.value_level}
                </span>
              </div>
              
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 tabular-nums">
                Completed: {log.completed_date}
              </div>

              {log.output_link ? (
                <a 
                  href={log.output_link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-primary-foreground rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl active:scale-95"
                >
                  <ExternalLink size={16} />
                  Open Asset Document
                </a>
              ) : (
                <div className="w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-white/5 rounded-2xl text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.2em]">
                  <BookOpen size={16} />
                  Registry Record Only
                </div>
              )}
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-full h-96 flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-white/5 bg-white/[0.01]">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5">
              <FileText size={32} className="text-muted-foreground/20" />
            </div>
            <div className="text-muted-foreground/30 font-black uppercase tracking-[0.3em]">Vault is empty</div>
            <p className="text-[10px] text-muted-foreground/20 mt-4 max-w-xs text-center leading-relaxed">
              Complete tasks to auto-generate asset logs and build your execution moat.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
