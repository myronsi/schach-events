import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TypeSelector } from '@/components/ui/type-selector';
import { TimeInput } from '@/components/ui/time-input';

type FormData = {
  title: string;
  time?: string;
  location?: string;
  description?: string;
  type?: string;
};

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  type?: string;
}

const API = 'https://viserix.com/events.php';

interface EditEventDialogProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

const EditEventDialog: React.FC<EditEventDialogProps> = ({ onSuccess, onClose }) => {
  const { register, handleSubmit, setValue, watch } = useForm<FormData>();
  const [response, setResponse] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [titleOpen, setTitleOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetch(`${API}?action=list`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
        }
      } catch (err) {
        console.error('Fehler beim Laden der Ereignisse:', err);
      }
    };
    loadEvents();
  }, []);

  const handleTitleSelect = (title: string) => {
    setValue('title', title);
    setSelectedTitle(title);
    setShowEditForm(true);
    setTitleOpen(false);
    
    const existingEvent = events.find(event => event.title === title);
    if (existingEvent) {
      setValue('time', existingEvent.time || '');
      setValue('location', existingEvent.location || '');
      setValue('description', existingEvent.description || '');
      setValue('type', existingEvent.type || '');
      setSelectedType(existingEvent.type || '');
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setValue('type', type);
    setHasChanges(true);
  };

  const onSubmit = async (data: FormData) => {
    if (!hasChanges) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const updates: any = {};
      if (data.time) updates.time = data.time;
      if (data.location) updates.location = data.location;
      if (data.description) updates.description = data.description;
      if (selectedType) updates.type = selectedType;

      const res = await fetch(`${API}?action=editByTitle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: data.title,
          updates: updates
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setResponse(result);
        setStatus('success');
        
        if (onSuccess) onSuccess();
        
        setTimeout(() => {
          if (onClose) onClose();
        }, 1500);
        
      } else {
        setStatus('error');
        setResponse(result);
      }
    } catch (err) {
      setStatus('error');
      setResponse({ error: 'Netzwerkfehler' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const uniqueTitles = [...new Set(events.map(event => event.title))];

  return (
    <div className="space-y-4">
      <div>
        <Label>Ereignis Titel auswählen <span className="text-red-500">*</span></Label>
        <Popover open={titleOpen} onOpenChange={setTitleOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={titleOpen}
              aria-required={true}
              className="w-full flex items-center justify-between px-3 py-2 border rounded bg-white text-left"
            >
              {selectedTitle || <span className="text-gray-400">Klicken Sie um Titel auszuwählen...</span>}
              <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandList>
                <CommandEmpty>Keine Ereignisse gefunden.</CommandEmpty>
                <CommandGroup>
                  {uniqueTitles.map((title) => (
                    <CommandItem
                      key={title}
                      value={title}
                      onSelect={() => handleTitleSelect(title)}
                    >
                      {title}
                      <Check className={cn('ml-auto h-4 w-4', selectedTitle === title ? 'opacity-100' : 'opacity-0')} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input type="hidden" {...register('title')} />
        
        {showEditForm && (
          <>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Hinweis:</strong> Änderungen werden auf alle zukünftigen Ereignisse mit dem Titel "{selectedTitle}" angewendet.
                Leere Felder werden nicht geändert.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Uhrzeit</Label>
              <TimeInput
                value={watch('time') || ''}
                onChange={(time) => {
                  setValue('time', time);
                  setHasChanges(true);
                }}
                placeholder="Uhrzeit auswählen"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ort</Label>
              <Input 
                id="location" 
                placeholder="Ort" 
                {...register('location')}
                onChange={(e) => {
                  setValue('location', e.target.value);
                  setHasChanges(true);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Input 
                id="description" 
                placeholder="Beschreibung" 
                {...register('description')}
                onChange={(e) => {
                  setValue('description', e.target.value);
                  setHasChanges(true);
                }}
              />
            </div>
            
            <TypeSelector
              id="type"
              value={selectedType}
              onChange={handleTypeChange}
            />
          </>
        )}
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={!selectedTitle || !hasChanges || isSubmitting}
        >
          {isSubmitting ? (
            'Wird gespeichert...'
          ) : (
            showEditForm ? 'Alle zukünftigen Ereignisse aktualisieren' : 'Ereignisse bearbeiten'
          )}
        </Button>
      </form>

      {status === 'success' && response && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 font-semibold">Ereignisse gefunden und bearbeitet:</p>
          <p className="mt-2 text-sm text-green-700">
            {response.message || 'Ereignisse wurden erfolgreich bearbeitet'}
          </p>
        </div>
      )}

      {status === 'error' && response && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 font-semibold">Fehler:</p>
          <p className="text-sm text-red-700">{response.error}</p>
        </div>
      )}
    </div>
  );
};

export default EditEventDialog;