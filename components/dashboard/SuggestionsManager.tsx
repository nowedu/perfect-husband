'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Star, Heart, Trash2, Sparkles } from 'lucide-react';
import { AppData, DailySuggestion } from '@/hooks/storage/useAppData';

interface SuggestionsManagerProps {
  data: AppData;
  onUpdateData: (data: AppData) => void;
  onBack: () => void;
}

type FilterType = 'all' | 'topRated' | 'unrated' | 'lowRated' | 'favorites';

export function SuggestionsManager({ data, onUpdateData, onBack }: SuggestionsManagerProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

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
        "Przygotuj romantyczną kąpiel ze świecami",
        "Zrób jej zdjęcie, gdy się nie spodziewa",
        "Zaproponuj wspólny taniec w salonie",
        "Przygotuj jej ulubioną playlistę",
        "Zostaw miłą notatkę w jej samochodzie",
        "Zaproponuj wspólne oglądanie wschodu słońca",
        "Kup jej ulubione słodycze bez okazji",
        "Zaproponuj wspólne czytanie książki",
        "Przygotuj dla niej ciepłą kąpiel po pracy",
        "Zaplanuj piknik w parku",
        "Napisz wiersz tylko dla niej",
        "Zaproponuj wspólne uczenie się czegoś nowego",
        "Przygotuj jej niespodziankę na lunch",
        "Zostaw kwiaty na jej biurku",
        "Zaproponuj wspólne zwiedzanie nowego miejsca",
        "Przygotuj dla niej specjalną kolację przy świecach"
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
        "Prepare a romantic bath with candles",
        "Take her photo when she's not expecting it",
        "Suggest dancing together in the living room",
        "Create her favorite playlist",
        "Leave a sweet note in her car",
        "Suggest watching the sunrise together",
        "Buy her favorite sweets without occasion",
        "Suggest reading a book together",
        "Prepare a warm bath for her after work",
        "Plan a picnic in the park",
        "Write a poem just for her",
        "Suggest learning something new together",
        "Prepare a surprise lunch for her",
        "Leave flowers on her desk",
        "Suggest exploring a new place together",
        "Prepare a special candlelit dinner for her"
      ]
    };
    
    return suggestions[language as keyof typeof suggestions] || suggestions.en;
  };

  const generateNewSuggestions = () => {
    const allSuggestions = getSuggestionsForLanguage(data.settings.language);
    const usedSuggestions = data.dailySuggestions.map(s => s.text);
    const availableSuggestions = allSuggestions.filter(s => !usedSuggestions.includes(s));
    
    let suggestionsToAdd;
    if (availableSuggestions.length >= 10) {
      // Randomly select 10 from available
      const shuffled = [...availableSuggestions].sort(() => 0.5 - Math.random());
      suggestionsToAdd = shuffled.slice(0, 10);
    } else {
      // Take all available and fill the rest with random ones
      const remaining = 10 - availableSuggestions.length;
      const randomFromAll = [...allSuggestions].sort(() => 0.5 - Math.random()).slice(0, remaining);
      suggestionsToAdd = [...availableSuggestions, ...randomFromAll];
    }

    const today = new Date();
    const newSuggestions: DailySuggestion[] = suggestionsToAdd.map((text, index) => ({
      id: `generated-${Date.now()}-${index}`,
      text,
      date: today.toISOString().split('T')[0],
      category: 'generated'
    }));

    const updatedData = {
      ...data,
      dailySuggestions: [...newSuggestions, ...data.dailySuggestions]
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

  const deleteSuggestion = (suggestionId: string) => {
    const updatedSuggestions = data.dailySuggestions.filter(
      suggestion => suggestion.id !== suggestionId
    );

    const updatedData = {
      ...data,
      dailySuggestions: updatedSuggestions
    };

    onUpdateData(updatedData);
  };

  const getFilteredSuggestions = () => {
    let filtered = data.dailySuggestions;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(suggestion =>
        suggestion.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case 'topRated':
        filtered = filtered.filter(s => s.rating && s.rating >= 4);
        break;
      case 'unrated':
        filtered = filtered.filter(s => !s.rating);
        break;
      case 'lowRated':
        filtered = filtered.filter(s => s.rating && s.rating <= 2);
        break;
      case 'favorites':
        filtered = filtered.filter(s => s.isFavorite);
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => {
      // Sort favorites first, then by rating, then by date
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      if (a.rating && b.rating) return b.rating - a.rating;
      if (a.rating && !b.rating) return -1;
      if (!a.rating && b.rating) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  };

  const filteredSuggestions = getFilteredSuggestions();

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

  const getRatingText = (rating?: number) => {
    if (!rating) return '';
    switch (rating) {
      case 5: return 'Doskonała';
      case 4: return 'Bardzo dobra';
      case 3: return 'Dobra';
      case 2: return 'Słaba';
      case 1: return 'Bardzo słaba';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4 py-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{t('daily.suggestions.title')}</h1>
      </div>

      {/* Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Generator sugestii
          </CardTitle>
          <CardDescription>
            Wygeneruj 10 nowych sugestii do wypróbowania
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generateNewSuggestions} className="w-full flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Wygeneruj 10 nowych sugestii
          </Button>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('daily.suggestions.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {(['all', 'topRated', 'unrated', 'lowRated', 'favorites'] as FilterType[]).map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className="text-xs"
              >
                {t(`daily.suggestions.filter.${filter}`)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggestions List */}
      <div className="space-y-4">
        {filteredSuggestions.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">{t('daily.suggestions.noResults')}</p>
            </CardContent>
          </Card>
        ) : (
          filteredSuggestions.map((suggestion) => (
            <Card key={suggestion.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-medium leading-relaxed flex-1">
                      {suggestion.text}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(suggestion.id)}
                        className={`p-2 ${suggestion.isFavorite ? 'text-red-500' : 'text-muted-foreground'}`}
                      >
                        <Heart className={`w-4 h-4 ${suggestion.isFavorite ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSuggestion(suggestion.id)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {suggestion.rating && (
                        <Badge variant="secondary" className="text-xs">
                          {getRatingText(suggestion.rating)}
                        </Badge>
                      )}
                      {suggestion.isFavorite && (
                        <Badge variant="outline" className="text-xs text-red-500 border-red-200">
                          Ulubiona
                        </Badge>
                      )}
                    </div>
                    <StarRating suggestion={suggestion} />
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {new Date(suggestion.date).toLocaleDateString('pl-PL')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statystyki</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{data.dailySuggestions.length}</p>
              <p className="text-sm text-muted-foreground">Wszystkie sugestie</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {data.dailySuggestions.filter(s => s.isFavorite).length}
              </p>
              <p className="text-sm text-muted-foreground">Ulubione</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
