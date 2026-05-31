export interface Task {
  id: string;
  title: string;
  duration: number;
  timeLabel: string;
  completed: boolean;
  notes?: string;
  isSpecial?: boolean;
}

export interface TimelineItem {
  id: string;
  timeRange: string;
  title: string;
  completed: boolean;
  isFocusMode?: boolean;
  description?: string;
  imageUrl?: string;
  tags?: string[];
}

export interface ScanResult {
  energyValue: number; // 1 to 5
  stressIndex: number; // 0 to 100
  aiRecommendation?: string;
  wakeupTime?: string;
  peakHourRange?: string;
  applied?: boolean;
}
