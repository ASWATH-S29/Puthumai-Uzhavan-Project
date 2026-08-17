/**
 * aiContextService.ts
 * ─────────────────────────────────────────────────────────────
 * Gathers farm context (weather, alerts, expenses, yield, market)
 * to inject into the AI prompt. Each section is optional and only
 * included when data is actually available — so the AI never
 * fabricates live information.
 * ─────────────────────────────────────────────────────────────
 */

import type { FarmerMemory } from '@/services/farmerMemoryService';
import { buildFarmerMemoryContext } from '@/services/farmerMemoryService';
import type { FarmerAlert } from '@/services/farmerAlertsService';
import type { WeatherData } from '@/services/types';
import type { ExpensesResponse } from '@/services/types';

export interface FarmAIContext {
  farmerMemoryContext: string;
  weatherContext: string;
  alertsContext: string;
  expensesContext: string;
  yieldContext: string;
  marketContext: string;
}

export async function buildFarmAIContext(params: {
  memory: FarmerMemory | null;
  weather: WeatherData | null;
  alerts: FarmerAlert[];
  expenses: ExpensesResponse | null;
  yieldSummary: string | null;
}): Promise<FarmAIContext> {
  const farmerMemoryContext = buildFarmerMemoryContext(params.memory);

  const weatherContext = buildWeatherContext(params.weather);
  const alertsContext = buildAlertsContext(params.alerts);
  const expensesContext = buildExpensesContext(params.expenses);
  const yieldContext = buildYieldContext(params.yieldSummary);
  const marketContext = buildMarketContext(params.memory);

  return {
    farmerMemoryContext,
    weatherContext,
    alertsContext,
    expensesContext,
    yieldContext,
    marketContext,
  };
}

function buildWeatherContext(weather: WeatherData | null): string {
  if (!weather) return '';
  const lines: string[] = ['[Current Weather]'];
  lines.push(`Location: ${weather.location}`);
  lines.push(`Today: ${weather.today.temp}°C, ${weather.today.condition}, humidity ${weather.today.humidity}%, wind ${weather.today.wind} km/h`);
  if (weather.today.rainfall !== undefined) lines.push(`Rainfall (1h): ${weather.today.rainfall} mm`);
  if (weather.today.rainProbability !== undefined) lines.push(`Rain probability: ${weather.today.rainProbability}%`);
  if (weather.forecast && weather.forecast.length > 0) {
    const forecastSummary = weather.forecast
      .slice(0, 5)
      .map((f) => `${f.day}: ${f.tempHi}/${f.tempLo}°C, ${f.condition}${f.rainProbability !== undefined ? `, ${f.rainProbability}% rain` : ''}`)
      .join('; ');
    lines.push(`5-day forecast: ${forecastSummary}`);
  }
  return lines.join('\n');
}

function buildAlertsContext(alerts: FarmerAlert[]): string {
  if (!alerts || alerts.length === 0) return '';
  const lines: string[] = ['[Active Farm Alerts]'];
  for (const a of alerts.slice(0, 8)) {
    lines.push(`- [${a.severity.toUpperCase()}] ${a.title}${a.detail ? `: ${a.detail}` : ''}`);
  }
  return lines.join('\n');
}

function buildExpensesContext(expenses: ExpensesResponse | null): string {
  if (!expenses || expenses.rows.length === 0) return '';
  const lines: string[] = ['[Recent Expenses]'];
  lines.push(`Total: ₹${expenses.total.toLocaleString('en-IN')}`);
  const topCategories = expenses.byCategory.slice(0, 5);
  for (const c of topCategories) {
    lines.push(`- ${c.name}: ₹${c.value.toLocaleString('en-IN')}`);
  }
  return lines.join('\n');
}

function buildYieldContext(yieldSummary: string | null): string {
  if (!yieldSummary) return '';
  return `[Yield Information]\n${yieldSummary}`;
}

function buildMarketContext(memory: FarmerMemory | null): string {
  if (!memory?.current_crop) return '';
  const lines: string[] = ['[Market Information]'];
  lines.push(`Crop of interest: ${memory.current_crop}`);
  lines.push('Note: Live mandi prices are not available in this session. Do not fabricate specific prices. Provide general market guidance only.');
  return lines.join('\n');
}
