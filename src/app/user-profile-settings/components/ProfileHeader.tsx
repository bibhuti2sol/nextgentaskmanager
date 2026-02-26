'use client';

import { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface ProfileHeaderProps {
  userName: string;
  userEmail: string;
  userRole: string;
  profileImage: string;
  profileImageAlt: string;
  onImageUpload: (file: File) => void;
}

const ProfileHeader = ({
  userName,
  userEmail,
  userRole,
  profileImage,
  profileImageAlt,
  onImageUpload,
}: ProfileHeaderProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isHydrated) return;
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
          <div className="flex-1">
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse mb-1" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6 shadow-elevation-1">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary">
            <AppImage
              src={profileImage}
              alt={profileImageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          {isHovering && (
            <label
              htmlFor="profile-upload"
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full cursor-pointer transition-smooth"
            >
              <Icon name="CameraIcon" size={32} variant="outline" className="text-white" />
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">{userName}</h1>
          <p className="text-sm font-caption text-muted-foreground mb-1">{userEmail}</p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary bg-opacity-10 rounded-full">
            <Icon name="ShieldCheckIcon" size={16} variant="solid" className="text-primary" />
            <span className="text-sm font-caption font-medium text-primary">{userRole}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-90 transition-smooth">
            Save Changes
          </button>
          <button className="px-4 py-2 bg-muted text-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-80 transition-smooth">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;