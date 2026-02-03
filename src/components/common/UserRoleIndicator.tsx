'use client';

import { useState } from 'react';
import { useUser } from './UserContext';
import Icon from '@/components/ui/AppIcon';

interface UserRoleIndicatorProps {
  currentRole: 'Admin' | 'Manager' | 'Associate';
  userName?: string;
  isCollapsed?: boolean;
  onRoleChange?: (role: 'Admin' | 'Manager' | 'Associate') => void;
}


const UserRoleIndicator = (props: Partial<UserRoleIndicatorProps>) => {
  const { user } = useUser();
  const currentRole = props.currentRole || user?.userRole || 'Associate';
  const userName = props.userName || user?.userName || 'User';
  const isCollapsed = props.isCollapsed ?? false;

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

  return (
    <div className="relative">
      <div
        className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-muted-foreground bg-muted cursor-default"
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
      </div>
    </div>
  );
};

export default UserRoleIndicator;