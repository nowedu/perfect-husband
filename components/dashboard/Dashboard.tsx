'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Sparkles, Smile, Meh, Frown, Star, Eye } from 'lucide-react';
import { AppData, DailySuggestion } from '@/hooks/storage/useAppData';
import { differenceInDays } from 'date-fns';
import { SuggestionsManager } from './SuggestionsManager';

interface DashboardProps {
  data: AppData;
  onUpdateData: (data: AppData) => void;
}

export function Dashboard({ data, onUpdateData }: DashboardProps) {
  const { t } = useTranslation();
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  const today = new Date();
  const nextPeriod = new Date(data.cycle.nextPeriodDate);
  const daysUntilPeriod = differenceInDays(nextPeriod, today);
  const cycleProgress = ((data.cycle.averageCycle - daysUntilPeriod) / data.cycle.averageCycle) * 100;

  const isPMSTime = daysUntilPeriod <= 5 && daysUntilPeriod > 0;
  const isMenstrualTime = daysUntilPeriod <= 0 && daysUntilPeriod >= -5;

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

  const getSuggestionsForLanguage = (language: string) => {
    const suggestions = {
      pl: [
        "Przygotuj jej ulubioną herbatę bez pytania",
        "Napisz słodką wiadomość na karteczce i zostaw w jej torebce",
        "Zaproponuj wspólny spacer o zachodzie słońca",
        "Kup jej ulubione kwiaty w drodze do domu",
        "Przygotuj kolację bez szczególnej okazji",
        "Zaproponuj masaż pleców po ciężkim dniu",
        "Zaplanuj spontaniczną randkę w weekend",
        "Powiedz jej trzy rzeczy, które w niej kochasz",
        "Przygotuj jej ulubione śniadanie w łóżku",
        "Zaproponuj wspólne oglądanie jej ulubionego filmu",
        "Kup jej coś małego, co przypomni ci o niej",
        "Zaproponuj wspólne gotowanie nowego przepisu",
        "Napisz list z powodami, dla których ją kochasz",
        "Zaplanuj niespodzianką wyjście do jej ulubionej restauracji",
        "Przygotuj romantyczną kąpiel ze świecami"
      ],
      en: [
        "Prepare her favorite tea without asking",
        "Write a sweet note and leave it in her bag",
        "Suggest a sunset walk together",
        "Buy her favorite flowers on your way home",
        "Cook dinner without any special occasion",
        "Offer a back massage after a hard day",
        "Plan a spontaneous weekend date",
        "Tell her three things you love about her",
        "Make her favorite breakfast in bed",
        "Suggest watching her favorite movie together",
        "Buy her something small that reminds you of her",
        "Suggest cooking a new recipe together",
        "Write a letter with reasons why you love her",
        "Plan a surprise visit to her favorite restaurant",
        "Prepare a romantic bath with candles"
      ]
    };
    
    return suggestions[language as keyof typeof suggestions] || suggestions.en;
  };

  const generateNewSuggestion = () => {
    const suggestions = getSuggestionsForLanguage(data.settings.language);
    const usedSuggestions = data.dailySuggestions.map(s => s.text);
    const availableSuggestions = suggestions.filter(s => !usedSuggestions.includes(s));
    
    let selectedSuggestion;
    if (availableSuggestions.length > 0) {
      selectedSuggestion = availableSuggestions[Math.floor(Math.random() * availableSuggestions.length)];
    } else {
      selectedSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    }

    const newSuggestion: DailySuggestion = {
      id: `daily-${Date.now()}-${Math.random()}`,
      text: selectedSuggestion,
      date: today.toISOString().split('T')[0],
      category: 'daily'
    };

    const updatedData = {
      ...data,
      dailySuggestions: [newSuggestion, ...data.dailySuggestions.slice(0, 49)] // Keep last 50
    };

    onUpdateData(updatedData);
  };

  const rateSuggestion = (suggestionId: string, rating: number) => {
    const updatedSuggestions = data.dailySuggestions.map(suggestion =>
      suggestion.id === suggestionId
        ? { ...suggestion, rating }
        : suggestion
    );

    const updatedData = {
      ...data,
      dailySuggestions: updatedSuggestions
    };

    onUpdateData(updatedData);
  };

  const toggleFavorite = (suggestionId: string) => {
    const updatedSuggestions = data.dailySuggestions.map(suggestion =>
      suggestion.id === suggestionId
        ? { ...suggestion, isFavorite: !suggestion.isFavorite }
        : suggestion
    );

    const updatedData = {
      ...data,
      dailySuggestions: updatedSuggestions
    };

    onUpdateData(updatedData);
  };

  const todaysSuggestion = data.dailySuggestions.find(s => s.date === today.toISOString().split('T')[0]) || 
                          data.dailySuggestions[0];

  const StarRating = ({ suggestion }: { suggestion: DailySuggestion }) => {
    const [hoveredRating, setHoveredRating] = useState(0);

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => rateSuggestion(suggestion.id, star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`w-4 h-4 ${
                star <= (hoveredRating || suggestion.rating || 0)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (showAllSuggestions) {
    return (
      <SuggestionsManager
        data={data}
        onUpdateData={onUpdateData}
        onBack={() => setShowAllSuggestions(false)}
      />
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-foreground">{t('app.title')}</h1>
        <p className="text-muted-foreground">{t('app.subtitle')}</p>
      </div>

      {/* Cycle Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-pink-500" />
            {t('cycle.title')}
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
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              {t('cycle.phase.follicular')}
            </Badge>
            <div className="flex items-center gap-2">
              {getMoodIcon()}
              <span className="text-sm text-muted-foreground">{getMoodText()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Suggestion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            {t('daily.title')}
          </CardTitle>
          <CardDescription>
            Dzisiejsza sugestia jak być lepszym partnerem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {todaysSuggestion ? (
            <div className="space-y-4">
              <p className="text-sm font-medium leading-relaxed">
                {todaysSuggestion.text}
              </p>
              
              {todaysSuggestion.rating && (
                <Badge variant="secondary" className="text-xs">
                  {todaysSuggestion.rating === 5 ? 'Doskonała' : 
                   todaysSuggestion.rating >= 4 ? 'Bardzo dobra' :
                   todaysSuggestion.rating >= 3 ? 'Dobra' :
                   todaysSuggestion.rating >= 2 ? 'Słaba' : 'Bardzo słaba'}
                </Badge>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{t('daily.rate')}</span>
                <StarRating suggestion={todaysSuggestion} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Brak sugestii na dziś. Wygeneruj nową!
            </p>
          )}

          <div className="flex gap-2">
            <Button onClick={generateNewSuggestion} className="flex-1">
              {t('daily.newSuggestion')}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowAllSuggestions(true)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {t('daily.viewAll')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
