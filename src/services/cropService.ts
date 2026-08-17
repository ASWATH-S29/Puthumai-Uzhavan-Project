import { supabase } from '@/lib/supabase';
import type { CropRecommendRequest, CropRecommendResponse, CropRecommendation, RecommendationHistoryRow } from '@/services/types';

function normalizeRecommendation(row: Partial<RecommendationHistoryRow> & Record<string, unknown>): RecommendationHistoryRow {
  return {
    id: String(row.id ?? ''),
    user_id: String(row.user_id ?? ''),
    state: row.state ? String(row.state) : null,
    district: row.district ? String(row.district) : null,
    soil_type: row.soil_type ? String(row.soil_type) : null,
    season: row.season ? String(row.season) : null,
    land_size: row.land_size ? Number(row.land_size) : null,
    water_availability: row.water_availability ? String(row.water_availability) : null,
    previous_crop: row.previous_crop ? String(row.previous_crop) : null,
    recommended_crop: String(row.recommended_crop ?? 'Crop'),
    expected_yield: row.expected_yield ? String(row.expected_yield) : null,
    profit_estimate: row.profit_estimate ? Number(row.profit_estimate) : null,
    required_water: row.required_water ? String(row.required_water) : null,
    fertilizer_advice: row.fertilizer_advice ? String(row.fertilizer_advice) : null,
    created_at: row.created_at ? String(row.created_at) : undefined,
  };
}

export async function recommendCrops(payload: CropRecommendRequest): Promise<CropRecommendResponse> {
  try {
    const [farmsResult, weatherResult, cropsResult] = await Promise.allSettled([
      payload.userId ? supabase.from('farms').select('*').eq('owner_id', payload.userId).limit(10) : Promise.resolve({ data: [], error: null }),
      supabase.from('weather_cache').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('crops').select('*').limit(10),
    ]);

    const farms = farmsResult.status === 'fulfilled' && farmsResult.value.data ? (farmsResult.value.data as Array<Record<string, unknown>>) : [];
    const weatherRows = weatherResult.status === 'fulfilled' && weatherResult.value.data ? (weatherResult.value.data as Array<Record<string, unknown>>) : [];
    const cropCatalog = cropsResult.status === 'fulfilled' && cropsResult.value.data ? (cropsResult.value.data as Array<Record<string, unknown>>) : [];

    const recommendations = generateRecommendations(payload, { farms, weatherRows, cropCatalog });
    return { recommendations };
  } catch {
    return { recommendations: generateRecommendations(payload) };
  }
}

export async function saveRecommendationHistory(userId: string, payload: CropRecommendRequest, recommendation: CropRecommendResponse['recommendations'][number]) {
  const { error } = await supabase.from('recommendations').insert({
    user_id: userId,
    state: payload.location?.split(',').pop()?.trim() || null,
    district: payload.district || null,
    soil_type: payload.soilType || null,
    season: payload.season || null,
    land_size: payload.farmArea || null,
    water_availability: payload.waterAvailability || null,
    previous_crop: payload.previousCrop || null,
    recommended_crop: recommendation.crop,
    expected_yield: recommendation.expectedYield,
    profit_estimate: recommendation.expectedProfit,
    required_water: recommendation.waterRequirement,
    fertilizer_advice: recommendation.reason,
  });

  if (error) throw new Error(error.message);
}

export async function getRecommendationHistory(userId: string): Promise<RecommendationHistoryRow[]> {
  const { data, error } = await supabase.from('recommendations').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeRecommendation(row as Partial<RecommendationHistoryRow> & Record<string, unknown>));
}

