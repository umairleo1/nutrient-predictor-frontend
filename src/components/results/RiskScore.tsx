import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { NutrientPrediction } from '../../types';
import { getRiskColor } from '../../constants/colors';

interface RiskScoreProps {
  prediction: NutrientPrediction;
  className?: string;
}

export default function RiskScore({ prediction, className = '' }: RiskScoreProps) {
  const getRiskIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'low': return CheckCircle;
      case 'moderate': return AlertTriangle;
      case 'high': return XCircle;
      default: return Info;
    }
  };

  const colorScheme = getRiskColor(prediction.risk_category);
  const IconComponent = getRiskIcon(prediction.risk_category);
  
  const riskPercentage = Math.round(prediction.risk_score * 100);
  const confidenceLowerPercentage = Math.round((prediction.confidence_lower || prediction.confidence) * 100);
  const confidenceUpperPercentage = Math.round((prediction.confidence_upper || prediction.confidence) * 100);

  // Get nutrient-specific information
  const getNutrientInfo = (nutrient: string) => {
    switch (nutrient.toLowerCase()) {
      case 'vitamin b12':
        return {
          description: 'Essential for nerve function and red blood cell formation',
          normalRange: '200-900 pg/mL',
          symptoms: 'Fatigue, weakness, neurological issues',
          clinicalNote: undefined
        };
      case 'iron':
      case 'anemia risk':
        return {
          description: 'Assessment of anemia risk based on hemoglobin levels (WHO criteria)',
          normalRange: 'Hgb: ≥12.0 g/dL (F), ≥13.0 g/dL (M)',
          symptoms: 'Fatigue, pale skin, shortness of breath',
          clinicalNote: undefined
        };
      case 'diabetes risk (limited)':
      case 'diabetes risk':
        return {
          description: 'Preliminary diabetes risk assessment based on demographic factors',
          normalRange: 'Limited accuracy for screening',
          symptoms: 'Increased thirst, frequent urination, unexplained weight loss',
          clinicalNote: undefined
        };
      default:
        return {
          description: 'Important nutrient for overall health',
          normalRange: 'Varies by test',
          symptoms: 'Varies by deficiency',
          clinicalNote: undefined
        };
    }
  };

  const nutrientInfo = getNutrientInfo(prediction.nutrient);

  return (
    <div className={`card hover:shadow-md transition-shadow duration-200 ${className}`}>
      <div className="card-header">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${colorScheme.bg} ${colorScheme.border} border`}>
              <IconComponent className={`h-5 w-5 ${colorScheme.icon}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{prediction.nutrient}</h3>
              <p className="text-sm text-gray-500">{nutrientInfo.description}</p>
            </div>
          </div>
          
          {/* Risk Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${colorScheme.bg} ${colorScheme.text} ${colorScheme.border} border`}>
            {prediction.risk_category} Risk
          </div>
        </div>
      </div>

      <div className="card-content space-y-4">
        {/* Risk Score Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Deficiency Risk</span>
            <span className="text-lg font-bold text-gray-900">{riskPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ease-out ${colorScheme.bar}`}
              style={{ width: `${riskPercentage}%` }}
            />
          </div>
        </div>

        {/* Calibrated Probability with Confidence Interval */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Confidence Interval</span>
            <span className="text-lg font-bold text-blue-900">
              {confidenceLowerPercentage}%–{confidenceUpperPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 relative">
            {/* Confidence interval background */}
            <div 
              className="h-2 bg-blue-200 rounded-full absolute"
              style={{ 
                left: `${confidenceLowerPercentage}%`,
                width: `${confidenceUpperPercentage - confidenceLowerPercentage}%` 
              }}
            />
            {/* Point estimate */}
            <div 
              className="h-2 bg-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${riskPercentage}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Calibrated probability with 95% confidence interval
          </div>
        </div>

        {/* Clinical Context */}
        <div className="pt-3 border-t border-gray-100">
          <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
            <div>
              <span className="font-medium">Clinical Threshold:</span> {nutrientInfo.normalRange}
            </div>
            <div>
              <span className="font-medium">Symptoms if deficient:</span> {nutrientInfo.symptoms}
            </div>
            {nutrientInfo.clinicalNote && (
              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                <span className="font-medium">Clinical Note:</span> {nutrientInfo.clinicalNote}
              </div>
            )}
            {prediction.note && (
              <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                <span className="font-medium">Note:</span> {prediction.note}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}