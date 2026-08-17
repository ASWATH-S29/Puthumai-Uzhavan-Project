// Shared API types for the Puthumai Uzhavan backend integration.
// These mirror the existing dummy-data shapes so the UI can switch
// from local mock data to live API responses without changes.

/* ----------------------------- Auth ----------------------------- */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  farmLocation?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  plan: string;
  location: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

/* --------------------------- Dashboard -------------------------- */

export interface WeatherDay {
  day: string;
  tempHi: number;
  tempLo: number;
  icon: 'sun' | 'cloud' | 'rain' | 'partly';
  condition: string;
  humidity?: number;
  wind?: number;
  rainProbability?: number;
}

export interface WeatherToday {
  temp: number;
  feelsLike: number;
  icon: 'sun' | 'cloud' | 'rain' | 'partly';
  condition: string;
  humidity: number;
  wind: number;
  uv?: number;
  rainfall: number;
  sunset: string;
  sunrise?: string;
  rainProbability?: number;
  pressure?: number;
  visibility?: number;
  windDirection?: string;
}

export interface WeatherData {
  location: string;
  today: WeatherToday;
  forecast: WeatherDay[];
  source?: 'openweather' | 'fallback';
}

export interface Task {
  id: string;
  title: string;
  due: string;
  priority: 'high' | 'medium' | 'low';
  done: boolean;
  field: string;
}

export interface FieldOverview {
  name: string;
  crop: string;
  area: string;
  health: number;
  stage: string;
  color: string;
}

export interface CropStatus {
  name: string;
  variety: string;
  field: string;
  stage: string;
  health: number;
  daysToHarvest: number;
  area: string;
  color: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  type: 'weather' | 'crop' | 'expense' | 'ai';
}

export interface FinanceSummary {
  expectedRevenue: number;
  revenueLastMonth: number;
  totalExpenses: number;
  expensesLastMonth: number;
  expectedProfit: number;
  profitMargin: number;
  profitPerAcre: number;
}

export interface Kpis {
  activeFields: number;
  totalAcreage: number;
  openTasks: number;
  avgHealth: number;
}

export interface FarmerProfile {
  name: string;
  initials: string;
  plan: string;
  location: string;
  memberSince: string;
  totalAcreage: number;
  activeFields: number;
  seasonsCompleted: number;
  rating: number;
  verified: boolean;
}

export interface TrendPoint {
  month: string;
  revenue: number;
  cost: number;
}

export interface YieldTrendPoint {
  month: string;
  actual: number | null;
  predicted: number;
}

export interface DashboardResponse {
  farmerProfile: FarmerProfile;
  kpis: Kpis;
  finance: FinanceSummary;
  weather: WeatherData;
  fields: FieldOverview[];
  cropStatus: CropStatus[];
  tasks: Task[];
  notifications: NotificationItem[];
  profitTrend: TrendPoint[];
  yieldTrend: YieldTrendPoint[];
}

/* ------------------------ Crop Recommendation ------------------- */

export interface CropRecommendRequest {
  soilType: string;
  pH: number;
  rainfall: number;
  location: string;
  season: string;
  district?: string;
  temperature?: number;
  farmArea?: number;
  previousCrop?: string;
  waterAvailability?: string;
  userId?: string;
}

export interface CropRecommendation {
  crop: string;
  variety: string;
  confidence: number;
  expectedYield: string;
  expectedRevenue: number;
  expectedProfit: number;
  marketDemand: 'High' | 'Medium' | 'Low';
  waterRequirement: 'Low' | 'Medium' | 'High';
  growingDuration: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  reason: string;
  color: string;
  best?: boolean;
  benefits?: string[];
  disadvantages?: string[];
  growingSteps?: string[];
  fertilizer?: string;
  irrigation?: string;
  harvestTime?: string;
  marketPrice?: string;
}

export interface CropRecommendResponse {
  recommendations: CropRecommendation[];
}

