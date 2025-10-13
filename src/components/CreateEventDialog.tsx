import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DatePicker } from '@/components/ui/date-picker';
import { TypeSelector } from '@/components/ui/type-selector';
import { TimeInput } from '@/components/ui/time-input';
import { AlertMessage } from '@/components/ui/alert-message';

type FormData = {
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  type?: string;
  repeatType?: string;
  repeatCount?: number;
};

const API = 'https://viserix.com/events.php';

interface CreateEventDialogProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

const eventTemplates = [
  {
    value: "vereinsabend",
    label: "Vereinsabend",
    template: {
      title: "Vereinsabend",
      time: "18:30",
      location: "Vereinsheim",
      description: "Regelmäßiger Vereinsabend mit freiem Spiel",
      type: "training"
    }
  },
  {
    value: "jugendtraining",
    label: "Jugendtraining",
    template: {
      title: "Jugendtraining",
      time: "17:00",
      location: "Vereinsheim",
      description: "Wöchentliches Jugendtraining",
      type: "training"
    }
  },
  {
    value: "jahreshauptversammlung",
    label: "Jahreshauptversammlung",
    template: {
      title: "Jahreshauptversammlung",
      time: "17:00",
      location: "Vereinsheim",
      description: "Jahreshauptversammlung",
      type: "meeting"
    }
  }
];

