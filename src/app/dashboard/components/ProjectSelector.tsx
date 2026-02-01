interface Project {
  id: number;
  name: string;
}

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: number | null;
  onProjectChange: (projectId: number | null) => void;
}

const ProjectSelector = ({ projects, selectedProjectId, onProjectChange }: ProjectSelectorProps) => {
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="relative">
      <label className="block text-xs font-caption text-muted-foreground mb-1">
        Select Project
      </label>
      <select
        value={selectedProjectId || ''}
        onChange={(e) => onProjectChange(e.target.value ? Number(e.target.value) : null)}
        className="w-[240px] h-10 px-3 pr-8 bg-card border border-border rounded-lg text-sm font-caption text-foreground appearance-none cursor-pointer hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth"
      >
        <option value="">All Projects</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-[30px] pointer-events-none">
        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default ProjectSelector;