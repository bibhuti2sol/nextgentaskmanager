'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/components/common/UserContext';
import NavigationSidebar from '@/components/common/NavigationSidebar';
import UserRoleIndicator from '@/components/common/UserRoleIndicator';
import ThemeToggle from '@/components/common/ThemeToggle';
import Icon from '@/components/ui/AppIcon';
import axios from 'axios';
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
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'appearance' | 'privacy'>('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    jobTitle: '',
    location: '',
    timezone: 'Asia/Kolkata',
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
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://43.205.137.114:8080/api/v1/users/39', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs',
          },
        });

        if (response.data && response.data.success) {
          const userData = response.data.data;
          setPersonalInfo({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phone || '+91 98765 43210',
            department: userData.departmentName || 'Engineering',
            jobTitle: userData.roles?.[0]?.replace('ROLE_', '') || 'Team Member',
            location: userData.location || 'New Delhi, India',
            timezone: userData.timezone || 'Asia/Kolkata',
          });

          // Sync role
          const roleRaw = userData.roles?.[0]?.replace('ROLE_', '').toLowerCase();
          if (roleRaw === 'admin') setCurrentRole('Admin');
          else if (roleRaw === 'manager') setCurrentRole('Manager');
          else setCurrentRole('Associate');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-caption animate-pulse">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="XCircleIcon" size={32} />
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Failed to load profile</h2>
          <p className="text-muted-foreground font-caption text-sm mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth"
          >
            Try Again
          </button>
        </div>
      </div>
    );
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
        userRole={user?.userRole}
        isMobileOpen={isSidebarMobileOpen}
        onMobileClose={() => setIsSidebarMobileOpen(false)}
      />

      <div
        className={`transition-smooth ${
          sidebarCollapsed ? 'ml-[60px]' : 'ml-[240px]'
        }`}
      >
        <main className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-md"
              onClick={() => setIsSidebarMobileOpen(true)}
            >
              <Icon name="Bars3Icon" size={24} variant="outline" />
            </button>
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Account Settings
              </h1>
            <p className="text-sm font-caption text-muted-foreground">
              Manage your profile, preferences, and security settings
            </p>
          </div>
          </div>

          <ProfileHeader
            userName={`${personalInfo.firstName} ${personalInfo.lastName}`}
            userEmail={personalInfo.email}
            userRole={user?.userRole || 'Associate'}
            profileImage={personalInfo.firstName === 'Narendra' ? "https://img.rocket.new/generatedImages/rocket_gen_img_18f2762b3-1763132001404.png" : "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"}
            profileImageAlt={`Professional headshot of ${personalInfo.firstName} ${personalInfo.lastName}`}
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