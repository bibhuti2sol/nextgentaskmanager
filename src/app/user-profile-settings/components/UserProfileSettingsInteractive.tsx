'use client';

import { useState, useEffect } from 'react';
import NavigationSidebar from '@/components/common/NavigationSidebar';
import UserRoleIndicator from '@/components/common/UserRoleIndicator';
import ThemeToggle from '@/components/common/ThemeToggle';
import Icon from '@/components/ui/AppIcon';
import ProfileHeader from './ProfileHeader';
import PersonalInfoSection from './PersonalInfoSection';
import NotificationPreferences from './NotificationPreferences';
import SecuritySettings from './SecuritySettings';
import AppearanceSettings from './AppearanceSettings';
import PrivacyDataSettings from './PrivacyDataSettings';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  location: string;
  timezone: string;
}

interface NotificationSettings {
  emailNotifications: {
    taskAssigned: boolean;
    taskCompleted: boolean;
    deadlineReminders: boolean;
    escalations: boolean;
    weeklyDigest: boolean;
  };
  popupNotifications: {
    taskUpdates: boolean;
    mentions: boolean;
    comments: boolean;
    realTimeCollaboration: boolean;
  };
  frequency: 'instant' | 'hourly' | 'daily';
}

const UserProfileSettingsInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Manager' | 'Associate'>('Manager');
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'appearance' | 'privacy'>('profile');

  const [personalInfo] = useState<PersonalInfo>({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@nextgentask.com',
    phone: '+1 (555) 123-4567',
    department: 'Product Management',
    jobTitle: 'Senior Product Manager',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
  });

  const [notificationSettings] = useState<NotificationSettings>({
    emailNotifications: {
      taskAssigned: true,
      taskCompleted: true,
      deadlineReminders: true,
      escalations: true,
      weeklyDigest: false,
    },
    popupNotifications: {
      taskUpdates: true,
      mentions: true,
      comments: false,
      realTimeCollaboration: true,
    },
    frequency: 'instant',
  });

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [density, setDensity] = useState<'comfortable' | 'compact' | 'spacious'>('comfortable');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleImageUpload = (file: File) => {
    console.log('Image uploaded:', file.name);
  };

  const handlePersonalInfoSave = (data: PersonalInfo) => {
    console.log('Personal info saved:', data);
  };

  const handleNotificationSave = (settings: NotificationSettings) => {
    console.log('Notification settings saved:', settings);
  };

  const handlePasswordChange = () => {
    console.log('Password changed successfully');
  };

  const handleToggle2FA = (enabled: boolean) => {
    console.log('2FA toggled:', enabled);
  };

  const handleViewSessions = () => {
    console.log('Viewing active sessions');
  };

  const handleViewAuditLog = () => {
    console.log('Viewing audit log');
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleDensityChange = (newDensity: 'comfortable' | 'compact' | 'spacious') => {
    setDensity(newDensity);
  };

  const handleExportData = () => {
    console.log('Exporting user data');
  };

  const handleDeleteAccount = () => {
    console.log('Account deletion requested');
  };

  if (!isHydrated) {
    return null;
  }

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: 'UserCircleIcon' },
    { id: 'notifications' as const, label: 'Notifications', icon: 'BellIcon' },
    { id: 'security' as const, label: 'Security', icon: 'ShieldCheckIcon' },
    { id: 'appearance' as const, label: 'Appearance', icon: 'PaintBrushIcon' },
    { id: 'privacy' as const, label: 'Privacy & Data', icon: 'LockClosedIcon' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      <div
        className={`transition-smooth ${
          sidebarCollapsed ? 'ml-[60px]' : 'ml-[240px]'
        }`}
      >
        <main className="p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Account Settings
            </h1>
            <p className="text-sm font-caption text-muted-foreground">
              Manage your profile, preferences, and security settings
            </p>
          </div>

          <ProfileHeader
            userName={`${personalInfo.firstName} ${personalInfo.lastName}`}
            userEmail={personalInfo.email}
            userRole={currentRole}
            profileImage="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
            profileImageAlt="Professional headshot of woman with brown hair in business attire smiling at camera"
            onImageUpload={handleImageUpload}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Tabs Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-4 shadow-elevation-1 sticky top-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-smooth ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon
                        name={tab.icon as any}
                        size={20}
                        variant="outline"
                        className={activeTab === tab.id ? 'text-primary-foreground' : 'text-current'}
                      />
                      <span className="font-caption font-medium text-sm">{tab.label}</span>
                    </button>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-border space-y-2">
                  <ThemeToggle isCollapsed={false} />
                  <UserRoleIndicator
                    currentRole={currentRole}
                    userName={personalInfo.firstName}
                    isCollapsed={false}
                    onRoleChange={setCurrentRole}
                  />
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {activeTab === 'profile' && (
                <PersonalInfoSection
                  initialData={personalInfo}
                  onSave={handlePersonalInfoSave}
                />
              )}

              {activeTab === 'notifications' && (
                <NotificationPreferences
                  initialSettings={notificationSettings}
                  onSave={handleNotificationSave}
                />
              )}

              {activeTab === 'security' && (
                <SecuritySettings
                  twoFactorEnabled={true}
                  lastPasswordChange="December 15, 2025"
                  activeSessions={3}
                  onPasswordChange={handlePasswordChange}
                  onToggle2FA={handleToggle2FA}
                  onViewSessions={handleViewSessions}
                  onViewAuditLog={handleViewAuditLog}
                />
              )}

              {activeTab === 'appearance' && (
                <AppearanceSettings
                  currentTheme={theme}
                  currentDensity={density}
                  onThemeChange={handleThemeChange}
                  onDensityChange={handleDensityChange}
                />
              )}

              {activeTab === 'privacy' && (
                <PrivacyDataSettings
                  onExportData={handleExportData}
                  onDeleteAccount={handleDeleteAccount}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfileSettingsInteractive;