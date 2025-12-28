import { useState } from "react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  value: {
    startDate?: string;
    endDate?: string;
  };
  onChange: (range: { startDate?: string; endDate?: string }) => void;
}

const presetRanges = [
  {
    label: "Today",
    getValue: () => ({
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Last 7 days",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 6)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Last 30 days",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 29)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Last 90 days",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 89)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "All time",
    getValue: () => ({
      from: undefined,
      to: undefined,
    }),
  },
];

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    value.startDate && value.endDate
      ? {
          from: new Date(value.startDate),
          to: new Date(value.endDate),
        }
      : undefined
  );

  const handlePresetClick = (preset: typeof presetRanges[0]) => {
    const range = preset.getValue();
    setSelectedRange(range);
    
    if (range.from && range.to) {
      onChange({
        startDate: range.from.toISOString(),
        endDate: range.to.toISOString(),
      });
    } else {
      onChange({});
    }
    
    setIsOpen(false);
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    setSelectedRange(range);
    
    if (range?.from && range?.to) {
      onChange({
        startDate: startOfDay(range.from).toISOString(),
        endDate: endOfDay(range.to).toISOString(),
      });
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setSelectedRange(undefined);
    onChange({});
    setIsOpen(false);
  };

  const formatDateRange = () => {
    if (!value.startDate || !value.endDate) {
      return "All time";
    }

    const start = new Date(value.startDate);
    const end = new Date(value.endDate);

    // Check if it matches a preset
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    if (
      format(start, "yyyy-MM-dd") === format(todayStart, "yyyy-MM-dd") &&
      format(end, "yyyy-MM-dd") === format(todayEnd, "yyyy-MM-dd")
    ) {
      return "Today";
    }

    const last7Start = startOfDay(subDays(today, 6));
    if (
      format(start, "yyyy-MM-dd") === format(last7Start, "yyyy-MM-dd") &&
      format(end, "yyyy-MM-dd") === format(todayEnd, "yyyy-MM-dd")
    ) {
      return "Last 7 days";
    }

    const last30Start = startOfDay(subDays(today, 29));
    if (
      format(start, "yyyy-MM-dd") === format(last30Start, "yyyy-MM-dd") &&
      format(end, "yyyy-MM-dd") === format(todayEnd, "yyyy-MM-dd")
    ) {
      return "Last 30 days";
    }

    const last90Start = startOfDay(subDays(today, 89));
    if (
      format(start, "yyyy-MM-dd") === format(last90Start, "yyyy-MM-dd") &&
      format(end, "yyyy-MM-dd") === format(todayEnd, "yyyy-MM-dd")
    ) {
      return "Last 90 days";
    }

    // Custom range
    return `${format(start, "MMM d, yyyy")} - ${format(end, "MMM d, yyyy")}`;
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !value.startDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex">
            {/* Preset ranges */}
            <div className="border-r p-3 space-y-1">
              <div className="text-sm font-semibold text-gray-700 mb-2">
                Quick Select
              </div>
              {presetRanges.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm"
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            {/* Calendar */}
            <div className="p-3">
              <DayPicker
                mode="range"
                selected={selectedRange}
                onSelect={handleRangeSelect}
                numberOfMonths={2}
                disabled={{ after: new Date() }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {(value.startDate || value.endDate) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="h-9 px-2"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
