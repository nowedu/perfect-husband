'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Heart, Save, Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { AppData, PartnerNote } from '@/hooks/storage/useAppData';
import { format } from 'date-fns';

interface GiftManagerProps {
  data: AppData;
  onUpdateData: (data: AppData) => void;
}

export function GiftManager({ data, onUpdateData }: GiftManagerProps) {
  const { t } = useTranslation();
  const [generatedIdea, setGeneratedIdea] = useState<string>('');
  const [showAddNote, setShowAddNote] = useState(false);
  const [editingNote, setEditingNote] = useState<PartnerNote | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

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

  const addNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;

    const newNote: PartnerNote = {
      id: `note-${Date.now()}-${Math.random()}`,
      title: noteTitle.trim(),
      content: noteContent.trim(),
      dateAdded: new Date().toISOString(),
      category: 'wish'
    };

    const updatedData = {
      ...data,
      partnerNotes: [newNote, ...data.partnerNotes]
    };

    onUpdateData(updatedData);
    setNoteTitle('');
    setNoteContent('');
    setShowAddNote(false);
  };

  const updateNote = () => {
    if (!editingNote || !noteTitle.trim() || !noteContent.trim()) return;

    const updatedNotes = data.partnerNotes.map(note =>
      note.id === editingNote.id
        ? { ...note, title: noteTitle.trim(), content: noteContent.trim() }
        : note
    );

    const updatedData = {
      ...data,
      partnerNotes: updatedNotes
    };

    onUpdateData(updatedData);
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = data.partnerNotes.filter(note => note.id !== noteId);
    const updatedData = {
      ...data,
      partnerNotes: updatedNotes
    };
    onUpdateData(updatedData);
  };

  const startEditNote = (note: PartnerNote) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setShowAddNote(true);
  };

  const cancelNoteEdit = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
    setShowAddNote(false);
  };

  const selectedCount = Object.values(data.giftPreferences).filter(Boolean).length;

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-foreground">{t('gifts.title')}</h1>
      </div>

      {/* Partner Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Notatnik potrzeb partnerki
          </CardTitle>
          <CardDescription>
            Zapisuj rzeczy, które wspomina, że chce lub potrzebuje
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showAddNote && (
            <Button onClick={() => setShowAddNote(true)} className="w-full flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Dodaj nową notatkę
            </Button>
          )}

          {showAddNote && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="note-title">Tytuł notatki</Label>
                <Input
                  id="note-title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="np. Chce nową torebkę"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note-content">Treść notatki</Label>
                <Textarea
                  id="note-content"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Szczegóły, preferencje, kolory, marki..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={editingNote ? updateNote : addNote}
                  disabled={!noteTitle.trim() || !noteContent.trim()}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingNote ? 'Zaktualizuj' : 'Zapisz'}
                </Button>
                <Button variant="outline" onClick={cancelNoteEdit} className="flex-1">
                  Anuluj
                </Button>
              </div>
            </div>
          )}

          {data.partnerNotes.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Zapisane notatki ({data.partnerNotes.length})</h4>
              {data.partnerNotes.map((note) => (
                <div key={note.id} className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <h5 className="font-medium text-sm">{note.title}</h5>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditNote(note)}
                        className="p-1 h-auto"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNote(note.id)}
                        className="p-1 h-auto text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{note.content}</p>
                  <p className="text-xs text-muted-foreground">
                    Dodano: {format(new Date(note.dateAdded), 'dd.MM.yyyy HH:mm')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
            <li>• Sprawdzaj regularnie swoje notatki przed ważnymi okazjami</li>
            <li>• Małe, przemyślane gesty często znaczą więcej niż drogie prezenty</li>
            <li>• Zwracaj uwagę na rzeczy, które wspomina w rozmowach</li>
            <li>• Zapisuj szczegóły jak kolory, marki, rozmiary</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
