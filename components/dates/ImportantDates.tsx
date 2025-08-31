'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Save, Trash2, Heart } from 'lucide-react';
import { AppData, ImportantDate } from '@/hooks/storage/useAppData';
import { format, differenceInDays } from 'date-fns';

interface ImportantDatesProps {
  data: AppData;
  onUpdateData: (data: AppData) => void;
}

export function ImportantDates({ data, onUpdateData }: ImportantDatesProps) {
  const { t } = useTranslation();
  const [newDate, setNewDate] = useState({
    name: '',
    date: '',
    type: 'custom' as ImportantDate['type']
  });

  const today = new Date();

  const addDate = () => {
    if (!newDate.name || !newDate.date) return;

    const newImportantDate: ImportantDate = {
      id: Date.now().toString(),
      name: newDate.name,
      date: newDate.date,
      type: newDate.type
    };

    const updatedData = {
      ...data,
      importantDates: [...data.importantDates, newImportantDate]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    };

    onUpdateData(updatedData);
    setNewDate({ name: '', date: '', type: 'custom' });
  };

  const deleteDate = (id: string) => {
    const updatedData = {
      ...data,
      importantDates: data.importantDates.filter(date => date.id !== id)
    };
    onUpdateData(updatedData);
  };

  const upcomingDates = data.importantDates
    .filter(date => new Date(date.date) >= today)
    .slice(0, 5);

  const pastDates = data.importantDates
    .filter(date => new Date(date.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getDateTypeColor = (type: ImportantDate['type']) => {
    const colors = {
      birthday: 'bg-yellow-100 text-yellow-800',
      anniversary: 'bg-red-100 text-red-800',
      firstKiss: 'bg-pink-100 text-pink-800',
      firstDance: 'bg-purple-100 text-purple-800',
      firstDate: 'bg-blue-100 text-blue-800',
      custom: 'bg-gray-100 text-gray-800'
    };
    return colors[type];
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-gray-900">{t('dates.title')}</h1>
      </div>

      {/* Add New Date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-500" />
            {t('dates.addDate')}
          </CardTitle>
          <CardDescription>
            Add important dates to never forget special moments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date-name">Date Name</Label>
            <Input
              id="date-name"
              value={newDate.name}
              onChange={(e) => setNewDate({ ...newDate, name: e.target.value })}
              placeholder="e.g., Sarah's Birthday"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-type">Type</Label>
            <Select value={newDate.type} onValueChange={(value: ImportantDate['type']) => setNewDate({ ...newDate, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="birthday">{t('dates.birthday')}</SelectItem>
                <SelectItem value="anniversary">{t('dates.anniversary')}</SelectItem>
                <SelectItem value="firstKiss">{t('dates.firstKiss')}</SelectItem>
                <SelectItem value="firstDance">{t('dates.firstDance')}</SelectItem>
                <SelectItem value="firstDate">{t('dates.firstDate')}</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-value">Date</Label>
            <Input
              id="date-value"
              type="date"
              value={newDate.date}
              onChange={(e) => setNewDate({ ...newDate, date: e.target.value })}
            />
          </div>

          <Button 
            onClick={addDate} 
            disabled={!newDate.name || !newDate.date}
            className="w-full flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {t('common.save')}
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Dates */}
      {upcomingDates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              {t('dates.upcoming')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDates.map((date) => {
                const daysUntil = differenceInDays(new Date(date.date), today);
                return (
                  <div key={date.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{date.name}</h3>
                        <Badge className={getDateTypeColor(date.type)}>
                          {date.type === 'custom' ? 'Custom' : t(`dates.${date.type}`)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {format(new Date(date.date), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={daysUntil <= 7 ? "destructive" : "secondary"}>
                        {daysUntil === 0 ? 'Today!' : `${daysUntil} days`}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteDate(date.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Dates */}
      {pastDates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Memory Lane
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastDates.map((date) => {
                const daysAgo = differenceInDays(today, new Date(date.date));
                return (
                  <div key={date.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-700">{date.name}</h3>
                        <Badge variant="outline" className={getDateTypeColor(date.type)}>
                          {date.type === 'custom' ? 'Custom' : t(`dates.${date.type}`)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {format(new Date(date.date), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {daysAgo} days ago
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteDate(date.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {data.importantDates.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No important dates added yet.</p>
            <p className="text-sm text-gray-500 mt-2">
              Start by adding your partner's birthday or your anniversary!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
