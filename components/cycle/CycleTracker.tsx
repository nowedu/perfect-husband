'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Save, Smile, Meh, Frown, Star, ChevronRight } from 'lucide-react';
import { AppData, CycleSuggestion } from '@/hooks/storage/useAppData';
import { format, differenceInDays, addDays } from 'date-fns';

interface CycleTrackerProps {
  data: AppData;
  onUpdateData: (data: AppData) => void;
}

export function CycleTracker({ data, onUpdateData }: CycleTrackerProps) {
  const { t } = useTranslation();
  const [newPeriodDate, setNewPeriodDate] = useState('');
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);

  const today = new Date();
  const nextPeriod = new Date(data.cycle.nextPeriodDate);
  const daysUntilPeriod = differenceInDays(nextPeriod, today);
  const cycleProgress = ((data.cycle.averageCycle - daysUntilPeriod) / data.cycle.averageCycle) * 100;

  const isPMSTime = daysUntilPeriod <= 5 && daysUntilPeriod > 0;
  const isMenstrualTime = daysUntilPeriod <= 0 && daysUntilPeriod >= -5;

  const getCurrentPhase = () => {
    const dayInCycle = data.cycle.averageCycle - daysUntilPeriod;
    
    if (dayInCycle <= 5) return 'menstrual';
    if (dayInCycle <= 13) return 'follicular';
    if (dayInCycle <= 15) return 'ovulation';
    return 'luteal';
  };

  const getMoodIcon = () => {
    if (isMenstrualTime) return <Frown className="w-5 h-5 text-red-500" />;
    if (isPMSTime) return <Meh className="w-5 h-5 text-orange-500" />;
    return <Smile className="w-5 h-5 text-green-500" />;
  };

  const getMoodText = () => {
    if (isMenstrualTime) return t('cycle.mood.menstrual');
    if (isPMSTime) return t('cycle.mood.pms');
    return t('cycle.mood.good');
  };

  const getCycleSuggestions = () => {
    const currentPhase = getCurrentPhase();
    const phaseType = isPMSTime ? 'pms' : currentPhase;
    
    const suggestions = {
      menstrual: [
        "Przygotuj ciepłą herbatę z imbirem i miodem",
        "Zaproponuj ciepłą kąpiel z solą epsom",
        "Kup jej ulubione przekąski bez pytania",
        "Przygotuj ciepły okład na brzuch",
        "Zaproponuj masaż pleców lub stóp"
      ],
      pms: [
        "Bądź szczególnie cierpliwy i wyrozumiały",
        "Przygotuj jej ulubione jedzenie",
        "Zaproponuj spokojny wieczór z filmem",
        "Kup kwiaty bez szczególnej okazji",
        "Zrób coś miłego bez proszenia"
      ],
      follicular: [
        "Zaplanuj aktywną randkę na świeżym powietrzu",
        "Zaproponuj nową aktywność do wypróbowania",
        "Wspieraj jej nowe pomysły i projekty",
        "Zaplanuj romantyczny wieczór",
        "Porozmawiaj o przyszłych planach"
      ],
      ovulation: [
        "To dobry czas na romantyczne gesty",
        "Zaplanuj szczególną randkę",
        "Bądź szczególnie czuły i uwagliwy",
        "Pokaż jak bardzo ją kochasz",
        "Zaproponuj wspólny czas tylko we dwoje"
      ],
      luteal: [
        "Bądź gotowy na wsparcie emocjonalne",
        "Przygotuj zdrowe przekąski",
        "Zaproponuj relaksujące aktywności",
        "Bądź cierpliwy jeśli jest zmęczona",
        "Pomóż w codziennych obowiązkach"
      ]
    };

    return suggestions[phaseType] || suggestions.follicular;
  };

  const currentSuggestions = getCycleSuggestions();
  const suggestion1 = currentSuggestions[currentSuggestionIndex % currentSuggestions.length];
  const suggestion2 = currentSuggestions[(currentSuggestionIndex + 1) % currentSuggestions.length];

  const getNextSuggestions = () => {
    setCurrentSuggestionIndex((prev) => (prev + 2) % currentSuggestions.length);
  };

  const rateSuggestion = (suggestionText: string, rating: number) => {
    const suggestionId = `cycle-${Date.now()}-${Math.random()}`;
    const currentPhase = getCurrentPhase();
    const phaseType = isPMSTime ? 'pms' : currentPhase;
    
    const newSuggestion: CycleSuggestion = {
      id: suggestionId,
      text: suggestionText,
      phase: phaseType,
      rating: rating,
      isFavorite: false
    };

    const updatedData = {
      ...data,
      cycleSuggestions: [...data.cycleSuggestions, newSuggestion]
    };

    onUpdateData(updatedData);
  };

  const addPeriodDate = () => {
    if (!newPeriodDate) return;

    const updatedPeriods = [...data.cycle.lastPeriods, newPeriodDate]
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .slice(0, 12);

    let newAverage = data.cycle.averageCycle;
    if (updatedPeriods.length >= 2) {
      const cycles = [];
      for (let i = 0; i < updatedPeriods.length - 1; i++) {
        const diff = differenceInDays(new Date(updatedPeriods[i]), new Date(updatedPeriods[i + 1]));
        cycles.push(diff);
      }
      newAverage = Math.round(cycles.reduce((sum, cycle) => sum + cycle, 0) / cycles.length);
    }

    const lastPeriod = new Date(updatedPeriods[0]);
    const nextPeriodDate = addDays(lastPeriod, newAverage);

    const updatedData = {
      ...data,
      cycle: {
        ...data.cycle,
        lastPeriods: updatedPeriods,
        averageCycle: newAverage,
        currentPhase: getCurrentPhase(),
        nextPeriodDate: nextPeriodDate.toISOString().split('T')[0]
      }
    };

    onUpdateData(updatedData);
    setNewPeriodDate('');
  };

  const phaseColors = {
    menstrual: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    follicular: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    ovulation: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    luteal: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
  };

  const StarRating = ({ onRate, suggestionText }: { onRate: (rating: number) => void, suggestionText: string }) => {
    const [hoveredRating, setHoveredRating] = useState(0);

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => rateSuggestion(suggestionText, star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`w-4 h-4 ${
                star <= hoveredRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-foreground">{t('cycle.title')}</h1>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-pink-500" />
            {t('cycle.currentPhase')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('cycle.nextPeriod')}</span>
              <span>{daysUntilPeriod} {t('cycle.daysUntil')}</span>
            </div>
            <Progress value={Math.max(0, cycleProgress)} className="h-3" />
          </div>

          <div className="flex justify-between items-center">
            <Badge className={phaseColors[getCurrentPhase()]}>
              {t(`cycle.phase.${getCurrentPhase()}`)}
            </Badge>
            <div className="flex items-center gap-2">
              {getMoodIcon()}
              <span className="text-sm text-muted-foreground">{getMoodText()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-pink-600">{data.cycle.averageCycle}</p>
              <p className="text-sm text-muted-foreground">{t('cycle.averageCycle')} ({t('cycle.days')})</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{daysUntilPeriod}</p>
              <p className="text-sm text-muted-foreground">{t('cycle.daysUntil')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cycle Support Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-blue-500" />
            {t('cycle.suggestions.title')}
          </CardTitle>
          <CardDescription>
            Sugestie jak możesz wesprzeć swoją partnerkę w tym okresie
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Suggestion 1 */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <p className="text-sm font-medium">{suggestion1}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{t('cycle.suggestions.rate')}</span>
              <StarRating onRate={(rating) => rateSuggestion(suggestion1, rating)} suggestionText={suggestion1} />
            </div>
          </div>

          {/* Suggestion 2 */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <p className="text-sm font-medium">{suggestion2}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{t('cycle.suggestions.rate')}</span>
              <StarRating onRate={(rating) => rateSuggestion(suggestion2, rating)} suggestionText={suggestion2} />
            </div>
          </div>

          <Button 
            onClick={getNextSuggestions}
            variant="outline" 
            className="w-full flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4" />
            {t('cycle.suggestions.next')}
          </Button>
        </CardContent>
      </Card>

      {/* Add New Period Date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-500" />
            {t('cycle.addDate')}
          </CardTitle>
          <CardDescription>
            Dodaj datę ostatniej miesiączki aby poprawić przewidywania
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="period-date">{t('cycle.lastPeriod')}</Label>
            <Input
              id="period-date"
              type="date"
              value={newPeriodDate}
              onChange={(e) => setNewPeriodDate(e.target.value)}
              max={format(today, 'yyyy-MM-dd')}
            />
          </div>
          <Button 
            onClick={addPeriodDate} 
            disabled={!newPeriodDate}
            className="w-full flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {t('common.save')}
          </Button>
        </CardContent>
      </Card>

      {/* Period History */}
      {data.cycle.lastPeriods.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historia cyklu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.cycle.lastPeriods.slice(0, 6).map((date, index) => (
                <div key={date} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                  <span className="text-sm text-muted-foreground">
                    Cykl #{data.cycle.lastPeriods.length - index}
                  </span>
                  <span className="font-medium">
                    {format(new Date(date), 'dd.MM.yyyy')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
