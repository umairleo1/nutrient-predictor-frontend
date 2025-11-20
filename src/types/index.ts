// API Types - Must match backend schemas
export interface UserProfile {
  age: number;
  gender: 'Male' | 'Female';
  race: 'Mexican American' | 'Other Hispanic' | 'Non-Hispanic White' | 'Non-Hispanic Black' | 'Other Race';
  weight: number; // kg
  height: number; // cm
  education: 'Less than 9th grade' | '9-11th grade' | 'High school graduate' | 'Some college' | 'College graduate or above';
  marital_status: 'Married' | 'Widowed' | 'Divorced' | 'Separated' | 'Never married' | 'Living with partner';
  country_of_birth: 'US' | 'Other';
}

export interface FeatureContribution {
  feature: string;
  feature_name: string;
  value: number;
  impact: number;
}

export interface NutrientPrediction {
  nutrient: string;
  risk_score: number;
  risk_category: 'Low' | 'Moderate' | 'High';
  confidence: number;
  confidence_lower: number;
  confidence_upper: number;
  note: string;
}

export interface Recommendation {
  category: 'Medical' | 'Dietary' | 'Lifestyle';
  priority: 'Low' | 'Medium' | 'High';
  recommendation: string;
  rationale: string;
}

export interface PredictionResponse {
  predictions: NutrientPrediction[];
  top_features: FeatureContribution[];
  recommendations: Recommendation[];
  overall_health_score: number;
}

// UI State Types
export interface FormErrors {
  [key: string]: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Form Options
export const GENDER_OPTIONS = ['Male', 'Female'] as const;

export const RACE_OPTIONS = [
  'Non-Hispanic White',
  'Non-Hispanic Black',
  'Mexican American',
  'Other Hispanic',
  'Other Race'
] as const;

export const EDUCATION_OPTIONS = [
  'Less than 9th grade',
  '9-11th grade', 
  'High school graduate',
  'Some college',
  'College graduate or above'
] as const;

export const MARITAL_STATUS_OPTIONS = [
  'Never married',
  'Married',
  'Living with partner',
  'Divorced',
  'Separated',
  'Widowed'
] as const;

export const COUNTRY_OPTIONS = ['US', 'Other'] as const;