const repeatOptions = [
  { value: "none", label: "Keine Wiederholung" },
  { value: "daily", label: "Täglich" },
  { value: "weekly", label: "Wöchentlich" },
  { value: "monthly", label: "Monatlich" },
  { value: "monthly_date", label: "Jeden Monat am gleichen Tag" },
  { value: "yearly", label: "Jährlich" }
];

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({ onSuccess, onClose }) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>({
    defaultValues: {
      repeatType: "none"
    }
  });
  const [templateOpen, setTemplateOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [repeatOpen, setRepeatOpen] = useState(false);
  const [selectedRepeat, setSelectedRepeat] = useState<string>("none");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedType, setSelectedType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const watchTitle = watch("title");
  const watchRepeatType = watch("repeatType");
  const watchRepeatCount = watch("repeatCount");
  const showRepeatCount = watchRepeatType && watchRepeatType !== "none";
  const [alertDialog, setAlertDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    variant: 'success' | 'error' | 'info';
  }>({
    open: false,
    title: '',
    description: '',
    variant: 'info'
  });

  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const showAlert = (title: string, description: string, variant: 'success' | 'error' | 'info' = 'info') => {
    setAlertDialog({
      open: true,
      title,
      description,
      variant
    });
  };

  const isFormValid = () => {
    const hasTitle = watchTitle && watchTitle.trim().length > 0;
    const hasDate = selectedDate !== undefined;
    const hasValidRepeatCount = !showRepeatCount || (watchRepeatCount && watchRepeatCount > 0);
    
    return hasTitle && hasDate && hasValidRepeatCount;
  };

  const resetForm = () => {
    reset({
      repeatType: "none"
    });
    setSelectedTemplate("");
    setSelectedRepeat("none");
    setSelectedDate(undefined);
    setSelectedType("");
  };

  const handleTemplateSelect = (templateValue: string) => {
    const template = eventTemplates.find(t => t.value === templateValue);
    if (template) {
      setValue('title', template.template.title);
      setValue('time', template.template.time);
      setValue('location', template.template.location);
      setValue('description', template.template.description);
      setValue('type', template.template.type);
      setSelectedTemplate(templateValue);
      setSelectedType(template.template.type);
    }
    setTemplateOpen(false);
  };

  const handleRepeatSelect = (repeatValue: string) => {
    setValue('repeatType', repeatValue);
    setSelectedRepeat(repeatValue);
    if (repeatValue === "none") {
      setValue('repeatCount', undefined);
    }
    setRepeatOpen(false);
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setValue('date', formatDateForAPI(date));
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setValue('type', type);
  };

  const onSubmit = async (data: FormData) => {
    if (!isFormValid()) {
      showAlert('Fehler', 'Bitte füllen Sie alle erforderlichen Felder aus', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const eventDate = selectedDate ? formatDateForAPI(selectedDate) : data.date;
      
      if (!eventDate) {
        showAlert('Fehler', 'Bitte wählen Sie ein Datum aus', 'error');
        return;
      }

      const eventsToCreate = [];
      const baseEvent = {
        title: data.title,
        date: eventDate,
        time: data.time,
        location: data.location,
        description: data.description,
        type: selectedType || data.type
      };

      if (!data.repeatType || data.repeatType === "none") {
        eventsToCreate.push(baseEvent);
      } else {
        const repeatCount = data.repeatCount || 1;
        const startDate = new Date(eventDate);
        
        for (let i = 0; i < repeatCount; i++) {
          const eventDate = new Date(startDate);
          
          switch (data.repeatType) {
            case "daily":
              eventDate.setDate(startDate.getDate() + i);
              break;
            case "weekly":
              eventDate.setDate(startDate.getDate() + (i * 7));
              break;
            case "monthly":
              eventDate.setMonth(startDate.getMonth() + i);
              break;
            case "monthly_date":
              eventDate.setMonth(startDate.getMonth() + i);
              break;
            case "yearly":
              eventDate.setFullYear(startDate.getFullYear() + i);
              break;
          }
          
          eventsToCreate.push({
            ...baseEvent,
            date: formatDateForAPI(eventDate)
          });
        }
      }

      for (const event of eventsToCreate) {
        const res = await fetch(`${API}?action=create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        });
        
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error || res.statusText);
        }
      }
      
      showAlert('Erfolg', `${eventsToCreate.length} Ereignis(se) erfolgreich erstellt`, 'success');
      
      resetForm();
      
      if (onSuccess) onSuccess();
      
      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
      
    } catch (err) {
      showAlert('Fehler', 'Fehler: ' + (err instanceof Error ? err.message : 'Netzwerkfehler'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Vorlage auswählen</Label>
        <Popover open={templateOpen} onOpenChange={setTemplateOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={templateOpen}
              className="w-full flex items-center justify-between px-3 py-2 border rounded bg-white text-left"
            >
              {selectedTemplate
                ? eventTemplates.find((t) => t.value === selectedTemplate)?.label
                : <span className="text-gray-400">Vorlage auswählen...</span>}
              <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandList>
                <CommandEmpty>Keine Vorlagen gefunden.</CommandEmpty>
                <CommandGroup>
                  {eventTemplates.map((template) => (
                    <CommandItem
                      key={template.value}
                      value={template.value}
                      onSelect={handleTemplateSelect}
                    >
                      {template.label}
                      <Check className={cn('ml-auto h-4 w-4', selectedTemplate === template.value ? 'opacity-100' : 'opacity-0')} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('repeatType')} />
        
        <div className="space-y-2">
          <Label htmlFor="title">Titel <span className="text-red-500">*</span></Label>
          <Input 
            id="title" 
            placeholder="Titel" 
            {...register('title')} 
            className={!watchTitle || watchTitle.trim().length === 0 ? 'border-red-300' : ''}
          />
        </div>
        
        <DatePicker
          id="date"
          label="Datum"
          value={selectedDate}
          onChange={handleDateChange}
          required
        />
        
        <div className="space-y-2">
          <Label htmlFor="time">Uhrzeit</Label>
          <TimeInput
            value={watch('time') || ''}
            onChange={(time) => setValue('time', time)}
            placeholder="Uhrzeit auswählen"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Ort</Label>
          <Input id="location" placeholder="Ort" {...register('location')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Beschreibung</Label>
          <Input id="description" placeholder="Beschreibung" {...register('description')} />
        </div>
        
        <TypeSelector
          id="type"
          value={selectedType}
          onChange={handleTypeChange}
        />
        
        <div className="space-y-2">
          <Label>Wiederholung</Label>
          <Popover open={repeatOpen} onOpenChange={setRepeatOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                role="combobox"
                aria-expanded={repeatOpen}
                className="w-full flex items-center justify-between px-3 py-2 border rounded bg-white text-left"
              >
                {selectedRepeat !== "none"
                  ? repeatOptions.find((r) => r.value === selectedRepeat)?.label
                  : <span className="text-gray-400">Wiederholung auswählen...</span>}
                <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandList>
                  <CommandEmpty>Keine Optionen gefunden.</CommandEmpty>
                  <CommandGroup>
                    {repeatOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={handleRepeatSelect}
                      >
                        {option.label}
                        <Check className={cn('ml-auto h-4 w-4', selectedRepeat === option.value ? 'opacity-100' : 'opacity-0')} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {showRepeatCount && (
          <>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Wiederholung:</strong> Es werden mehrere Ereignisse basierend auf dem gewählten Datum erstellt.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="repeatCount">Anzahl Wiederholungen</Label>
              <Input 
                id="repeatCount" 
                type="number" 
                min="1" 
                max="50"
                placeholder="Anzahl" 
                {...register('repeatCount', { valueAsNumber: true })} 
              />
            </div>
          </>
        )}
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={!isFormValid() || isSubmitting}
        >
          {isSubmitting ? (
            'Wird erstellt...'
          ) : (
            showRepeatCount ? 'Ereignisse erstellen' : 'Erstellen'
          )}
        </Button>
      </form>
      
      {/* Alert Dialog */}
      <AlertMessage
        open={alertDialog.open}
        onOpenChange={(open) => setAlertDialog(prev => ({ ...prev, open }))}
        title={alertDialog.title}
        description={alertDialog.description}
        variant={alertDialog.variant}
      />
    </div>
  );
};

export default CreateEventDialog;