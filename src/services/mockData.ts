// Mock API responses sourced from the existing dummy data.
// Returned by services while VITE_USE_MOCK is "true".
import {
  weather,
  tasks,
  cropStatus,
  expenses,
  expenseByCategory,
  yieldTrend,
  profitTrend,
  notifications,
  cropRecommendations,
  chatSeed,
  scanResults,
  yieldFields,
  seasonSummary,
  seasonCrops,
  fields,
  expenseRows,
  finance,
  farmerProfile,
  kpis,
} from '@/data/dummyData';
import type {
  AuthResponse,
  DashboardResponse,
  ExpensesResponse,
  AddExpenseResponse,
  CropRecommendResponse,
  ChatResponse,
  ScannerResponse,
  YieldResponse,
  ReportResponse,
  ScanResult,
} from '@/services/types';

const uid = () => Math.random().toString(36).slice(2, 10);

export const mockLogin = (): AuthResponse => ({
  token: `mock-token-${uid()}`,
  user: {
    id: 'u-murugan',
    name: farmerProfile.name,
    email: 'murugan@puthumai.farm',
    plan: farmerProfile.plan,
    location: farmerProfile.location,
  },
});

export const mockRegister = (): AuthResponse => ({
  token: `mock-token-${uid()}`,
  user: {
    id: `u-${uid()}`,
    name: farmerProfile.name,
    email: 'murugan@puthumai.farm',
    plan: 'Free',
    location: farmerProfile.location,
  },
});

export const mockDashboard = (): DashboardResponse => ({
  farmerProfile,
  kpis,
  finance: {
    expectedRevenue: finance.expectedRevenue,
    revenueLastMonth: finance.revenueLastMonth,
    totalExpenses: finance.totalExpenses,
    expensesLastMonth: finance.expensesLastMonth,
    expectedProfit: finance.expectedProfit,
    profitMargin: 49.2,
    profitPerAcre: 8625,
  },
  weather,
  fields,
  cropStatus,
  tasks,
  notifications,
  profitTrend,
  yieldTrend,
});

export const mockCropRecommend = (): CropRecommendResponse => ({
  recommendations: cropRecommendations.map((item) => ({
    crop: item.crop,
    variety: item.variety,
    confidence: item.score,
    expectedYield: '',
    expectedRevenue: 0,
    expectedProfit: 0,
    marketDemand: item.marketDemand,
    waterRequirement: item.waterNeed,
    growingDuration: '',
    riskLevel: 'Medium',
    reason: item.reason,
    color: item.color,
  })),
});

export const mockExpenses = (): ExpensesResponse => {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  return { rows: expenseRows, total, byCategory: expenseByCategory };
};

export const mockAddExpense = (amount: number): AddExpenseResponse => {
  const total = expenses.reduce((s, e) => s + e.amount, 0) + amount;
  return {
    expense: {
      id: `x-${uid()}`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      category: 'Other',
      description: 'New expense',
      field: 'Field A',
      amount,
    },
    total,
  };
};

export const mockChat = (message: string): ChatResponse => ({
  reply: {
    id: `a-${uid()}`,
    role: 'assistant',
    text: `Based on your field data, I recommend monitoring moisture levels for "${message.slice(0, 40)}". Apply 30 kg urea per acre and irrigate lightly after 24 hours if no rain is forecast.`,
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
  },
});

export const mockScanner = (crop: string, field: string): ScannerResponse => {
  const result: ScanResult = {
    crop,
    field,
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    disease: null,
    confidence: 94,
    severity: 'None',
    treatment: 'No action needed. Field is healthy.',
    status: 'Healthy',
  };
  return { result };
};

export const mockYield = (): YieldResponse => ({
  fields: yieldFields,
  trend: yieldTrend,
});

export const mockReport = (): ReportResponse => ({
  summary: seasonSummary,
  crops: seasonCrops,
  profitTrend,
});

export const mockChatSeed = chatSeed;
export const mockScanResults = scanResults;
