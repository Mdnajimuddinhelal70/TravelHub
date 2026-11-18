export interface IAiTripPlanInput {
  destination: string;
  days: number;
  budget: number;
  adults: number;
  children: number;
  interests?: string;
}

export interface IAiDayPlan {
  day: number;
  title: string;
  activities: string[];
  meals?: string[];
  accommodation?: string;
}

export interface IAiTripPlan {
  destination: string;
  duration: number;
  estimatedCost: number;
  days: IAiDayPlan[];
  tips: string[];
}
