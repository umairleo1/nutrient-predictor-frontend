import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { TrendingUp, Info } from 'lucide-react';
import { FeatureContribution } from '../../types';
import { getSHAPColor, SHAP_COLORS } from '../../constants/colors';

interface FeatureImportanceProps {
  features: FeatureContribution[];
  className?: string;
}

export default function FeatureImportance({ features, className = '' }: FeatureImportanceProps) {
  // Helper function to get appropriate label for "protective" factors
  const getProtectiveLabel = (featureName: string, value: number): string => {
    const name = featureName.toLowerCase();
    
    // Special handling for BMI - never call unhealthy BMI "protective"
    if (name.includes('bmi')) {
      if (value > 30) return 'MODEL EFFECT'; // Obese
      if (value > 25) return 'MODEL EFFECT'; // Overweight  
      if (value < 18.5) return 'MODEL EFFECT'; // Underweight
    }
    
    // For other potentially misleading health markers
    if (name.includes('weight') && value > 100) return 'MODEL EFFECT';
    
    // Default protective label for genuinely beneficial factors
    return 'PROTECTIVE';
  };

  // Helper function to format values for display
  const formatValue = (featureName: string, value: number): string => {
    const name = featureName.toLowerCase();
    
    if (name.includes('gender')) {
      return value === 1 ? 'Male' : 'Female';
    }
    if (name.includes('race') || name.includes('ethnicity')) {
      // Race/Ethnicity mapping based on NHANES RIDRETH3 codes
      const raceMap: { [key: number]: string } = {
        1: 'Mexican American',
        2: 'Other Hispanic', 
        3: 'Non-Hispanic White',
        4: 'Non-Hispanic Black',
        6: 'Non-Hispanic Asian',
        7: 'Other Race'
      };
      return raceMap[Math.round(value)] || `Other (Code ${Math.round(value)})`;
    }
    if (name.includes('education')) {
      // Education mapping based on NHANES DMDEDUC2 codes
      const educationMap: { [key: number]: string } = {
        1: 'Less than 9th grade',
        2: '9-11th grade',
        3: 'High school graduate',
        4: 'Some college',
        5: 'College graduate or above',
        7: 'Refused',
        9: "Don't know"
      };
      return educationMap[Math.round(value)] || `Unknown (Code ${Math.round(value)})`;
    }
    if (name.includes('marital')) {
      // Marital status mapping based on NHANES DMDMARTL codes
      const maritalMap: { [key: number]: string } = {
        1: 'Married',
        2: 'Widowed', 
        3: 'Divorced',
        4: 'Separated',
        5: 'Never married',
        6: 'Living with partner',
        77: 'Refused',
        99: "Don't know"
      };
      return maritalMap[Math.round(value)] || `Unknown (Code ${Math.round(value)})`;
    }
    if (name.includes('country')) {
      return Math.round(value) === 1 ? 'Born in US' : 'Born outside US';
    }
    if (name.includes('age')) {
      return `${value.toFixed(0)} years`;
    }
    if (name.includes('weight')) {
      return `${value.toFixed(1)} kg`;
    }
    if (name.includes('height')) {
      return `${value.toFixed(0)} cm`;
    }
    if (name.includes('bmi')) {
      return `${value.toFixed(1)} kg/m²`;
    }
    return value.toFixed(2);
  };

  // Prepare data for the chart
  const chartData = features.map(feature => ({
    name: feature.feature_name,
    impact: feature.impact,
    absImpact: Math.abs(feature.impact),
    value: feature.value,
    displayValue: formatValue(feature.feature_name, feature.value),
    isPositive: feature.impact > 0
  })).sort((a, b) => b.absImpact - a.absImpact);

  // Calculate range for better axis labeling
  const impacts = chartData.map(d => d.impact);
  const minImpact = Math.min(...impacts);
  const maxImpact = Math.max(...impacts);
  const hasPositive = impacts.some(i => i > 0);
  const hasNegative = impacts.some(i => i < 0);
  
  // Generate axis description
  const getAxisDescription = () => {
    if (hasPositive && hasNegative) {
      return `Range: ${minImpact.toFixed(1)} to ${maxImpact.toFixed(1)} (mixed risk and protective factors)`;
    } else if (hasPositive) {
      return `Range: ${minImpact.toFixed(1)} to ${maxImpact.toFixed(1)} (all risk-increasing factors)`;
    } else {
      return `Range: ${minImpact.toFixed(1)} to ${maxImpact.toFixed(1)} (all protective factors)`;
    }
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Value: <span className="font-medium">{data.value.toFixed(2)}</span>
          </p>
          <p className="text-sm">
            Impact: <span className={`font-medium ${data.isPositive ? 'text-red-600' : 'text-green-600'}`}>
              {data.impact > 0 ? '+' : ''}{data.impact.toFixed(3)}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {data.isPositive ? 'Increases' : 'Decreases'} deficiency risk
          </p>
        </div>
      );
    }
    return null;
  };

  // Use centralized color function
  const getBarColor = getSHAPColor;

  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Feature Importance Analysis</h3>
            <p className="text-sm text-gray-500">
              Factors most influencing your nutrient deficiency predictions (SHAP values)
            </p>
          </div>
        </div>
      </div>

      <div className="card-content">
        {/* Info Banner */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-800 font-medium mb-2">Understanding Your Results:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-blue-700 font-medium mb-1">Impact Colors:</p>
                  <ul className="text-blue-700 space-y-1">
                    <li>• <span className="text-red-600 font-medium">Red = INCREASES</span> deficiency risk</li>
                    <li>• <span className="text-green-600 font-medium">Green = DECREASES</span> deficiency risk</li>
                  </ul>
                </div>
                <div>
                  <p className="text-blue-700 font-medium mb-1">Impact Bars:</p>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Show <strong>relative influence</strong> of each factor</li>
                    <li>• Longer bar = <strong>stronger effect</strong> on prediction</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
              barCategoryGap={10}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={11}
                stroke="#64748b"
              />
              <YAxis 
                fontSize={11}
                stroke="#64748b"
                label={{ value: 'SHAP Impact on Risk', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '10px' } }}
              />
              <ReferenceLine y={0} stroke={SHAP_COLORS.neutral} strokeWidth={1} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="impact" radius={[2, 2, 2, 2]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.isPositive)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Range Description */}
        <div className="text-center mt-2">
          <p className="text-xs text-gray-600 font-medium">
            {getAxisDescription()}
          </p>
        </div>

        {/* Compact Feature Details */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" /> Key Impact Factors
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {chartData.slice(0, 6).map((feature, index) => {
              const maxAbsImpact = Math.max(...chartData.map(f => f.absImpact));
              const barWidth = (feature.absImpact / maxAbsImpact) * 100;
              
              return (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border-l-3 transition-all duration-200 hover:shadow-sm ${
                    feature.isPositive 
                      ? 'bg-red-50 border-red-400' 
                      : 'bg-green-50 border-green-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${
                          feature.isPositive ? 'bg-red-500' : 'bg-green-500'
                        }`}></div>
                        <h5 className="font-medium text-gray-900 text-sm">{feature.name}</h5>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">Your value: <span className="font-medium">{feature.displayValue}</span></p>
                      
                      {/* Add clarification for potentially misleading labels */}
                      {!feature.isPositive && getProtectiveLabel(feature.name, feature.value) === 'MODEL EFFECT' && (
                        <p className="text-xs text-amber-700 mb-2 italic">
                          Model impact: Decreases predicted deficiency risk (statistical artifact).
                          <br />Note: This does NOT indicate optimal health.
                        </p>
                      )}
                      
                      {/* Impact Strength Indicator */}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Impact Strength:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-20">
                          <div 
                            className={`h-1.5 rounded-full ${
                              feature.isPositive ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${barWidth}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-bold ${
                          feature.isPositive ? 'text-red-700' : 'text-green-700'
                        }`}>
                          {Math.round(barWidth)}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Model Effect: {feature.isPositive ? 'Increases' : 'Reduces'} predicted deficiency risk
                      </p>
                    </div>
                    
                    <div className={`ml-3 px-2 py-1 rounded text-xs font-medium ${
                      feature.isPositive 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {feature.isPositive ? 'RISK' : getProtectiveLabel(feature.name, feature.value)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Compact Summary Stats */}
          <div className="mt-4 flex justify-center">
            <div className="flex items-center space-x-6 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-red-700">
                    {chartData.filter(f => f.isPositive).length} Risk
                  </span>
                </div>
              </div>
              
              <div className="w-px h-4 bg-gray-300"></div>
              
              <div className="text-center">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">
                    {chartData.filter(f => !f.isPositive).length} Protective
                  </span>
                </div>
              </div>
              
              <div className="w-px h-4 bg-gray-300"></div>
              
              <div className="text-center">
                <span className="text-xs text-gray-600">Max Impact: </span>
                <span className="text-sm font-bold text-blue-700">
                  {chartData[0]?.absImpact.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}