'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import CalendarWidget from '@/components/common/CalendarWidget';

interface NavigationItem {
  label: string;
  path: string;
  icon: string;
  notificationCount?: number;
  allowedRoles?: Array<'Admin' | 'Manager' | 'Associate'>;
}

interface NavigationSidebarProps {
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  userRole?: 'Admin' | 'Manager' | 'Associate';
}

const NavigationSidebar = ({ isCollapsed = false, onCollapsedChange, userRole }: NavigationSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [mounted, setMounted] = useState(false);
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Manager' | 'Associate'>(userRole || 'Associate');

  useEffect(() => {
    setMounted(true);
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setCollapsed(savedState === 'true');
    }
    
    // Get user role from localStorage or props
    const savedRole = localStorage.getItem('userRole') as 'Admin' | 'Manager' | 'Associate' | null;
    if (savedRole) {
      setCurrentRole(savedRole);
    } else if (userRole) {
      setCurrentRole(userRole);
      localStorage.setItem('userRole', userRole);
    }
  }, [userRole]);

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  const navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'HomeIcon',
      notificationCount: 0,
    },
    {
      label: 'User Management',
      path: '/user-management',
      icon: 'UserGroupIcon',
      notificationCount: 0,
      allowedRoles: ['Admin'], // Only Admin can access
    },
    {
      label: 'Tasks',
      path: '/task-management',
      icon: 'ClipboardDocumentListIcon',
      notificationCount: 5,
    },
    {
      label: 'Projects',
      path: '/project-overview',
      icon: 'FolderIcon',
      notificationCount: 2,
    },
    {
      label: 'Team',
      path: '/team-workload',
      icon: 'UsersIcon',
      notificationCount: 0,
    },
    {
      label: 'Analytics',
      path: '/analytics-reports',
      icon: 'ChartBarIcon',
      notificationCount: 0,
    },
    {
      label: 'Profile',
      path: '/user-profile-settings',
      icon: 'UserCircleIcon',
      notificationCount: 0,
    },
  ];

  // Filter navigation items based on user role
  const filteredNavigationItems = navigationItems.filter((item) => {
    if (!item.allowedRoles) return true; // No role restriction
    return item.allowedRoles.includes(currentRole);
  });

  const handleToggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
    onCollapsedChange?.(newState);
  };

  const handleLogout = () => {
    // Clear any stored user data
    localStorage.removeItem('user-session');
    localStorage.removeItem('userRole');
    // Redirect to login page
    router.push('/login');
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-card border-r border-border transition-smooth z-[1000] ${
        collapsed ? 'w-[60px]' : 'w-[240px]'
      }`}
      suppressHydrationWarning
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-between h-[72px] px-4 border-b border-border">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-3">
              <img
                src="/assets/images/nextgentask-logo.png"
                alt="NextGenTask Logo"
                className="w-12 h-12 rounded-xl shadow-lg"
                style={{ objectFit: 'cover' }}
              />
              <div className="flex flex-col ml-2">
                <span className="font-heading font-bold text-xl text-primary">NextGenTask</span>
                <span className="font-caption text-base text-success">Manager</span>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="flex items-center justify-center w-full">
              <img
                src="/assets/images/nextgentask-logo.png"
                alt="NextGenTask Logo"
                className="w-10 h-10 rounded-xl shadow-lg"
                style={{ objectFit: 'cover' }}
              />
            </Link>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <ul className="space-y-2">
            {filteredNavigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md transition-smooth group relative ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon
                    name={item.icon as any}
                    size={24}
                    variant="outline"
                    className={`flex-shrink-0 ${
                      isActive(item.path) ? 'text-primary-foreground' : 'text-current'
                    }`}
                  />
                  {!collapsed && (
                    <>
                      <span className="font-caption font-medium text-sm">{item.label}</span>
                      {item.notificationCount && item.notificationCount > 0 && (
                        <span className="ml-auto bg-error text-error-foreground text-xs font-caption font-medium px-2 py-0.5 rounded-full min-w-[20px] text-center">
                          {item.notificationCount > 99 ? '99+' : item.notificationCount}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && item.notificationCount && item.notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs font-caption font-medium w-5 h-5 rounded-full flex items-center justify-center">
                      {item.notificationCount > 9 ? '9+' : item.notificationCount}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Calendar Widget */}
        <CalendarWidget isCollapsed={collapsed} />

        {/* Toggle Button */}
        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-3 py-3 mb-2 rounded-md text-error hover:bg-error/10 transition-smooth"
            aria-label="Logout"
          >
            <Icon
              name="ArrowRightOnRectangleIcon"
              size={24}
              variant="outline"
            />
            {!collapsed && <span className="font-caption font-medium text-sm">Logout</span>}
          </button>
          <button
            onClick={handleToggleCollapse}
            className="w-full flex items-center justify-center gap-3 px-3 py-3 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon
              name={collapsed ? 'ChevronRightIcon' : 'ChevronLeftIcon'}
              size={24}
              variant="outline"
            />
            {!collapsed && <span className="font-caption font-medium text-sm">Collapse</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default NavigationSidebar;