'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Gift, Sparkles, Save, Heart } from 'lucide-react';
import { AppData, GiftPreferences } from '@/hooks/storage/useAppData';

interface GiftManagerProps {
  data: AppData;
  onUpdateData: (data: AppData) => void;
}

export function GiftManager({ data, onUpdateData }: GiftManagerProps) {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIdea, setCurrentIdea] = useState('');

  const preferenceKeys = Object.keys(data.giftPreferences) as (keyof GiftPreferences)[];

  const updatePreference = (key: keyof GiftPreferences, value: boolean) => {
    const updatedData = {
      ...data,
      giftPreferences: {
        ...data.giftPreferences,
        [key]: value
      }
    };
    onUpdateData(updatedData);
  };

  const savePreferences = () => {
    // Preferences are already saved in real-time, this is just for UI feedback
    // In a real app, you might want to batch updates
  };

  const generateGiftIdea = async () => {
    setIsGenerating(true);
    
    // Get active preferences
    const activePreferences = preferenceKeys.filter(key => data.giftPreferences[key]);
    
    // Simulate AI API call
    const giftIdeas = {
      flowers: [
        "A bouquet of her favorite seasonal flowers",
        "A potted orchid that will bloom for months",
        "Dried flower arrangement for her workspace"
      ],
      books: [
        "The latest bestseller in her favorite genre",
        "A beautiful coffee table book about her interests",
        "A personalized book with both your names"
      ],
      jewelry: [
        "A delicate necklace with her birthstone",
        "Matching earrings in her favorite metal",
        "A charm bracelet with meaningful symbols"
      ],
      food: [
        "Homemade dinner featuring her favorite cuisine",
        "A selection of artisanal chocolates",
        "Cooking class for both of you to enjoy together"
      ],
      travel: [
        "Weekend getaway to a nearby city she's mentioned",
        "Surprise picnic in a beautiful location",
        "Plan a day trip to explore somewhere new together"
      ]
    };

    setTimeout(() => {
      let idea = "Consider what would make her smile today - maybe her favorite coffee or a heartfelt note.";
      
      if (activePreferences.length > 0) {
        const randomPreference = activePreferences[Math.floor(Math.random() * activePreferences.length)];
        const ideas = giftIdeas[randomPreference as keyof typeof giftIdeas];
        if (ideas) {
          idea = ideas[Math.floor(Math.random() * ideas.length)];
        }
      }
      
      setCurrentIdea(idea);
      setIsGenerating(false);
    }, 1500);
  };

  const activePreferencesCount = preferenceKeys.filter(key => data.giftPreferences[key]).length;

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-gray-900">{t('gifts.title')}</h1>
      </div>

      {/* Current Gift Idea */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Gift Suggestion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentIdea ? (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <p className="text-gray-800 leading-relaxed">{currentIdea}</p>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">
              Generate a personalized gift idea based on her preferences
            </p>
          )}
          
          <Button 
            onClick={generateGiftIdea} 
            disabled={isGenerating}
            className="w-full flex items-center gap-2"
          >
            <Gift className="w-4 h-4" />
            {isGenerating ? t('common.loading') : t('gifts.generateIdea')}
          </Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            {t('gifts.preferences')}
          </CardTitle>
          <CardDescription>
            Select her interests to get better gift suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">{t('gifts.categories')}</span>
            <Badge variant="secondary">
              {activePreferencesCount} selected
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {preferenceKeys.map((key) => (
              <div key={key} className="flex items-center space-x-2">
                <Switch
                  id={key}
                  checked={data.giftPreferences[key]}
                  onCheckedChange={(checked) => updatePreference(key, checked)}
                />
                <Label htmlFor={key} className="text-sm font-medium">
                  {t(`gifts.${key}`)}
                </Label>
              </div>
            ))}
          </div>

          <Button 
            onClick={savePreferences}
            className="w-full flex items-center gap-2 mt-6"
          >
            <Save className="w-4 h-4" />
            {t('common.save')}
          </Button>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Gift Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• The more preferences you select, the better the AI suggestions will be</p>
            <p>• Consider her current mood and recent conversations</p>
            <p>• Small, thoughtful gestures often mean more than expensive gifts</p>
            <p>• Pay attention to things she mentions wanting or needing</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
