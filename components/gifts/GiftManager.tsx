'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Heart, Save } from 'lucide-react';
import { AppData } from '@/hooks/storage/useAppData';

interface GiftManagerProps {
  data: AppData;
  onUpdateData: (data: AppData) => void;
}

export function GiftManager({ data, onUpdateData }: GiftManagerProps) {
  const { t } = useTranslation();
  const [generatedIdea, setGeneratedIdea] = useState<string>('');

  const generateGiftIdea = () => {
    const selectedPreferences = Object.entries(data.giftPreferences)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => key);

    if (selectedPreferences.length === 0) {
      setGeneratedIdea(t('gifts.noPreferences'));
      return;
    }

    const giftIdeas = {
      flowers: [
        'Bukiet jej ulubionych kwiatów',
        'Pojedyncza róża z miłą notką',
        'Kwiaty doniczkowe, które będą długo cieszyć',
        'Bukiet sezonowych kwiatów'
      ],
      alcohol: [
        'Butelka jej ulubionego wina',
        'Zestaw do degustacji whisky',
        'Koktajl przygotowany specjalnie dla niej',
        'Szampan na szczególną okazję'
      ],
      books: [
        'Książka jej ulubionego autora',
        'Bestseller z jej ulubionego gatunku',
        'Pięknie wydana klasyka literatury',
        'Audiobook do słuchania w podróży'
      ],
      places: [
        'Bilet do teatru lub na koncert',
        'Weekend w spa',
        'Wycieczka do nowego miasta',
        'Kolacja w jej ulubionej restauracji'
      ],
      clothes: [
        'Elegancka bluzka w jej stylu',
        'Przytulny sweter na zimę',
        'Piękna sukienka na specjalne okazje',
        'Wygodne ubrania do domu'
      ],
      jewelry: [
        'Delikatny naszyjnik',
        'Eleganckie kolczyki',
        'Bransoletka z grawerem',
        'Pierścionek z jej ulubionym kamieniem'
      ],
      cosmetics: [
        'Zestaw kosmetyków jej ulubionej marki',
        'Luksusowy krem do twarzy',
        'Zestaw do pielęgnacji paznokci',
        'Perfumy o jej ulubionym zapachu'
      ],
      hobbies: [
        'Akcesoria do jej hobby',
        'Kurs online w jej dziedzinie zainteresowań',
        'Narzędzia do jej ulubionej aktywności',
        'Książka o jej pasji'
      ],
      sports: [
        'Nowy strój sportowy',
        'Akcesoria do jej ulubionego sportu',
        'Karnet na siłownię lub zajęcia fitness',
        'Butelka na wodę z personalizacją'
      ],
      music: [
        'Płyta jej ulubionego wykonawcy',
        'Słuchawki wysokiej jakości',
        'Bilet na koncert',
        'Instrument muzyczny, o którym marzy'
      ],
      movies: [
        'Kolekcja filmów jej ulubionego gatunku',
        'Bilet do kina na premierę',
        'Domowy wieczór filmowy z przekąskami',
        'Gadżety z jej ulubionego filmu'
      ],
      food: [
        'Zestaw egzotycznych przypraw',
        'Kurs gotowania',
        'Kolacja w nowej restauracji',
        'Zestaw do pieczenia ciast'
      ],
      travel: [
        'Przewodnik po miejscu, które chce odwiedzić',
        'Stylowa walizka podróżna',
        'Weekend w nowym miejscu',
        'Zestaw podróżny z kosmetykami'
      ],
      technology: [
        'Nowy gadżet, który ułatwi jej życie',
        'Akcesoria do telefonu',
        'Inteligentny zegarek',
        'Głośnik bezprzewodowy'
      ],
      art: [
        'Obraz jej ulubionego artysty',
        'Zestaw do malowania',
        'Bilet do galerii sztuki',
        'Piękny album o sztuce'
      ]
    };

    const randomPreference = selectedPreferences[Math.floor(Math.random() * selectedPreferences.length)];
    const ideas = giftIdeas[randomPreference as keyof typeof giftIdeas];
    const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
    
    setGeneratedIdea(randomIdea);
  };

  const updatePreference = (preference: keyof typeof data.giftPreferences, checked: boolean) => {
    const updatedData = {
      ...data,
      giftPreferences: {
        ...data.giftPreferences,
        [preference]: checked
      }
    };
    onUpdateData(updatedData);
  };

  const selectedCount = Object.values(data.giftPreferences).filter(Boolean).length;

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-foreground">{t('gifts.title')}</h1>
      </div>

      {/* AI Gift Suggestion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Generator pomysłów AI
          </CardTitle>
          <CardDescription>
            Wygeneruj spersonalizowany pomysł na prezent na podstawie jej preferencji
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {generatedIdea && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium text-sm">{generatedIdea}</p>
            </div>
          )}
          <Button onClick={generateGiftIdea} className="w-full flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            {t('gifts.generateIdea')}
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
            Wybierz jej zainteresowania, aby otrzymać lepsze sugestie prezentów
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t('gifts.categories')}</span>
            <Badge variant="outline">{selectedCount} wybranych</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(data.giftPreferences).map(([key, checked]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={checked}
                  onCheckedChange={(checked) => updatePreference(key as keyof typeof data.giftPreferences, !!checked)}
                />
                <label
                  htmlFor={key}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t(`gifts.${key}`)}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Wskazówki dotyczące prezentów</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Im więcej preferencji wybierzesz, tym lepsze będą sugestie AI</li>
            <li>• Zwróć uwagę na jej aktualny nastrój i ostatnie rozmowy</li>
            <li>• Małe, przemyślane gesty często znaczą więcej niż drogie prezenty</li>
            <li>• Zwracaj uwagę na rzeczy, które wspomina, że chce lub potrzebuje</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
