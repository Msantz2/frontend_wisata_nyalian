import type { ItineraryItem } from './schema';

interface TimelineActivity {
  time: string;
  activity: string;
}

export function parseTimelineActivities(description: string): TimelineActivity[] {
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
}

export function formatTimelineActivities(activities: TimelineActivity[]): string {
  return activities
    .map(a => `${a.time}\n${a.activity}`)
    .join('\n\n');
}

export function timelineFormatToDayBased(itineraryData: any): ItineraryItem[] {
  if (!itineraryData) return [];

  const isString = typeof itineraryData === 'string';
  const isArray = Array.isArray(itineraryData);

  if (!isString && !isArray) return [];

  const item: ItineraryItem = {
    day: 1,
    title: 'Full Day Itinerary',
    description: isString ? itineraryData : '',
    activities: [],
    meals: [],
    accommodation: '',
  };

  if (isArray) {
    try {
      if (itineraryData.length > 0 && typeof itineraryData[0] === 'object' && 'day' in itineraryData[0]) {
        return itineraryData;
      }

      const activities: TimelineActivity[] = [];
      for (const entry of itineraryData) {
        if (typeof entry === 'string') {
          const lines = entry.split('\n').filter((line: string) => line.trim());
          for (let i = 0; i < lines.length; i += 2) {
            const timeLine = lines[i]?.trim() || '';
            const activityLine = lines[i + 1]?.trim() || '';
            if (timeLine && activityLine) {
              activities.push({ time: timeLine, activity: activityLine });
            }
          }
        } else if (typeof entry === 'object' && entry !== null) {
          if ('time' in entry || 'waktu' in entry) {
            activities.push({
              time: entry.time || entry.waktu || '',
              activity: entry.activity || entry.aktivitas || '',
            });
          }
        }
      }

      if (activities.length > 0) {
        item.description = formatTimelineActivities(activities);
      }
    } catch (error) {
      console.warn('Failed to convert array itinerary:', error);
    }
  }

  return [item];
}

export function dayBasedToTimelineFormat(itineraryItems: ItineraryItem[]): string {
  if (!itineraryItems || itineraryItems.length === 0) return '';

  const allActivities: TimelineActivity[] = [];

  for (const item of itineraryItems) {
    if (item.description) {
      const activities = parseTimelineActivities(item.description);
      allActivities.push(...activities);
    }
  }

  if (allActivities.length === 0) return '';

  return formatTimelineActivities(allActivities);
}
