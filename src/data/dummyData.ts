// Central dummy data for the Puthumai Uzhavan platform.
// All values are illustrative; no backend is connected.

export type Trend = 'up' | 'down' | 'flat';

export interface WeatherDay {
  day: string;
  tempHi: number;
  tempLo: number;
  icon: 'sun' | 'cloud' | 'rain' | 'partly';
  condition: string;
}

export interface Task {
  id: string;
  title: string;
  due: string;
  priority: 'high' | 'medium' | 'low';
  done: boolean;
  field: string;
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

export interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
  date: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  type: 'weather' | 'crop' | 'expense' | 'ai';
}

export interface Testimonial {
  name: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
  initials: string;
  accent: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Benefit {
  icon: string;
  stat: string;
  label: string;
  description: string;
}

export interface StepItem {
  step: string;
  title: string;
  description: string;
  icon: string;
}

export const weather = {
  location: 'Thanjavur, Tamil Nadu',
  today: {
    temp: 31,
    feelsLike: 35,
    icon: 'partly' as const,
    condition: 'Partly Cloudy',
    humidity: 68,
    wind: 14,
    uv: 7,
    rainfall: 12,
    sunset: '6:24 PM',
  },
  forecast: [
    { day: 'Mon', tempHi: 32, tempLo: 24, icon: 'sun' as const, condition: 'Sunny' },
    { day: 'Tue', tempHi: 30, tempLo: 23, icon: 'partly' as const, condition: 'Partly Cloudy' },
    { day: 'Wed', tempHi: 28, tempLo: 22, icon: 'rain' as const, condition: 'Light Rain' },
    { day: 'Thu', tempHi: 27, tempLo: 22, icon: 'rain' as const, condition: 'Showers' },
    { day: 'Fri', tempHi: 29, tempLo: 23, icon: 'cloud' as const, condition: 'Cloudy' },
  ],
};

export const tasks: Task[] = [
  { id: 't1', title: 'Irrigate Field A — Paddy', due: '07:00 AM', priority: 'high', done: false, field: 'Field A' },
  { id: 't2', title: 'Apply nitrogen fertilizer', due: '09:30 AM', priority: 'high', done: false, field: 'Field B' },
  { id: 't3', title: 'Scout for fall armyworm', due: '11:00 AM', priority: 'medium', done: true, field: 'Field C' },
  { id: 't4', title: 'Repair drip line, Field D', due: '02:00 PM', priority: 'medium', done: false, field: 'Field D' },
  { id: 't5', title: 'Harvest tomato batch 2', due: '04:30 PM', priority: 'low', done: false, field: 'Greenhouse 1' },
];

export const cropStatus: CropStatus[] = [
  { name: 'Paddy', variety: 'CR-1009', field: 'Field A', stage: 'Tillering', health: 92, daysToHarvest: 42, area: '3.2 acres', color: '#22c55e' },
  { name: 'Tomato', variety: 'PKM-1', field: 'Greenhouse 1', stage: 'Flowering', health: 86, daysToHarvest: 28, area: '0.8 acres', color: '#ef4444' },
  { name: 'Sugarcane', variety: 'Co-86032', field: 'Field B', stage: 'Grand Growth', health: 78, daysToHarvest: 120, area: '5.0 acres', color: '#0ea5e9' },
  { name: 'Banana', variety: 'Grand Nain', field: 'Field C', stage: 'Shooting', health: 81, daysToHarvest: 65, area: '2.1 acres', color: '#f59e0b' },
];

export const expenses: ExpenseItem[] = [
  { id: 'e1', category: 'Seeds & Saplings', amount: 12400, date: 'Aug 01' },
  { id: 'e2', category: 'Fertilizers', amount: 8600, date: 'Aug 03' },
  { id: 'e3', category: 'Labor', amount: 18500, date: 'Aug 05' },
  { id: 'e4', category: 'Equipment', amount: 6200, date: 'Aug 08' },
  { id: 'e5', category: 'Pesticides', amount: 4300, date: 'Aug 10' },
  { id: 'e6', category: 'Fuel', amount: 2800, date: 'Aug 12' },
];

export const expenseByCategory = [
  { name: 'Labor', value: 18500, color: '#16a34a' },
  { name: 'Seeds', value: 12400, color: '#22c55e' },
  { name: 'Fertilizer', value: 8600, color: '#4ade80' },
  { name: 'Equipment', value: 6200, color: '#0ea5e9' },
  { name: 'Pesticides', value: 4300, color: '#f59e0b' },
  { name: 'Fuel', value: 2800, color: '#94a3b8' },
];

export const yieldTrend = [
  { month: 'Mar', actual: 1820, predicted: 1900 },
  { month: 'Apr', actual: 2100, predicted: 2050 },
  { month: 'May', actual: 1980, predicted: 2010 },
  { month: 'Jun', actual: 2350, predicted: 2280 },
  { month: 'Jul', actual: 2480, predicted: 2420 },
  { month: 'Aug', actual: null, predicted: 2640 },
];

export const profitTrend = [
  { month: 'Mar', revenue: 84000, cost: 52000 },
  { month: 'Apr', revenue: 96000, cost: 58000 },
  { month: 'May', revenue: 88000, cost: 55000 },
  { month: 'Jun', revenue: 112000, cost: 61000 },
  { month: 'Jul', revenue: 124000, cost: 64000 },
  { month: 'Aug', revenue: 138000, cost: 69000 },
];

export const notifications: NotificationItem[] = [
  { id: 'n1', title: 'Rain alert', detail: 'Light showers expected Wednesday — delay fertilizer application.', time: '2h ago', type: 'weather' },
  { id: 'n2', title: 'AI recommendation', detail: 'Paddy Field A is ready for top-dressing nitrogen now.', time: '5h ago', type: 'ai' },
  { id: 'n3', title: 'Crop health flag', detail: 'Tomato leaves show early blight signs in Greenhouse 1.', time: '1d ago', type: 'crop' },
  { id: 'n4', title: 'Expense reminder', detail: 'Labor costs are 14% above your monthly budget.', time: '2d ago', type: 'expense' },
];

export const features: Feature[] = [
  {
    icon: 'Brain',
    title: 'AI Crop Recommendation',
    description: 'Get crop suggestions tuned to your soil, climate, and market demand — powered by machine learning models trained on regional data.',
  },
  {
    icon: 'CloudRain',
    title: 'Hyperlocal Weather',
    description: 'Field-level forecasts with rainfall, humidity, and UV so you irrigate and spray at exactly the right moment.',
  },
  {
    icon: 'Wallet',
    title: 'Smart Expense Tracker',
    description: 'Log every input cost and watch your margin per acre update automatically with category breakdowns.',
  },
  {
    icon: 'Leaf',
    title: 'Crop Health Monitoring',
    description: 'Photo-based pest and disease detection with instant treatment plans and dosage guidance.',
  },
  {
    icon: 'TrendingUp',
    title: 'Yield Prediction',
    description: 'Forecast harvest volumes weeks ahead using growth-stage analytics and historical yields.',
  },
  {
    icon: 'CalendarRange',
    title: 'Season Reports',
    description: 'Auto-generated end-of-season summaries with profit, loss, and lessons for next cycle.',
  },
];

export const benefits: Benefit[] = [
  { icon: 'TrendingUp', stat: '38%', label: 'Higher Profit', description: 'Members average 38% more profit per acre by acting on AI insights.' },
  { icon: 'Droplets', stat: '42%', label: 'Less Water', description: 'Precision irrigation guidance cuts water use by up to 42%.' },
  { icon: 'ShieldCheck', stat: '60%', label: 'Fewer Losses', description: 'Early pest alerts reduce crop losses by 60% on average.' },
  { icon: 'Clock', stat: '12 hrs', label: 'Saved Weekly', description: 'Automated task planning frees up to 12 hours every week.' },
];

export const steps: StepItem[] = [
  {
    step: '01',
    title: 'Set Up Your Farm',
    description: 'Add your fields, crops, and soil details. The platform builds a digital twin of your farm in minutes.',
    icon: 'MapPinned',
  },
  {
    step: '02',
    title: 'Connect Data Sources',
    description: 'Weather, soil sensors, and market prices sync automatically to keep recommendations fresh.',
    icon: 'SatelliteDish',
  },
  {
    step: '03',
    title: 'Act on AI Insights',
    description: 'Receive daily tasks, crop suggestions, and alerts — each with a clear, actionable next step.',
    icon: 'Sparkles',
  },
  {
    step: '04',
    title: 'Track & Grow',
    description: 'Monitor expenses, yields, and profit in real time and export polished season reports.',
    icon: 'LineChart',
  },
];

export const testimonials: Testimonial[] = [
  {
    name: 'Murugan R',
    role: 'Paddy Farmer',
    location: 'Thanjavur, TN',
    quote: 'The AI told me exactly when to top-dress nitrogen. My paddy yield jumped by almost a third this season.',
    rating: 5,
    initials: 'MR',
    accent: 'from-brand-500 to-brand-700',
  },
  {
    name: 'Lakshmi S',
    role: 'Horticulture Grower',
    location: 'Coimbatore, TN',
    quote: 'I caught early blight on my tomatoes two days before I ever saw it with my own eyes. Saved the whole greenhouse.',
    rating: 5,
    initials: 'LS',
    accent: 'from-accent-500 to-accent-700',
  },
  {
    name: 'Arjun K',
    role: 'Sugarcane Farmer',
    location: 'Tirunelveli, TN',
    quote: 'The expense tracker finally showed me where my margins were leaking. Now I know my profit per acre to the rupee.',
    rating: 5,
    initials: 'AK',
    accent: 'from-brand-600 to-accent-600',
  },
];

export const sidebarNav = [
  { label: 'Dashboard', icon: 'LayoutDashboard', path: '/app' },
  { label: 'Farm Profile', icon: 'MapPinned', path: '/app/farm-profile' },
  { label: 'Crop Recommendation', icon: 'Sprout', path: '/app/crop-recommendation' },
  { label: 'Expense Tracker', icon: 'Wallet', path: '/app/expenses' },
  { label: 'AI Farming Assistant', icon: 'Bot', path: '/app/ai-assistant' },
  { label: 'Crop Health Scanner', icon: 'Leaf', path: '/app/crop-health' },
  { label: 'Yield Prediction', icon: 'TrendingUp', path: '/app/yield-prediction' },
  { label: 'Season Report', icon: 'CalendarRange', path: '/app/season-report' },
  { label: 'Settings', icon: 'Settings', path: '/app/settings' },
  { label: 'Admin Panel', icon: 'ShieldCheck', path: '/app/admin' },
] as const;

export interface CropRecommendation {
  crop: string;
  variety: string;
  score: number;
  waterNeed: 'Low' | 'Medium' | 'High';
  growthDays: number;
  estProfitPerAcre: number;
  reason: string;
  marketDemand: 'High' | 'Medium' | 'Low';
  color: string;
}

export const cropRecommendations: CropRecommendation[] = [
  { crop: 'Paddy', variety: 'CR-1009', score: 94, waterNeed: 'High', growthDays: 120, estProfitPerAcre: 42000, reason: 'Matches your clay-loam soil and the monsoon rainfall forecast.', marketDemand: 'High', color: '#22c55e' },
  { crop: 'Black Gram', variety: 'ADT-5', score: 88, waterNeed: 'Low', growthDays: 75, estProfitPerAcre: 36000, reason: 'Short duration and fixes nitrogen — ideal rotation after paddy.', marketDemand: 'High', color: '#1f2937' },
  { crop: 'Maize', variety: 'CO-6', score: 82, waterNeed: 'Medium', growthDays: 95, estProfitPerAcre: 31000, reason: 'Strong cattle-feed market price in your district this quarter.', marketDemand: 'Medium', color: '#f59e0b' },
  { crop: 'Groundnut', variety: 'VRI-2', score: 77, waterNeed: 'Low', growthDays: 110, estProfitPerAcre: 28500, reason: 'Suits your well-irrigated plots; oil-seed demand trending up.', marketDemand: 'Medium', color: '#d97706' },
];

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

export const chatSeed: ChatMessage[] = [
  { id: 'c1', role: 'assistant', text: 'Vanakkam, Murugan! I see Field A (Paddy) is in the tillering stage. Would you like today’s nitrogen top-dressing recommendation?', time: '09:12' },
  { id: 'c2', role: 'user', text: 'Yes, and tell me the right dosage per acre.', time: '09:14' },
  { id: 'c3', role: 'assistant', text: 'Apply 30 kg urea per acre now, then irrigate lightly after 24 hours. Skip if rain exceeds 10 mm in the next 48 h — I’ll alert you.', time: '09:14' },
];

export const aiSuggestions = [
  { icon: 'Droplets', title: 'Delay irrigation — rain incoming', detail: 'Light showers (12 mm) expected Wed. Hold off on Field A irrigation to avoid waterlogging.', tag: 'Weather' },
  { icon: 'Sprout', title: 'Top-dress nitrogen, Field A', detail: 'Paddy is at tillering — 30 kg urea/acre now lifts yield potential ~8%.', tag: 'Crop' },
  { icon: 'ShieldCheck', title: 'Preventive spray, Greenhouse 1', detail: 'Early-blight risk on tomato. Copper oxychloride 3 g/L as a preventive foliar spray.', tag: 'Health' },
];

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

export const scanResults: ScanResult[] = [
  { crop: 'Paddy', field: 'Field A', date: 'Aug 12', disease: null, confidence: 96, severity: 'None', treatment: 'No action needed. Field is healthy.', status: 'Healthy' },
  { crop: 'Tomato', field: 'Greenhouse 1', date: 'Aug 11', disease: 'Early Blight', confidence: 88, severity: 'Low', treatment: 'Apply copper oxychloride 3 g/L; remove infected lower leaves.', status: 'Action needed' },
  { crop: 'Sugarcane', field: 'Field B', date: 'Aug 09', disease: 'Red Rot', confidence: 74, severity: 'Moderate', treatment: 'Remove affected stools; apply Trichoderma viride; improve drainage.', status: 'Action needed' },
  { crop: 'Banana', field: 'Field C', date: 'Aug 06', disease: null, confidence: 91, severity: 'None', treatment: 'Healthy. Continue current nutrition schedule.', status: 'Healthy' },
];

export const cropHealthTimeline = [
  { week: 'W1', paddy: 90, tomato: 92, sugarcane: 84, banana: 85 },
  { week: 'W2', paddy: 91, tomato: 90, sugarcane: 82, banana: 84 },
  { week: 'W3', paddy: 92, tomato: 88, sugarcane: 80, banana: 83 },
  { week: 'W4', paddy: 92, tomato: 86, sugarcane: 78, banana: 81 },
];

export interface YieldField {
  field: string;
  crop: string;
  area: string;
  predicted: number;
  lastSeason: number;
  confidence: number;
  unit: string;
}

export const yieldFields: YieldField[] = [
  { field: 'Field A', crop: 'Paddy', area: '3.2 ac', predicted: 2640, lastSeason: 2380, confidence: 92, unit: 'kg' },
  { field: 'Greenhouse 1', crop: 'Tomato', area: '0.8 ac', predicted: 1850, lastSeason: 1620, confidence: 86, unit: 'kg' },
  { field: 'Field B', crop: 'Sugarcane', area: '5.0 ac', predicted: 48, lastSeason: 44, confidence: 79, unit: 'ton' },
  { field: 'Field C', crop: 'Banana', area: '2.1 ac', predicted: 920, lastSeason: 850, confidence: 88, unit: 'bunch' },
];

export const seasonSummary = {
  season: 'Kharif 2026',
  period: 'Jun – Sep 2026',
  totalRevenue: 450000,
  totalCost: 248000,
  netProfit: 202000,
  profitChange: 28,
  yieldTotal: 10250,
  yieldUnit: 'kg',
  waterSaved: 42,
  topCrop: 'Paddy',
};

export const seasonCrops = [
  { crop: 'Paddy', area: '3.2 ac', revenue: 186000, cost: 98000, yield: 2640, rating: 'A' },
  { crop: 'Sugarcane', area: '5.0 ac', revenue: 152000, cost: 86000, yield: 48, rating: 'A-' },
  { crop: 'Banana', area: '2.1 ac', revenue: 74000, cost: 38000, yield: 920, rating: 'B+' },
  { crop: 'Tomato', area: '0.8 ac', revenue: 38000, cost: 26000, yield: 1850, rating: 'B' },
];

export interface FieldOverview {
  name: string;
  crop: string;
  area: string;
  health: number;
  stage: string;
  color: string;
}

export const fields: FieldOverview[] = [
  { name: 'Field A', crop: 'Paddy', area: '3.2 acres', health: 92, stage: 'Tillering', color: '#22c55e' },
  { name: 'Greenhouse 1', crop: 'Tomato', area: '0.8 acres', health: 86, stage: 'Flowering', color: '#ef4444' },
  { name: 'Field B', crop: 'Sugarcane', area: '5.0 acres', health: 78, stage: 'Grand Growth', color: '#0ea5e9' },
  { name: 'Field C', crop: 'Banana', area: '2.1 acres', health: 81, stage: 'Shooting', color: '#f59e0b' },
];

export const quickActions = [
  { icon: 'Sparkles', label: 'Get AI Advice', hint: 'Ask the assistant', accent: 'from-brand-500 to-brand-700', path: '/app/ai-assistant' },
  { icon: 'Camera', label: 'Scan Crop', hint: 'Detect disease', accent: 'from-accent-500 to-accent-700', path: '/app/crop-health' },
  { icon: 'Wallet', label: 'Log Expense', hint: 'Add a cost', accent: 'from-amber-500 to-amber-600', path: '/app/expenses' },
  { icon: 'CloudRain', label: 'Check Weather', hint: '7-day forecast', accent: 'from-sky-500 to-sky-700', path: '/app' },
  { icon: 'Bot', label: 'AI Assistant', hint: 'Chat now', accent: 'from-brand-600 to-accent-600', path: '/app/ai-assistant' },
  { icon: 'CalendarRange', label: 'New Report', hint: 'Season summary', accent: 'from-emerald-500 to-emerald-700', path: '/app/season-report' },
];

export interface SettingItem {
  icon: string;
  label: string;
  value: string;
  toggle?: boolean;
  on?: boolean;
}

export interface SettingGroup {
  title: string;
  items: SettingItem[];
}

export const settingsGroups: SettingGroup[] = [
  {
    title: 'Account',
    items: [
      { icon: 'User', label: 'Profile details', value: 'Murugan R · Pro Farmer' },
      { icon: 'Mail', label: 'Email', value: 'murugan@puthumai.farm' },
      { icon: 'MapPinned', label: 'Farm location', value: 'Thanjavur, Tamil Nadu' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: 'Bell', label: 'Push notifications', value: 'On', toggle: true, on: true },
      { icon: 'Droplets', label: 'Irrigation alerts', value: 'On', toggle: true, on: true },
      { icon: 'Globe', label: 'Language', value: 'தமிழ் / English' },
      { icon: 'Moon', label: 'Theme', value: 'Light', toggle: true, on: false },
    ],
  },
  {
    title: 'Billing',
    items: [
      { icon: 'CreditCard', label: 'Plan', value: 'Pro · ₹499/mo' },
      { icon: 'CalendarRange', label: 'Next renewal', value: 'Sep 01, 2026' },
    ],
  },
];

export interface ExpenseRow {
  id: string;
  date: string;
  category: string;
  description: string;
  field: string;
  amount: number;
}

export const expenseRows: ExpenseRow[] = [
  { id: 'x1', date: 'Aug 12', category: 'Fuel', description: 'Diesel for pump set', field: 'Field A', amount: 2800 },
  { id: 'x2', date: 'Aug 10', category: 'Pesticides', description: 'Copper oxychloride', field: 'Greenhouse 1', amount: 4300 },
  { id: 'x3', date: 'Aug 08', category: 'Equipment', description: 'Drip line repair', field: 'Field D', amount: 6200 },
  { id: 'x4', date: 'Aug 05', category: 'Labor', description: 'Weeding crew (6 ppl)', field: 'Field B', amount: 18500 },
  { id: 'x5', date: 'Aug 03', category: 'Fertilizers', description: 'Urea + DAP', field: 'Field A', amount: 8600 },
  { id: 'x6', date: 'Aug 01', category: 'Seeds & Saplings', description: 'CR-1009 paddy seed', field: 'Field A', amount: 12400 },
];

export const profit = {
  thisMonth: 69000,
  lastMonth: 60000,
  margin: 49.2,
  perAcre: 8625,
};

export const finance = {
  expectedRevenue: 138000,
  revenueLastMonth: 124000,
  totalExpenses: 69000,
  expensesLastMonth: 64000,
  expectedProfit: 69000,
};

export const farmerProfile = {
  name: 'Murugan R',
  initials: 'MR',
  plan: 'Pro Farmer',
  location: 'Thanjavur, Tamil Nadu',
  memberSince: '2024',
  totalAcreage: 11.1,
  activeFields: 4,
  seasonsCompleted: 5,
  rating: 4.9,
  verified: true,
};

export const kpis = {
  activeFields: 4,
  totalAcreage: 11.1,
  openTasks: 4,
  avgHealth: 84,
};

/* ---------- Crop Recommendation form options ---------- */

export const soilTypes = ['Clay Loam', 'Sandy Loam', 'Red Soil', 'Black Cotton', 'Alluvial', 'Laterite'];
export const waterSources = ['Canal', 'Borewell', 'Open Well', 'Drip Irrigation', 'Rainfed', 'River'];
export const seasonOptions = ['Kharif', 'Rabi', 'Summer', 'Zaid'];
export const previousCrops = ['Paddy', 'Sugarcane', 'Cotton', 'Groundnut', 'Maize', 'Black Gram', 'None'];

export interface CropRecResult {
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
  best: boolean;
}

export const cropRecResult: CropRecResult[] = [
  {
    crop: 'Paddy',
    variety: 'CR-1009',
    confidence: 94,
    expectedYield: '2,640 kg/acre',
    expectedRevenue: 186000,
    expectedProfit: 88000,
    marketDemand: 'High',
    waterRequirement: 'High',
    growingDuration: '120 days',
    riskLevel: 'Low',
    reason: 'Matches your clay-loam soil (pH 6.8), monsoon rainfall forecast of 620 mm, and strong mandi demand in Thanjavur district.',
    color: '#22c55e',
    best: true,
  },
  {
    crop: 'Black Gram',
    variety: 'ADT-5',
    confidence: 88,
    expectedYield: '720 kg/acre',
    expectedRevenue: 108000,
    expectedProfit: 72000,
    marketDemand: 'High',
    waterRequirement: 'Low',
    growingDuration: '75 days',
    riskLevel: 'Low',
    reason: 'Short duration and nitrogen-fixing — ideal rotation after paddy with low water requirement.',
    color: '#1f2937',
    best: false,
  },
  {
    crop: 'Maize',
    variety: 'CO-6',
    confidence: 82,
    expectedYield: '3,100 kg/acre',
    expectedRevenue: 93000,
    expectedProfit: 51000,
    marketDemand: 'Medium',
    waterRequirement: 'Medium',
    growingDuration: '95 days',
    riskLevel: 'Medium',
    reason: 'Strong cattle-feed market price this quarter. Medium water need suits borewell irrigation.',
    color: '#f59e0b',
    best: false,
  },
];

/* ---------- Expense Tracker ---------- */

export const expenseCategories = [
  'Seeds', 'Fertilizer', 'Pesticides', 'Machinery', 'Labour',
  'Transport', 'Electricity', 'Water', 'Miscellaneous',
];

export const monthlyExpenseSummary = [
  { month: 'Mar', amount: 52000 },
  { month: 'Apr', amount: 58000 },
  { month: 'May', amount: 55000 },
  { month: 'Jun', amount: 61000 },
  { month: 'Jul', amount: 64000 },
  { month: 'Aug', amount: 69000 },
];

export const monthlyExpenseByCategory = [
  { month: 'Mar', Seeds: 8000, Fertilizer: 12000, Labour: 18000, Other: 14000 },
  { month: 'Apr', Seeds: 3000, Fertilizer: 15000, Labour: 22000, Other: 18000 },
  { month: 'May', Seeds: 2000, Fertilizer: 14000, Labour: 20000, Other: 19000 },
  { month: 'Jun', Seeds: 10000, Fertilizer: 16000, Labour: 21000, Other: 14000 },
  { month: 'Jul', Seeds: 4000, Fertilizer: 18000, Labour: 24000, Other: 18000 },
  { month: 'Aug', Seeds: 12400, Fertilizer: 12900, Labour: 18500, Other: 25200 },
];

/* ---------- AI Assistant ---------- */

export const chatHistory = [
  { id: 'ch1', title: 'Nitrogen top-dressing for paddy', time: 'Today, 09:14', active: true },
  { id: 'ch2', title: 'Tomato early blight treatment', time: 'Yesterday' },
  { id: 'ch3', title: 'Irrigation schedule this week', time: '2 days ago' },
  { id: 'ch4', title: 'Sugarcane pest prevention', time: 'Aug 08' },
  { id: 'ch5', title: 'Fertilizer dosage for banana', time: 'Aug 05' },
];

export const suggestedQuestions = [
  'Why are my leaves turning yellow?',
  'When should I irrigate my paddy field?',
  'Recommend a fertilizer schedule for tomato.',
  'How do I prevent fall armyworm in maize?',
  'What is the best crop to plant after paddy?',
];

/* ---------- Crop Health Scanner ---------- */

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

export const scanAnalysis: ScanAnalysis = {
  disease: 'Early Blight (Alternaria solani)',
  diseaseConfidence: 88,
  nutrientDeficiency: 'Nitrogen deficiency — pale lower leaves',
  nutrientConfidence: 76,
  waterStress: 'Low',
  waterConfidence: 92,
  pestRisk: 'Low',
  pestConfidence: 84,
  recommendation: 'Apply copper oxychloride 3 g/L as a foliar spray at early morning. Remove infected lower leaves. Apply 20 kg urea/acre to address nitrogen deficiency. Maintain regular irrigation schedule.',
  overallConfidence: 86,
};

/* ---------- Yield Prediction ---------- */

export interface YieldPrediction {
  predictedYield: number;
  yieldUnit: string;
  expectedRevenue: number;
  totalExpenses: number;
  netProfit: number;
  roi: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore: number;
}

export const yieldPrediction: YieldPrediction = {
  predictedYield: 2640,
  yieldUnit: 'kg',
  expectedRevenue: 186000,
  totalExpenses: 98000,
  netProfit: 88000,
  roi: 89.8,
  riskLevel: 'Low',
  riskScore: 22,
};

export const yieldByGrowthStage = [
  { stage: 'Germination', yield: 0, projected: 1800 },
  { stage: 'Tillering', yield: 0, projected: 2200 },
  { stage: 'Panicle', yield: 0, projected: 2400 },
  { stage: 'Grain Fill', yield: 0, projected: 2600 },
  { stage: 'Harvest', yield: 0, projected: 2640 },
];

/* ---------- Season Report Timeline ---------- */

export interface TimelineEvent {
  id: string;
  phase: string;
  date: string;
  title: string;
  description: string;
  icon: string;
  metric: string;
  metricLabel: string;
}

export const seasonTimeline: TimelineEvent[] = [
  { id: 'tl1', phase: 'Preparation', date: 'Jun 01', title: 'Land preparation & sowing', description: 'Ploughed Field A (3.2 ac), applied basal FYM. Sowed CR-1009 paddy seed.', icon: 'Sprout', metric: '₹12,400', metricLabel: 'seed cost' },
  { id: 'tl2', phase: 'Growth', date: 'Jun 28', title: 'First nitrogen top-dressing', description: 'Applied 30 kg urea/acre at tillering stage. AI-recommended dosage based on soil test.', icon: 'Droplets', metric: '₹8,600', metricLabel: 'fertilizer' },
  { id: 'tl3', phase: 'Weather', date: 'Jul 10', title: 'Heavy rainfall event', description: '182 mm rainfall over 3 days. Delayed irrigation and drained excess water to prevent submergence.', icon: 'CloudRain', metric: '182 mm', metricLabel: 'rainfall' },
  { id: 'tl4', phase: 'Treatment', date: 'Jul 22', title: 'Preventive pest spray', description: 'Applied neem oil + trichoderma as preventive against stem borer and blast.', icon: 'ShieldCheck', metric: '₹4,300', metricLabel: 'pesticides' },
  { id: 'tl5', phase: 'Growth', date: 'Aug 05', title: 'Labour intensive weeding', description: 'Crew of 6 completed manual weeding across Field A and Field B over 2 days.', icon: 'Users', metric: '₹18,500', metricLabel: 'labour' },
  { id: 'tl6', phase: 'Harvest', date: 'Sep 28', title: 'Harvest completed', description: 'Combined harvester across 3.2 acres. Total yield 2,640 kg/acre — 11% above last season.', icon: 'Wheat', metric: '2,640 kg', metricLabel: 'yield/acre' },
  { id: 'tl7', phase: 'Income', date: 'Oct 05', title: 'Produce sold at mandi', description: 'Sold 8,448 kg at ₹28/kg to Thanjavur Uzhavar Sandhai. Payment received via direct transfer.', icon: 'IndianRupee', metric: '₹2,36,544', metricLabel: 'revenue' },
];

/* ---------- Farm Profile ---------- */

export interface FarmImage {
  id: string;
  label: string;
  caption: string;
  query: string;
}

export const farmImages: FarmImage[] = [
  { id: 'fi1', label: 'Field A · Paddy', caption: 'Tillering stage, 3.2 acres', query: 'lush green paddy rice field aerial view' },
  { id: 'fi2', label: 'Greenhouse 1 · Tomato', caption: 'Flowering stage, 0.8 acres', query: 'tomato greenhouse plants rows' },
  { id: 'fi3', label: 'Field B · Sugarcane', caption: 'Grand growth, 5.0 acres', query: 'sugarcane plantation field rows' },
  { id: 'fi4', label: 'Field C · Banana', caption: 'Shooting stage, 2.1 acres', query: 'banana plantation trees farm' },
];

export interface SoilInfo {
  field: string;
  type: string;
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicCarbon: string;
  lastTested: string;
}

export const soilInfo: SoilInfo[] = [
  { field: 'Field A', type: 'Clay Loam', pH: 6.8, nitrogen: 280, phosphorus: 42, potassium: 185, organicCarbon: '0.82%', lastTested: 'Jun 2026' },
  { field: 'Greenhouse 1', type: 'Sandy Loam', pH: 6.5, nitrogen: 220, phosphorus: 38, potassium: 160, organicCarbon: '0.71%', lastTested: 'Jun 2026' },
  { field: 'Field B', type: 'Black Cotton', pH: 7.2, nitrogen: 310, phosphorus: 48, potassium: 210, organicCarbon: '0.90%', lastTested: 'May 2026' },
  { field: 'Field C', type: 'Red Soil', pH: 6.3, nitrogen: 240, phosphorus: 35, potassium: 170, organicCarbon: '0.68%', lastTested: 'May 2026' },
];

export interface PreviousSeason {
  season: string;
  period: string;
  crop: string;
  area: string;
  yield: string;
  revenue: number;
  profit: number;
  rating: string;
}

export const previousSeasons: PreviousSeason[] = [
  { season: 'Rabi 2025', period: 'Oct 2025 – Feb 2026', crop: 'Wheat + Gram', area: '8.5 ac', yield: '1,820 kg/ac', revenue: 312000, profit: 148000, rating: 'A' },
  { season: 'Kharif 2025', period: 'Jun – Sep 2025', crop: 'Paddy', area: '3.2 ac', yield: '2,380 kg/ac', revenue: 167000, profit: 78000, rating: 'A-' },
  { season: 'Summer 2025', period: 'Mar – May 2025', crop: 'Maize', area: '5.0 ac', yield: '2,900 kg/ac', revenue: 87000, profit: 41000, rating: 'B+' },
  { season: 'Rabi 2024', period: 'Oct 2024 – Feb 2025', crop: 'Groundnut', area: '5.0 ac', yield: '1,420 kg/ac', revenue: 134000, profit: 62000, rating: 'B+' },
];

/* ---------- Admin Panel ---------- */

export const adminStats = {
  registeredFarmers: 12847,
  totalFarms: 19302,
  currentCrops: 38456,
  revenue: 4826000,
  alerts: 127,
};

export const adminRevenueTrend = [
  { month: 'Mar', revenue: 320000, farmers: 9800 },
  { month: 'Apr', revenue: 380000, farmers: 10200 },
  { month: 'May', revenue: 410000, farmers: 10800 },
  { month: 'Jun', revenue: 460000, farmers: 11400 },
  { month: 'Jul', revenue: 510000, farmers: 12000 },
  { month: 'Aug', revenue: 580000, farmers: 12847 },
];

export const adminCropDistribution = [
  { name: 'Paddy', value: 12847, color: '#22c55e' },
  { name: 'Sugarcane', value: 6234, color: '#0ea5e9' },
  { name: 'Cotton', value: 4892, color: '#f59e0b' },
  { name: 'Maize', value: 3561, color: '#d97706' },
  { name: 'Others', value: 922, color: '#94a3b8' },
];

export interface AdminActivity {
  id: string;
  farmer: string;
  action: string;
  time: string;
  type: 'register' | 'scan' | 'expense' | 'chat' | 'alert';
}

export const adminActivities: AdminActivity[] = [
  { id: 'aa1', farmer: 'Lakshmi S', action: 'Registered a new farm in Coimbatore', time: '5 min ago', type: 'register' },
  { id: 'aa2', farmer: 'Arjun K', action: 'Scanned tomato crop — early blight detected', time: '12 min ago', type: 'scan' },
  { id: 'aa3', farmer: 'Murugan R', action: 'Logged expense of ₹18,500 (Labour)', time: '1 hr ago', type: 'expense' },
  { id: 'aa4', farmer: 'Priya V', action: 'Asked AI assistant about irrigation', time: '2 hr ago', type: 'chat' },
  { id: 'aa5', farmer: 'Senthil M', action: 'Triggered pest alert for Field B', time: '3 hr ago', type: 'alert' },
  { id: 'aa6', farmer: 'Kavitha R', action: 'Registered a new farm in Madurai', time: '4 hr ago', type: 'register' },
  { id: 'aa7', farmer: 'Ramesh P', action: 'Scanned banana crop — healthy', time: '5 hr ago', type: 'scan' },
];

export interface AdminFarmer {
  id: string;
  name: string;
  location: string;
  farms: number;
  acres: number;
  plan: string;
  status: 'Active' | 'Trial';
  joined: string;
}

export const adminFarmers: AdminFarmer[] = [
  { id: 'f1', name: 'Murugan R', location: 'Thanjavur, TN', farms: 4, acres: 11.1, plan: 'Pro', status: 'Active', joined: 'Jan 2024' },
  { id: 'f2', name: 'Lakshmi S', location: 'Coimbatore, TN', farms: 2, acres: 6.5, plan: 'Pro', status: 'Active', joined: 'Mar 2024' },
  { id: 'f3', name: 'Arjun K', location: 'Tirunelveli, TN', farms: 3, acres: 14.2, plan: 'Free', status: 'Trial', joined: 'Jul 2025' },
  { id: 'f4', name: 'Priya V', location: 'Madurai, TN', farms: 1, acres: 3.0, plan: 'Free', status: 'Trial', joined: 'Aug 2025' },
  { id: 'f5', name: 'Senthil M', location: 'Salem, TN', farms: 5, acres: 22.0, plan: 'Pro', status: 'Active', joined: 'Feb 2024' },
];
