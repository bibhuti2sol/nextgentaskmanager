'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface UserRoleIndicatorProps {
  currentRole: 'Admin' | 'Manager' | 'Associate';
  userName?: string;
  isCollapsed?: boolean;
  onRoleChange?: (role: 'Admin' | 'Manager' | 'Associate') => void;
}

const UserRoleIndicator = ({
  currentRole,
  userName = 'User',
  isCollapsed = false,
  onRoleChange,
}: UserRoleIndicatorProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const roles: Array<'Admin' | 'Manager' | 'Associate'> = ['Admin', 'Manager', 'Associate'];

  const roleColors = {
    Admin: 'bg-error text-error-foreground',
    Manager: 'bg-warning text-warning-foreground',
    Associate: 'bg-success text-success-foreground',
  };

  const roleIcons = {
    Admin: 'ShieldCheckIcon',
    Manager: 'BriefcaseIcon',
    Associate: 'UserIcon',
  };

  const handleRoleSelect = (role: 'Admin' | 'Manager' | 'Associate') => {
    onRoleChange?.(role);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth"
        aria-label="User role and settings"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${roleColors[currentRole]}`}>
          <Icon name={roleIcons[currentRole] as any} size={18} variant="solid" />
        </div>
        {!isCollapsed && (
          <div className="flex-1 text-left">
            <p className="font-caption font-medium text-sm text-foreground">{userName}</p>
            <p className="font-caption text-xs text-muted-foreground">{currentRole}</p>
          </div>
        )}
        {!isCollapsed && (
          <Icon
            name={isDropdownOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'}
            size={16}
            variant="outline"
          />
        )}
      </button>

      {isDropdownOpen && !isCollapsed && (
        <>
          <div
            className="fixed inset-0 z-[1100]"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-popover border border-border rounded-md shadow-elevation-3 overflow-hidden z-[1150]">
            <div className="py-2">
              <div className="px-4 py-2 border-b border-border">
                <p className="font-caption text-xs text-muted-foreground">Switch Role</p>
              </div>
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-smooth ${
                    currentRole === role
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${roleColors[role]}`}>
                    <Icon name={roleIcons[role] as any} size={14} variant="solid" />
                  </div>
                  <span className="font-caption text-sm">{role}</span>
                  {currentRole === role && (
                    <Icon name="CheckIcon" size={16} variant="outline" className="ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserRoleIndicator;