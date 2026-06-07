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
  answers?: {
    mindState?: string;
    tensionSource?: string;
    tomorrowFocus?: string;
    q1?: number;
    q2?: number;
    q3?: number;
    q4?: number;
    q5?: number;
    totalScore?: number;
    statusLabel?: string;
    focusTime?: number;
  };
}
