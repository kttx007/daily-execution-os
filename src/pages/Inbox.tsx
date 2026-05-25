import React from 'react';
const Placeholder = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center h-full text-muted-foreground italic">
    {name} 页面开发中...
  </div>
);

export default () => <Placeholder name="收集箱" />;
