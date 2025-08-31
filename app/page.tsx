'use client';

import { useState, useEffect } from 'react';
import { useAppData } from '@/hooks/storage/useAppData';
import { PinAuth } from '@/components/auth/PinAuth';
import { Navigation } from '@/components/dashboard/Navigation';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { CycleTracker } from '@/components/cycle/CycleTracker';
import { GiftManager } from '@/components/gifts/GiftManager';
import { ImportantDates } from '@/components/dates/ImportantDates';
import { Settings } from '@/components/settings/Settings';
import '@/lib/i18n';

export default function Home() {
  const [data, setData] = useAppData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Apply theme on load
    document.documentElement.className = data.settings.theme;
  }, [data.settings.theme]);

  if (!isAuthenticated) {
    return (
      <PinAuth
        correctPin={data.settings.pin}
        onSuccess={() => setIsAuthenticated(true)}
      />
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={data} onUpdateData={setData} />;
      case 'cycle':
        return <CycleTracker data={data} onUpdateData={setData} />;
      case 'gifts':
        return <GiftManager data={data} onUpdateData={setData} />;
      case 'dates':
        return <ImportantDates data={data} onUpdateData={setData} />;
      case 'settings':
        return <Settings data={data} onUpdateData={setData} />;
      default:
        return <Dashboard data={data} onUpdateData={setData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6 max-w-md">
        {renderActiveTab()}
      </main>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
