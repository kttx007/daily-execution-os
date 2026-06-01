import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Plus, Search, Filter, ArrowRight, MoreVertical, Inbox as InboxIcon } from 'lucide-react';
import { storage } from '@/services/storageService';
import { TaskService } from '@/services/taskService';
import { InboxItem, Task } from '@/types';
import TaskModal from '@/components/tasks/TaskModal';
import InboxItemModal from '@/components/tasks/InboxItemModal';
import { generateId } from '@/utils/uuid';

const Inbox: React.FC = () => {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isInboxModalOpen, setIsInboxModalOpen] = useState(false);
  const [convertingItem, setConvertingItem] = useState<InboxItem | null>(null);

  const loadItems = () => {
    storage.getInboxItems().then(setItems);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleAddItem = () => {
    setIsInboxModalOpen(true);
  };

  const handleSaveInboxItem = async (itemData: Partial<InboxItem>) => {
    const newItem: InboxItem = {
      id: generateId(),
      user_id: 'default_user',
      title: itemData.title!,
      source: itemData.source || 'Manual',
      note: itemData.note || '',
      is_processed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await storage.saveInboxItem(newItem);
    setIsInboxModalOpen(false);
    loadItems();
  };

  const handleConvertToTask = (item: InboxItem) => {
    setConvertingItem(item);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    await TaskService.createTask(
      taskData.title!,
      taskData.priority!,
      taskData.quadrant!,
      taskData.category!,
      { 
        note: taskData.note,
        plan_date: taskData.plan_date || new Date().toISOString().split('T')[0],
        due_time: taskData.due_time
      }
    );
    
    if (convertingItem) {
      await storage.deleteInboxItem(convertingItem.id);
    }
    
    setIsTaskModalOpen(false);
    setConvertingItem(null);
    loadItems();
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-24 max-w-5xl mx-auto">
      <header className="flex justify-between items-center bg-white/5 p-8 rounded-[2rem] border border-white/10 glass-card">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-black tracking-[0.2em]">
            <InboxIcon size={16} />
            <span className="text-[10px] uppercase">Idea Ingestor</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">想法收集箱</h1>
          <p className="text-muted-foreground text-sm font-medium">
            随时记录闪念，之后再处理。别让灵感溜走。
          </p>
        </div>
        <button 
          onClick={handleAddItem}
          className="bg-white text-black w-14 h-14 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-110 hover:rotate-90 transition-all duration-500 flex items-center justify-center group"
        >
          <Plus size={28} className="group-hover:stroke-[3px]" />
        </button>
      </header>

      <div className="flex gap-4 p-2 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-white transition-colors" size={18} />
          <input 
            placeholder="快速检索你的闪念..." 
            className="w-full pl-12 pr-4 py-3 bg-transparent border-none rounded-xl focus:ring-0 text-white placeholder:text-muted-foreground/40 font-medium"
          />
        </div>
        <button className="px-4 border-l border-white/5 hover:text-white transition-colors">
          <Filter size={20} className="text-muted-foreground" />
        </button>
      </div>

      <div className="grid gap-4">
        {items.length > 0 ? items.map(item => (
          <Card key={item.id} className="glass-card hover:bg-white/5 transition-all group border-l-[6px] border-l-transparent hover:border-l-primary">
            <CardContent className="p-6 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/5 font-black text-xl shadow-inner group-hover:scale-110 transition-transform">
                {item.source.charAt(0)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="text-lg font-bold text-zinc-200 group-hover:text-white transition-colors">{item.title}</div>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                  <span className="bg-white/5 px-2 py-0.5 rounded-sm">Source: {item.source}</span>
                  <span>Captured {new Date(item.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                <button 
                  onClick={() => handleConvertToTask(item)}
                  className="w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground rounded-xl hover:scale-110 transition-all shadow-lg"
                  title="转化为任务"
                >
                  <ArrowRight size={20} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-white/5 text-muted-foreground rounded-xl hover:text-white hover:bg-white/10 transition-all">
                  <MoreVertical size={20} />
                </button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="h-64 flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-white/5 bg-white/[0.01]">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <InboxIcon size={24} className="text-muted-foreground/20" />
            </div>
            <div className="text-muted-foreground/30 font-black uppercase tracking-widest">Mind clear</div>
            <p className="text-[10px] text-muted-foreground/20 mt-2">Zero unprocessed entries</p>
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        task={convertingItem ? { title: convertingItem.title, note: convertingItem.note } as Task : null}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
      />

      <InboxItemModal
        isOpen={isInboxModalOpen}
        onClose={() => setIsInboxModalOpen(false)}
        onSave={handleSaveInboxItem}
      />
    </div>
  );
};

export default Inbox;
