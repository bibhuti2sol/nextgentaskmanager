'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  alt: string;
  allocation: number;
  availability: 'available' | 'busy' | 'unavailable';
  currentTasks: number;
  capacity: number;
}

interface ResourceAllocationProps {
  teamMembers: TeamMember[];
  onReallocation?: (memberId: string, newAllocation: number) => void;
}

const ResourceAllocation = ({ teamMembers, onReallocation }: ResourceAllocationProps) => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-success';
      case 'busy':
        return 'bg-warning';
      case 'unavailable':
        return 'bg-error';
      default:
        return 'bg-muted';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      case 'unavailable':
        return 'Unavailable';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="w-full bg-card rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-semibold text-lg text-foreground">Resource Allocation</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth">
            <Icon name="UserPlusIcon" size={18} variant="outline" />
            <span className="font-caption text-sm">Add Member</span>
          </button>
        </div>
      </div>

      {/* Team Members List */}
      <div className="p-6">
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className={`bg-background border border-border rounded-lg p-4 transition-smooth hover:shadow-elevation-2 cursor-pointer ${
                selectedMember === member.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedMember(member.id)}
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <AppImage
                      src={member.avatar}
                      alt={member.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getAvailabilityColor(
                      member.availability
                    )}`}
                  />
                </div>

                {/* Member Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-caption font-semibold text-sm text-foreground">{member.name}</h4>
                    <span className="font-caption text-xs text-muted-foreground">•</span>
                    <span className="font-caption text-xs text-muted-foreground">{member.role}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Icon name="ClipboardDocumentListIcon" size={14} variant="outline" className="text-muted-foreground" />
                      <span className="font-caption text-xs text-muted-foreground">
                        {member.currentTasks} / {member.capacity} tasks
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-caption font-medium ${getAvailabilityColor(
                        member.availability
                      )} text-white`}
                    >
                      {getAvailabilityText(member.availability)}
                    </span>
                  </div>
                </div>

                {/* Allocation */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-heading font-bold text-lg text-foreground">{member.allocation}%</p>
                    <p className="font-caption text-xs text-muted-foreground">Allocated</p>
                  </div>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-md border border-border hover:bg-muted transition-smooth"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle reallocation
                    }}
                  >
                    <Icon name="PencilIcon" size={16} variant="outline" className="text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Allocation Bar */}
              <div className="mt-4">
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      member.allocation >= 90
                        ? 'bg-error'
                        : member.allocation >= 70
                        ? 'bg-warning' :'bg-success'
                    }`}
                    style={{ width: `${member.allocation}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Workload Balancing */}
      <div className="px-6 pb-6">
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="LightBulbIcon" size={18} variant="solid" className="text-accent-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-heading font-semibold text-sm text-foreground mb-2">
                Smart Workload Balancing Recommendation
              </h4>
              <p className="font-caption text-sm text-muted-foreground leading-relaxed mb-3">
                Sarah Johnson is currently at 95% capacity. Consider redistributing 2 tasks to Michael Chen (60%
                capacity) to optimize team workload and prevent burnout.
              </p>
              <button className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-smooth">
                <Icon name="ArrowPathIcon" size={16} variant="outline" />
                <span className="font-caption text-sm font-medium">Apply Recommendation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceAllocation;