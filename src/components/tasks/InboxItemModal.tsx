import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { X, Tag } from 'lucide-react';
import { InboxItem } from '@/types';
import { cn } from '@/lib/utils';

interface InboxItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<InboxItem>) => void;
}

const InboxItemModal: React.FC<InboxItemModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('Manual');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setSource('Manual');
      setNote('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-lg shadow-2xl border-primary/10">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold tracking-tight">收集新想法</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              想法/任务标题
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="记录下这个闪念..."
              className="w-full text-lg font-semibold bg-transparent border-none focus:ring-0 p-0 placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Tag size={14} /> 来源
            </label>
            <div className="flex flex-wrap gap-2">
              {['Manual', 'Idea', 'Meeting', 'Other'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSource(s)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                    source === s 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-muted/50 text-muted-foreground hover:bg-muted border-transparent"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              补充笔记
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="有什么需要补充的背景信息吗？"
              className="w-full min-h-[100px] bg-muted/50 border-none rounded-xl p-3 text-sm focus:ring-2 ring-primary transition-all resize-none"
            />
          </div>
        </CardContent>

        <div className="p-6 pt-0 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded-xl hover:bg-accent transition-colors font-medium"
          >
            取消
          </button>
          <button 
            onClick={() => onSave({
              title,
              source,
              note
            })}
            disabled={!title}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 transition-all font-bold"
          >
            加入收集箱
          </button>
        </div>
      </Card>
    </div>
  );
};

export default InboxItemModal;
