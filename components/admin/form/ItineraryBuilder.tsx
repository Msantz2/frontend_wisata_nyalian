'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import type { ItineraryItem } from '@/lib/modules/packages/schema';

interface ItineraryBuilderProps {
  value: ItineraryItem[];
  onChange: (value: ItineraryItem[]) => void;
}

interface TimelineActivity {
  time: string;
  activity: string;
}

export function ItineraryBuilder({ value, onChange }: ItineraryBuilderProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(value.length > 0 ? 1 : null);
  const [timelineMode, setTimelineMode] = useState<number | null>(null);

  const handleAddDay = () => {
    const newDay: ItineraryItem = {
      day: value.length + 1,
      title: '',
      description: '',
      activities: [],
      meals: [],
      accommodation: '',
    };
    onChange([...value, newDay]);
    setExpandedDay(newDay.day);
  };

  const handleRemoveDay = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    const reNumbered = updated.map((item, i) => ({ ...item, day: i + 1 }));
    onChange(reNumbered);
  };

  const handleUpdateDay = (index: number, field: keyof ItineraryItem, fieldValue: any) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: fieldValue };
    onChange(updated);
  };

  const toggleExpand = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const parseTimelineActivities = (description: string): TimelineActivity[] => {
    const lines = description.split('\n').filter(line => line.trim());
    const activities: TimelineActivity[] = [];
    
    for (let i = 0; i < lines.length; i += 2) {
      const timeLine = lines[i]?.trim() || '';
      const activityLine = lines[i + 1]?.trim() || '';
      
      if (timeLine && activityLine) {
        activities.push({
          time: timeLine,
          activity: activityLine
        });
      }
    }
    
    return activities;
  };

  const formatTimelineActivities = (activities: TimelineActivity[]): string => {
    return activities
      .map(a => `${a.time}\n${a.activity}`)
      .join('\n\n');
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">Itinerary (Hari per Hari)</label>
        <Button type="button" onClick={handleAddDay} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />
          Tambah Hari
        </Button>
      </div>

      {value.length === 0 ? (
        <p className="text-sm text-muted-foreground border border-dashed rounded-md p-4 text-center">
          Belum ada itinerary. Klik &quot;Tambah Hari&quot; untuk memulai.
        </p>
      ) : (
        <div className="space-y-2">
          {value.map((item, index) => (
            <Card key={item.day} className="p-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleExpand(item.day)}
                  className="flex items-center gap-2 flex-1 text-left"
                >
                  {expandedDay === item.day ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  <span className="font-medium">
                    Hari {item.day}
                    {item.title && `: ${item.title}`}
                  </span>
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDay(index)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>

              {/* Expanded Content */}
              {expandedDay === item.day && (
                <div className="mt-3 space-y-3 pl-6">
                  <div>
                    <label className="text-xs font-medium">Judul Hari *</label>
                    <Input
                      value={item.title}
                      onChange={(e) => handleUpdateDay(index, 'title', e.target.value)}
                      placeholder="e.g., Arrival & Welcome Ceremony"
                    />
                  </div>

                   <div>
                     <div className="flex items-center justify-between mb-2">
                       <label className="text-xs font-medium">Timeline Aktivitas *</label>
                       <button
                         type="button"
                         onClick={() => setTimelineMode(timelineMode === item.day ? null : item.day)}
                         className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                       >
                         <Clock className="w-3 h-3" />
                         {timelineMode === item.day ? 'Tutup Editor' : 'Edit Timeline'}
                       </button>
                     </div>
                     
                     {timelineMode === item.day ? (
                       <div className="space-y-2 bg-slate-50 p-3 rounded border">
                         <p className="text-xs text-muted-foreground">
                           Format: Jam pada baris pertama, aktivitas pada baris kedua. Pisahkan setiap kegiatan dengan baris kosong.
                         </p>
                         <Textarea
                           value={item.description}
                           onChange={(e) => handleUpdateDay(index, 'description', e.target.value)}
                           placeholder="07:00&#10;Bertemu di area parkir & Welcome Drink&#10;&#10;07:10&#10;Orientasi singkat tentang etika melukat&#10;&#10;07:20&#10;Turun tangga batu ke kompleks mandi"
                           rows={8}
                           className="font-mono text-sm"
                         />
                         <p className="text-xs text-muted-foreground">
                           Preview:
                         </p>
                         <div className="bg-white p-2 rounded border text-sm space-y-1 max-h-48 overflow-y-auto">
                           {item.description.split('\n').filter(line => line.trim()).map((line, i) => (
                             <div key={i} className={i % 2 === 0 ? 'font-bold text-blue-600' : 'text-gray-700'}>
                               {line}
                             </div>
                           ))}
                         </div>
                       </div>
                     ) : (
                       <div className="bg-slate-50 p-3 rounded border space-y-2 text-sm max-h-48 overflow-y-auto">
                         {item.description ? (
                           item.description.split('\n').filter(line => line.trim()).map((line, i) => (
                             <div key={i} className={i % 2 === 0 ? 'font-bold text-blue-600' : 'text-gray-700'}>
                               {line}
                             </div>
                           ))
                         ) : (
                           <p className="text-muted-foreground text-xs italic">Belum ada aktivitas</p>
                         )}
                       </div>
                     )}
                   </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