export interface RecommendationHistoryRow {
  id: string;
  user_id: string;
  state?: string | null;
  district?: string | null;
  soil_type?: string | null;
  season?: string | null;
  land_size?: number | null;
  water_availability?: string | null;
  previous_crop?: string | null;
  recommended_crop: string;
  expected_yield?: string | null;
  profit_estimate?: number | null;
  required_water?: string | null;
  fertilizer_advice?: string | null;
  created_at?: string;
}

/* ----------------------------- Expenses ------------------------- */

export interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
  date: string;
}

export interface ExpenseRow {
  id: string;
  date: string;
  category: string;
  description: string;
  field: string;
  amount: number;
  user_id?: string;
  farm_id?: string | null;
  notes?: string;
  created_at?: string;
  farm_name?: string;
}

export interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
}

export interface ExpensesResponse {
  rows: ExpenseRow[];
  total: number;
  byCategory: ExpenseCategory[];
}

export interface AddExpenseRequest {
  date: string;
  category: string;
  field?: string;
  description?: string;
  amount: number;
  user_id?: string;
  farm_id?: string | null;
  notes?: string;
}

export interface AddExpenseResponse {
  expense: ExpenseRow;
  total: number;
}

/* ------------------------------ Chat ---------------------------- */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  reply: ChatMessage;
}

/* ----------------------------- Scanner -------------------------- */

export interface ScannerRequest {
  field: string;
  crop: string;
  imageData: string;
}

export interface ScanResult {
  crop: string;
  field: string;
  date: string;
  disease: string | null;
  confidence: number;
  severity: 'None' | 'Low' | 'Moderate' | 'High';
  treatment: string;
  status: 'Healthy' | 'Action needed';
}
export interface ScanAnalysis {
  disease: string | null;
  diseaseConfidence: number;
  nutrientDeficiency: string;
  nutrientConfidence: number;
  waterStress: 'None' | 'Low' | 'Moderate' | 'High';
  waterConfidence: number;
  pestRisk: 'None' | 'Low' | 'Moderate' | 'High';
  pestConfidence: number;
  recommendation: string;
  overallConfidence: number;
}

export interface ScannerResponse {
  result: ScanResult;
  analysis?: ScanAnalysis;
}

export interface CropScanHistoryRow extends ScanResult {
  id: string;
  user_id: string;
  created_at?: string;
}

/* ----------------------------- Farms ---------------------------- */

export interface FarmRecord {
  id: string;
  owner_id?: string;
  name: string;
  location: string;
  crop: string;
  area: number;
  health: number;
  status: string;
  description?: string;
  soil_type?: string;
  village?: string;
  district?: string;
  irrigation_type?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FarmCreatePayload {
  owner_id?: string;
  name: string;
  location: string;
  crop: string;
  area: number;
  health: number;
  status: string;
  description?: string;
  soil_type?: string;
  village?: string;
  district?: string;
  irrigation_type?: string;
  notes?: string;
}

export type FarmUpdatePayload = Partial<FarmCreatePayload>;

/* ------------------------------ Yield --------------------------- */

export interface YieldRequest {
  field: string;
  crop: string;
  area: string;
}

export interface YieldField {
  field: string;
  crop: string;
  area: string;
  predicted: number;
  lastSeason: number;
  confidence: number;
  unit: string;
}

export interface YieldResponse {
  fields: YieldField[];
  trend: YieldTrendPoint[];
}

/* ------------------------------ Report -------------------------- */

export interface SeasonSummary {
  season: string;
  period: string;
  totalRevenue: number;
  totalCost: number;
  netProfit: number;
  profitChange: number;
  yieldTotal: number;
  yieldUnit: string;
  waterSaved: number;
  topCrop: string;
}

export interface SeasonCrop {
  crop: string;
  area: string;
  revenue: number;
  cost: number;
  yield: number;
  rating: string;
}

export interface ReportResponse {
  summary: SeasonSummary;
  crops: SeasonCrop[];
  profitTrend: TrendPoint[];
}
