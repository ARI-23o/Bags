import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useSettings();
  const config = settings.announcementBar;

  if (!config || !config.isEnabled || !config.text) return null;

  return (
    <div className="bg-brand-primary text-brand-white py-2 px-4 text-center text-xs tracking-editorial font-medium uppercase border-b border-brand-charcoal">
      {config.link ? (
        <Link to={config.link} className="hover:text-brand-beige transition-colors inline-block">
          {config.text}
        </Link>
      ) : (
        <span>{config.text}</span>
      )}
    </div>
  );
};
