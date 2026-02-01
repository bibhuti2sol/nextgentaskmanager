'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'upcoming' | 'delayed';
  progress: number;
  tasksCompleted: number;
  totalTasks: number;
  owner: string;
}

interface MilestoneTrackerProps {
  milestones: Milestone[];
  onMilestoneUpdate?: (milestoneId: string, updates: Partial<Milestone>) => void;
}

const MilestoneTracker = ({ milestones, onMilestoneUpdate }: MilestoneTrackerProps) => {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'in-progress':
        return 'bg-primary text-primary-foreground';
      case 'upcoming':
        return 'bg-muted text-muted-foreground';
      case 'delayed':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'CheckCircleIcon';
      case 'in-progress':
        return 'ClockIcon';
      case 'upcoming':
        return 'CalendarIcon';
      case 'delayed':
        return 'ExclamationTriangleIcon';
      default:
        return 'FlagIcon';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'upcoming':
        return 'Upcoming';
      case 'delayed':
        return 'Delayed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="w-full bg-card rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-semibold text-lg text-foreground">Milestone Tracker</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth">
            <Icon name="PlusIcon" size={18} variant="outline" />
            <span className="font-caption text-sm">Add Milestone</span>
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

          {/* Milestones */}
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="relative pl-16">
                {/* Timeline Dot */}
                <div
                  className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(
                    milestone.status
                  )}`}
                >
                  <Icon name={getStatusIcon(milestone.status) as any} size={24} variant="solid" />
                </div>

                {/* Milestone Card */}
                <div
                  className={`bg-background border border-border rounded-lg p-4 transition-smooth hover:shadow-elevation-2 cursor-pointer ${
                    selectedMilestone === milestone.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedMilestone(milestone.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-heading font-semibold text-base text-foreground mb-1">
                        {milestone.name}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Icon name="CalendarIcon" size={14} variant="outline" />
                          <span className="font-caption text-xs">
                            Due: {new Date(milestone.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="UserIcon" size={14} variant="outline" />
                          <span className="font-caption text-xs">{milestone.owner}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-caption font-medium ${getStatusColor(
                        milestone.status
                      )}`}
                    >
                      {getStatusText(milestone.status)}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-caption text-xs text-muted-foreground">
                        {milestone.tasksCompleted} of {milestone.totalTasks} tasks completed
                      </span>
                      <span className="font-caption text-xs font-medium text-foreground">
                        {milestone.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          milestone.status === 'completed'
                            ? 'bg-success'
                            : milestone.status === 'delayed' ?'bg-error' :'bg-primary'
                        }`}
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-smooth">
                      <Icon name="EyeIcon" size={14} variant="outline" />
                      <span className="font-caption text-xs">View Details</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-smooth">
                      <Icon name="PencilIcon" size={14} variant="outline" />
                      <span className="font-caption text-xs">Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Predictive Alert */}
      <div className="px-6 pb-6">
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-warning rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="BellAlertIcon" size={18} variant="solid" className="text-warning-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-heading font-semibold text-sm text-foreground mb-2">Predictive Delay Alert</h4>
              <p className="font-caption text-sm text-muted-foreground leading-relaxed">
                Based on current velocity, the "Beta Testing"milestone may be delayed by 3-5 days. Consider accelerating the"Development Phase" or adjusting the timeline to maintain project schedule.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneTracker;