// Color constants for consistent theming across the app

export const RISK_COLORS = {
  low: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: 'text-green-600',
    bar: 'bg-green-500',
    chart: '#22c55e' // Green for protective factors/low risk
  },
  moderate: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: 'text-yellow-600',
    bar: 'bg-yellow-500',
    chart: '#eab308' // Yellow for moderate risk
  },
  high: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-600',
    bar: 'bg-red-500',
    chart: '#ef4444' // Red for high risk/harmful factors
  }
} as const;

export const HEALTH_SCORE_COLORS = {
  excellent: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-600'
  },
  good: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600'
  },
  fair: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-600'
  },
  needsAttention: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-600'
  }
} as const;

export const CATEGORY_COLORS = {
  medical: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-600'
  },
  dietary: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: 'text-green-600'
  },
  lifestyle: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-800',
    icon: 'text-purple-600'
  }
} as const;

export const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-gray-100 text-gray-800 border-gray-200'
} as const;

export const CONNECTION_COLORS = {
  checking: 'text-yellow-600',
  connected: 'text-green-600',
  error: 'text-red-600'
} as const;

// SHAP Chart Colors
export const SHAP_COLORS = {
  positive: '#ef4444', // Red - increases risk
  negative: '#22c55e', // Green - decreases risk (protective)
  neutral: '#94a3b8'   // Gray - reference line
} as const;

// Helper functions
export const getRiskColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'low': return RISK_COLORS.low;
    case 'moderate': return RISK_COLORS.moderate;
    case 'high': return RISK_COLORS.high;
    default: return RISK_COLORS.low;
  }
};

export const getHealthScoreColor = (score: number) => {
  if (score >= 80) return HEALTH_SCORE_COLORS.excellent;
  if (score >= 60) return HEALTH_SCORE_COLORS.good;
  if (score >= 40) return HEALTH_SCORE_COLORS.fair;
  return HEALTH_SCORE_COLORS.needsAttention;
};

export const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'medical': return CATEGORY_COLORS.medical;
    case 'dietary': return CATEGORY_COLORS.dietary;
    case 'lifestyle': return CATEGORY_COLORS.lifestyle;
    default: return CATEGORY_COLORS.dietary;
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high': return PRIORITY_COLORS.high;
    case 'medium': return PRIORITY_COLORS.medium;
    case 'low': return PRIORITY_COLORS.low;
    default: return PRIORITY_COLORS.low;
  }
};

export const getSHAPColor = (isPositive: boolean) => {
  return isPositive ? SHAP_COLORS.positive : SHAP_COLORS.negative;
};