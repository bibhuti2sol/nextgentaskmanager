'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

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

interface PersonalInfoSectionProps {
  initialData: PersonalInfo;
  onSave: (data: PersonalInfo) => void;
}

const PersonalInfoSection = ({ initialData, onSave }: PersonalInfoSectionProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState<PersonalInfo>(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    if (!isHydrated) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!isHydrated) return;
    setIsSaving(true);
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      setIsEditing(false);
    }, 1000);
  };

  const handleCancel = () => {
    if (!isHydrated) return;
    setFormData(initialData);
    setIsEditing(false);
  };

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="h-6 w-48 bg-muted rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground">Personal Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-90 transition-smooth"
          >
            <Icon name="PencilIcon" size={16} variant="outline" />
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Department
          </label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Job Title
          </label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Timezone
          </label>
          <select
            value={formData.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">London (GMT)</option>
            <option value="Asia/Tokyo">Tokyo (JST)</option>
          </select>
        </div>
      </div>

      {isEditing && (
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-success text-success-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-90 transition-smooth disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-6 py-2 bg-muted text-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-80 transition-smooth disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoSection;