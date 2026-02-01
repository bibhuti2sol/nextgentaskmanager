'use client';

import Icon from '@/components/ui/AppIcon';

interface QuickAction {
  id: number;
  label: string;
  icon: string;
  color: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActions = ({ actions }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-smooth hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center gap-3"
        >
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color}`}>
            <Icon name={action.icon as any} size={24} variant="outline" />
          </div>
          <span className="font-caption font-medium text-sm text-foreground text-center">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;