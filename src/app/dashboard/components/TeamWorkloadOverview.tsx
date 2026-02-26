import AppImage from '@/components/ui/AppImage';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  alt: string;
  activeTasks: number;
  workloadPercentage: number;
}

interface TeamWorkloadOverviewProps {
  teamMembers: TeamMember[];
}

const TeamWorkloadOverview = ({ teamMembers }: TeamWorkloadOverviewProps) => {
  const getWorkloadColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-error';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="space-y-4">
      {teamMembers.map((member) => (
        <div
          key={member.id}
          className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-smooth"
        >
          <div className="flex items-center gap-4 mb-3">
            {/* Avatar removed as requested */}
            <div className="flex-1 min-w-0">
              <h4 className="font-heading font-semibold text-base text-foreground truncate">
                {member.name}
              </h4>
              <p className="text-sm text-muted-foreground font-caption">{member.role}</p>
            </div>
            <div className="text-right">
              <p className="font-heading font-bold text-lg text-foreground">{member.activeTasks}</p>
              <p className="text-xs text-muted-foreground font-caption">Active Tasks</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-caption text-muted-foreground">Workload</span>
              <span className="font-caption font-medium text-foreground">{member.workloadPercentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-smooth ${getWorkloadColor(member.workloadPercentage)}`}
                style={{ width: `${member.workloadPercentage}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamWorkloadOverview;