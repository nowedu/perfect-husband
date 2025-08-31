'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings as SettingsIcon, Lock, Globe, Palette, Save } from 'lucide-react';
import { AppData } from '@/hooks/storage/useAppData';

interface SettingsProps {
  data: AppData;
  onUpdateData: (data: AppData) => void;
}

export function Settings({ data, onUpdateData }: SettingsProps) {
  const { t, i18n } = useTranslation();
  const [pinForm, setPinForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'pl', name: 'Polski' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' },
    { code: 'tw', name: '繁體中文' }
  ];

  const themes = [
    { value: 'light', label: t('settings.light') },
    { value: 'dark', label: t('settings.dark') },
    { value: 'colorblind', label: t('settings.colorblind') }
  ];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    const updatedData = {
      ...data,
      settings: {
        ...data.settings,
        language: languageCode
      }
    };
    onUpdateData(updatedData);
  };

  const changeTheme = (theme: 'light' | 'dark' | 'colorblind') => {
    const updatedData = {
      ...data,
      settings: {
        ...data.settings,
        theme
      }
    };
    onUpdateData(updatedData);

    // Apply theme to document
    document.documentElement.className = theme;
  };

  const changePin = () => {
    setPinError('');
    setPinSuccess(false);

    if (pinForm.current !== data.settings.pin) {
      setPinError('Current PIN is incorrect');
      return;
    }

    if (pinForm.new.length !== 4 || !/^\d{4}$/.test(pinForm.new)) {
      setPinError('New PIN must be 4 digits');
      return;
    }

    if (pinForm.new !== pinForm.confirm) {
      setPinError('PIN confirmation does not match');
      return;
    }

    const updatedData = {
      ...data,
      settings: {
        ...data.settings,
        pin: pinForm.new
      }
    };

    onUpdateData(updatedData);
    setPinForm({ current: '', new: '', confirm: '' });
    setPinSuccess(true);
    
    setTimeout(() => setPinSuccess(false), 3000);
  };

  const saveSettings = () => {
    // Settings are saved in real-time, this is just for UI feedback
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>
      </div>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            {t('settings.language')}
          </CardTitle>
          <CardDescription>
            Choose your preferred language
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={data.settings.language} onValueChange={changeLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={saveSettings} className="w-full flex items-center gap-2">
            <Save className="w-4 h-4" />
            {t('common.save')}
          </Button>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-500" />
            {t('settings.theme')}
          </CardTitle>
          <CardDescription>
            Choose your preferred color scheme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={data.settings.theme} onValueChange={changeTheme}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {themes.map((theme) => (
                <SelectItem key={theme.value} value={theme.value}>
                  {theme.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={saveSettings} className="w-full flex items-center gap-2">
            <Save className="w-4 h-4" />
            {t('common.save')}
          </Button>
        </CardContent>
      </Card>

      {/* PIN Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-500" />
            {t('settings.changePin')}
          </CardTitle>
          <CardDescription>
            Change your security PIN
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-pin">{t('settings.currentPin')}</Label>
            <Input
              id="current-pin"
              type="password"
              value={pinForm.current}
              onChange={(e) => setPinForm({ ...pinForm, current: e.target.value })}
              placeholder="••••"
              maxLength={4}
              className="text-center tracking-widest"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-pin">{t('settings.newPin')}</Label>
            <Input
              id="new-pin"
              type="password"
              value={pinForm.new}
              onChange={(e) => setPinForm({ ...pinForm, new: e.target.value })}
              placeholder="••••"
              maxLength={4}
              className="text-center tracking-widest"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-pin">{t('settings.confirmPin')}</Label>
            <Input
              id="confirm-pin"
              type="password"
              value={pinForm.confirm}
              onChange={(e) => setPinForm({ ...pinForm, confirm: e.target.value })}
              placeholder="••••"
              maxLength={4}
              className="text-center tracking-widest"
            />
          </div>

          {pinError && (
            <Alert variant="destructive">
              <AlertDescription>{pinError}</AlertDescription>
            </Alert>
          )}

          {pinSuccess && (
            <Alert>
              <AlertDescription>PIN changed successfully!</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={changePin}
            disabled={!pinForm.current || !pinForm.new || !pinForm.confirm}
            className="w-full flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {t('common.save')}
          </Button>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-gray-500" />
            App Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Current Language:</strong> {languages.find(l => l.code === data.settings.language)?.name}</p>
            <p><strong>Current Theme:</strong> {themes.find(t => t.value === data.settings.theme)?.label}</p>
            <p><strong>Data Storage:</strong> Encrypted Local Storage</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
