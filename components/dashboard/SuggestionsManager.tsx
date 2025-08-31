'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Star, Heart } from 'lucide-react';
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(suggestion.id)}
                      className={`p-2 ${suggestion.isFavorite ? 'text-red-500' : 'text-muted-foreground'}`}
                    >
                      <Heart className={`w-4 h-4 ${suggestion.isFavorite ? 'fill-current' : ''}`} />
                    </Button>
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