function generateRecommendations(payload: CropRecommendRequest, context?: { farms?: Array<Record<string, unknown>>; weatherRows?: Array<Record<string, unknown>>; cropCatalog?: Array<Record<string, unknown>> }): CropRecommendation[] {
  const crops: CropRecommendation[] = [
    { crop: 'Paddy', variety: 'CR-1009', expectedYield: '2,640 kg/acre', expectedRevenue: 186000, expectedProfit: 88000, marketDemand: 'High', waterRequirement: 'High', growingDuration: '120 days', riskLevel: 'Low', reason: 'Best fit for clay loam and high rainfall in your district.', color: '#22c55e', confidence: 94, benefits: ['High market demand', 'Good for heavy rainfall'], disadvantages: ['Needs sustained water'], growingSteps: ['Prepare field', 'Apply basal fertilizer', 'Maintain irrigation'], fertilizer: 'Use 20-25 kg N/acre split dosage', irrigation: 'Keep 2-3 cm water during tillering', harvestTime: '110-120 days', marketPrice: '₹2,000-2,400/quintal' },
    { crop: 'Black Gram', variety: 'ADT-5', expectedYield: '720 kg/acre', expectedRevenue: 108000, expectedProfit: 72000, marketDemand: 'High', waterRequirement: 'Low', growingDuration: '75 days', riskLevel: 'Low', reason: 'Short duration and low water need suit a rotation after paddy.', color: '#1f2937', confidence: 88, benefits: ['Low water need', 'Fast harvest'], disadvantages: ['Sensitive to moisture stress'], growingSteps: ['Seed treatment', 'Sow after pre-monsoon', 'Weed management'], fertilizer: 'Apply DAP and micronutrients', irrigation: 'Light irrigation at flowering', harvestTime: '70-80 days', marketPrice: '₹6,200-7,200/quintal' },
    { crop: 'Maize', variety: 'CO-6', expectedYield: '3,100 kg/acre', expectedRevenue: 93000, expectedProfit: 51000, marketDemand: 'Medium', waterRequirement: 'Medium', growingDuration: '95 days', riskLevel: 'Medium', reason: 'Works well under moderate rainfall and borewell irrigation.', color: '#f59e0b', confidence: 82, benefits: ['High biomass', 'Good fodder value'], disadvantages: ['Needs nutrient management'], growingSteps: ['Land preparation', 'Balanced fertilization', 'Timely weeding'], fertilizer: 'Apply NPK as per soil test', irrigation: 'Irrigate at critical growth stages', harvestTime: '90-100 days', marketPrice: '₹2,000-2,300/quintal' },
    { crop: 'Groundnut', variety: 'TMV-13', expectedYield: '1,800 kg/acre', expectedRevenue: 126000, expectedProfit: 64000, marketDemand: 'Medium', waterRequirement: 'Medium', growingDuration: '105 days', riskLevel: 'Low', reason: 'Reliable for light soils and warm conditions.', color: '#f97316', confidence: 79, benefits: ['High oil content', 'Good crop rotation'], disadvantages: ['Kernel spoilage risk'], growingSteps: ['Seed treatment', 'Sowing at proper spacing', 'Pegging care'], fertilizer: 'Use gypsum and phosphorus', irrigation: 'Irrigate before flowering and pegging', harvestTime: '100-110 days', marketPrice: '₹5,200-6,500/quintal' },
    { crop: 'Sugarcane', variety: 'Co-86032', expectedYield: '85 tons/acre', expectedRevenue: 215000, expectedProfit: 96000, marketDemand: 'High', waterRequirement: 'High', growingDuration: '300 days', riskLevel: 'Medium', reason: 'Strong profitability when water is available and the district has good demand.', color: '#0ea5e9', confidence: 76, benefits: ['High income potential'], disadvantages: ['Long crop duration'], growingSteps: ['Prepare nursery', 'Setts treatment', 'Regular earthing up'], fertilizer: 'Apply balanced NPK and micronutrients', irrigation: 'Frequent irrigation in early growth', harvestTime: '300-320 days', marketPrice: '₹3,100-3,500/ton' },
  ];

  const normalizedRainfall = Number(payload.rainfall || 0);
  const normalizedTemp = Number(payload.temperature || 0);
  const farmArea = Number(payload.farmArea || 0);
  const waterAvailability = String(payload.waterAvailability || '').toLowerCase();
  const soilType = String(payload.soilType || '').toLowerCase();
  const district = String(payload.district || '').toLowerCase();
  const weather = context?.weatherRows?.[0];
  const rainfallHint = weather && typeof weather.rainfall === 'number' ? Number(weather.rainfall) : normalizedRainfall;
  const tempHint = weather && typeof weather.temperature === 'number' ? Number(weather.temperature) : normalizedTemp;
  const farmMatches = context?.farms?.filter((farm) => {
    const farmDistrict = String((farm.district as string | undefined) || '').toLowerCase();
    return !district || farmDistrict.includes(district) || district.includes(farmDistrict);
  }) ?? [];
  const soilHint = farmMatches.find((farm) => typeof farm.soil_type === 'string');

  return crops.map((crop, index) => {
    let score = crop.confidence;
    if (soilType.includes('clay') || soilHint?.soil_type?.toString().toLowerCase().includes('clay')) score += 2;
    if (rainfallHint > 500) score += 2;
    if (tempHint > 25) score += 2;
    if (farmArea > 2) score += 1;
    if (waterAvailability.includes('drip')) score += 2;
    if (payload.previousCrop && payload.previousCrop.toLowerCase() === 'paddy' && crop.crop === 'Black Gram') score += 4;
    if (crop.crop === 'Groundnut' && soilType.includes('red')) score += 3;
    if (crop.crop === 'Paddy' && rainfallHint > 700) score += 3;
    if (crop.crop === 'Sugarcane' && farmArea > 5) score += 2;

    return {
      ...crop,
      confidence: Math.min(99, Math.max(65, score)),
      best: index === 0,
    };
  }).sort((a, b) => b.confidence - a.confidence);
}
