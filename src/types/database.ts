export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  village: string | null;
  district: string | null;
  state: string | null;
  farm_size: number | null;
  preferred_language: 'en' | 'ta' | null;
  created_at: string;
  updated_at: string;
}

export interface Crop {
  id: string;
  user_id: string;
  name: string;
  variety: string | null;
  field: string | null;
  area_acres: number | null;
  stage: string | null;
  health: number | null;
  planted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  date: string;
  category: string;
  description: string | null;
  field: string | null;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface WeatherLog {
  id: string;
  user_id: string;
  location: string | null;
  temp: number | null;
  humidity: number | null;
  rainfall: number | null;
  wind_speed: number | null;
  logged_at: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  detail: string | null;
  type: 'weather' | 'crop' | 'expense' | 'ai' | 'harvest';
  read: boolean;
  created_at: string;
}

export interface Recommendation {
  id: string;
  user_id: string;
  state: string | null;
  district: string | null;
  soil_type: string | null;
  season: string | null;
  land_size: number | null;
  water_availability: string | null;
  previous_crop: string | null;
  recommended_crop: string;
  expected_yield: string | null;
  profit_estimate: number | null;
  required_water: string | null;
  fertilizer_advice: string | null;
  created_at: string;
}

export interface ChatHistory {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}
