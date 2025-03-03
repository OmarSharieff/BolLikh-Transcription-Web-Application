import React from 'react';
import { FileQuestion } from 'lucide-react';

export const EmptyState = ({
  title,
  description,
  icon = <FileQuestion className="h-10 w-10 text-muted-foreground" />,
}) => {
  return (
    <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-8 text-center">
      {icon}
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
