import * as React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TimeInputProps {
  value?: string;
  onChange: (time: string) => void;
  placeholder?: string;
  className?: string;
}

export function TimeInput({ value, onChange, placeholder = "Zeit auswählen", className }: TimeInputProps) {
  const [open, setOpen] = React.useState(false);
  const [hours, setHours] = React.useState("12");
  const [minutes, setMinutes] = React.useState("00");
  const hoursRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      if (h && m) {
        setHours(h);
        setMinutes(m);
      }
    }
  }, [value]);

  React.useEffect(() => {
    if (open && hoursRef.current) {
      hoursRef.current.focus();
    }
  }, [open]);

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    const timeString = `${newHours}:${newMinutes}`;
    onChange(timeString);
    setOpen(false);
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => 
    String(i).padStart(2, '0')
  );

  const minuteOptions = ['00', '15', '30', '45'];

  const displayValue = value || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-4"
        align="start"
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
      >
        <div className="space-y-4">
          <div className="text-sm font-medium">Zeit auswählen</div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">Stunden</label>
              <div
                className="grid grid-cols-3 gap-1 h-32 overflow-y-auto"
                onWheel={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
                tabIndex={0}
                ref={hoursRef}
              >
                {hourOptions.map((hour) => (
                  <Button
                    key={hour}
                    variant={hours === hour ? "default" : "outline"}
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setHours(hour)}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">Minuten</label>
              <div
                className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto"
                onWheel={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
                tabIndex={0}
              >
                {minuteOptions.map((minute) => (
                  <Button
                    key={minute}
                    variant={minutes === minute ? "default" : "outline"}
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setMinutes(minute)}
                  >
                    {minute}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => handleTimeChange(hours, minutes)}
              className="flex-1"
              size="sm"
            >
              Auswählen
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              size="sm"
            >
              Abbrechen
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}