const NavigationSidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: '🏠', count: 0 },
    { name: 'Tasks', icon: '📋', count: 0 },
    { name: 'Projects', icon: '📁', count: 0 },
    { name: 'Team', icon: '👥', count: 0 },
    { name: 'Analytics', icon: '📊', count: 0 },
    { name: 'Profile', icon: '👤', count: 0 },
  ];

  return (
    <nav className="bg-card w-64 h-full p-4">
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li key={item.name} className="flex items-center gap-4 text-foreground">
            <span className="text-xl">{item.icon}</span>
            <span className="flex-1 font-medium">{item.name}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
};