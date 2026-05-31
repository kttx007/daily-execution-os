import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Plus, Search, Filter, ArrowRight, MoreVertical } from 'lucide-react';
import { storage } from '@/services/storageService';
import { TaskService } from '@/services/taskService';
import { InboxItem, Task } from '@/types';
import TaskModal from '@/components/tasks/TaskModal';

const Inbox: React.FC = () => {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [convertingItem, setConvertingItem] = useState<InboxItem | null>(null);

  const loadItems = () => {
    storage.getInboxItems().then(setItems);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleConvertToTask = (item: InboxItem) => {
    setConvertingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    await TaskService.createTask(
      taskData.title!,
      taskData.priority!,
      taskData.quadrant!,
      taskData.category!,
      { note: taskData.note }
    );
    
    if (convertingItem) {
      await storage.deleteInboxItem(convertingItem.id);
    }
    
    setIsModalOpen(false);
    setConvertingItem(null);
    loadItems();
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">任务收集箱</h1>
        <button className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:scale-105 transition-transform">
          <Plus size={24} />
        </button>
      </header>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            placeholder="快速搜索想法、文件或事项..." 
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border-none rounded-xl focus:ring-2 ring-primary transition-all"
          />
        </div>
        <button className="p-2 border rounded-xl hover:bg-accent">
          <Filter size={20} className="text-muted-foreground" />
        </button>
      </div>

      <div className="grid gap-3">
        {items.length > 0 ? items.map(item => (
          <Card key={item.id} className="group hover:border-primary/50 transition-all cursor-pointer">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {item.source.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground mt-1">来源：{item.source} • {new Date(item.created_at).toLocaleDateString()}</div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleConvertToTask(item)}
                  className="p-1.5 hover:bg-muted rounded-lg text-primary" 
                  title="转化为任务"
                >
                  <ArrowRight size={18} />
                </button>
                <button className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground">
                  <MoreVertical size={18} />
                </button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl">
            <div className="text-muted-foreground">这里空空如也</div>
            <p className="text-xs text-muted-foreground/60 mt-2">快把冒出来的想法丢进来吧</p>
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        task={convertingItem ? { title: convertingItem.title, note: convertingItem.note } as Task : null}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default Inbox;
