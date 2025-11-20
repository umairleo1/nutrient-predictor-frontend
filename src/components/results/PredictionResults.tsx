import { Activity, TrendingUp, Heart, ArrowLeft, Info, AlertTriangle } from 'lucide-react';
import { PredictionResponse } from '../../types';
import RiskScore from './RiskScore';
import FeatureImportance from './FeatureImportance';
import Recommendations from './Recommendations';
import { getHealthScoreColor } from '../../constants/colors';

interface PredictionResultsProps {
  results: PredictionResponse;
  onStartOver?: () => void;
  className?: string;
}

export default function PredictionResults({ results, onStartOver, className = '' }: PredictionResultsProps) {
  const overallScore = Math.round(results.overall_health_score * 100);
  
  // Generate intelligent summary text
  const getSummaryText = (
    results: PredictionResponse, 
    overallScore: number, 
    highRiskNutrients: number, 
    moderateRiskNutrients: number
  ): string => {
    const totalRiskNutrients = highRiskNutrients + moderateRiskNutrients;
    void totalRiskNutrients; // Use it to prevent unused variable warning
    
    if (highRiskNutrients > 0) {
      const highRiskNames = results.predictions
        .filter(p => p.risk_category === 'High')
        .map(p => p.nutrient.toLowerCase().replace(' risk', ''))
        .join(' and ');
      
      return `Your results indicate ${highRiskNutrients > 1 ? 'elevated risks' : 'elevated risk'} for ${highRiskNames} deficiency. ${
        moderateRiskNutrients > 0 ? `Additionally, there ${moderateRiskNutrients === 1 ? 'is' : 'are'} ${moderateRiskNutrients} moderate-risk ${moderateRiskNutrients === 1 ? 'nutrient' : 'nutrients'} to monitor. ` : ''
      }Consider discussing these findings with your healthcare provider for personalized guidance.`;
    } else if (moderateRiskNutrients > 0) {
      const moderateRiskNames = results.predictions
        .filter(p => p.risk_category === 'Moderate')
        .map(p => p.nutrient.toLowerCase().replace(' risk', ''))
        .join(' and ');
        
      return `You have good overall nutritional health, with ${moderateRiskNutrients === 1 ? 'one area' : 'some areas'} to monitor: ${moderateRiskNutrients === 1 ? 'a' : ''} moderate predicted risk${moderateRiskNutrients === 1 ? '' : 's'} of ${moderateRiskNames}. Following the dietary recommendations below may help reduce ${moderateRiskNutrients === 1 ? 'this risk' : 'these risks'}.`;
    } else {
      return `Excellent news! Your results indicate very low risk across all measured nutrients. Your nutritional profile appears well-balanced. Continue your current healthy lifestyle and consider the maintenance recommendations below.`;
    }
  };
  
  // Get overall health score level
  const getOverallLevel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const overallLevel = getOverallLevel(overallScore);
  const overallColors = getHealthScoreColor(overallScore);

  const highRiskNutrients = results.predictions.filter(p => p.risk_category === 'High').length;
  const moderateRiskNutrients = results.predictions.filter(p => p.risk_category === 'Moderate').length;

  return (
    <div className={`space-y-6 animate-fadeIn ${className}`}>
      {/* Header with Start Over Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-50 rounded-lg border border-primary-200">
            <Activity className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Nutrition Analysis</h2>
            <p className="text-gray-600">Complete AI-powered assessment results</p>
          </div>
        </div>
        
        {onStartOver && (
          <button
            onClick={onStartOver}
            className="btn btn-secondary btn-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Start Over
          </button>
        )}
      </div>

      {/* Quick Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-blue-100 rounded-full">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 mb-2">Summary</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              {getSummaryText(results, overallScore, highRiskNutrients, moderateRiskNutrients)}
            </p>
          </div>
        </div>
      </div>

      {/* Critical Experimental Warning Banner */}
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-red-900 font-semibold text-sm">
              ⚠️ <strong>Important:</strong> Iron and B12 models provide useful screening insights. Diabetes model has limited accuracy. 
              Do not use for medical diagnosis. Consult healthcare providers for definitive testing.
            </p>
          </div>
        </div>
      </div>

      {/* Overall Health Score Banner */}
      <div className={`rounded-lg p-6 border ${overallColors.bg} ${overallColors.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <Heart className={`h-8 w-8 ${overallColors.text}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Model Confidence Score</h3>
              <p className="text-gray-600 text-sm">(Experimental) - AI model confidence, not clinical wellness</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold text-gray-900">{overallScore}</span>
              <span className="text-lg text-gray-500">/100</span>
            </div>
            <p className={`text-sm font-medium ${overallColors.text}`}>{overallLevel}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">
                {results.predictions.filter(p => p.risk_category === 'Low').length}
              </div>
              <div className="text-xs text-gray-600">Low Risk</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600">
                {moderateRiskNutrients}
              </div>
              <div className="text-xs text-gray-600">Moderate Risk</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">
                {highRiskNutrients}
              </div>
              <div className="text-xs text-gray-600">High Risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Scores Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary-600" />
          <span>Nutrient Deficiency Risk Assessment</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.predictions.map((prediction) => (
            <RiskScore 
              key={prediction.nutrient} 
              prediction={prediction}
              className="animate-slideUp"
            />
          ))}
        </div>
      </div>

      {/* Feature Importance */}
      {results.top_features && results.top_features.length > 0 && (
        <FeatureImportance 
          features={results.top_features}
          className="animate-slideUp"
        />
      )}

      {/* Recommendations */}
      <Recommendations 
        recommendations={results.recommendations}
        className="animate-slideUp"
      />

      {/* Enhanced Clinical Disclaimer */}
      <div className="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="p-2 bg-red-100 rounded-full">
              <Heart className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-800 mb-2">⚠️ IMPORTANT MEDICAL DISCLAIMER</h3>
            <div className="space-y-2 text-xs text-red-700">
              <p><strong>This is NOT medical advice.</strong> These predictions are experimental and for educational purposes only.</p>
              <p><strong>DO NOT use these results to make medical decisions</strong> without consulting qualified healthcare professionals.</p>
              <p><strong>AI limitations:</strong> Machine learning models can be inaccurate and may not account for individual medical conditions, medications, or other health factors.</p>
              <p><strong>Clinical validation required:</strong> Any suspected nutrient deficiencies should be confirmed through proper laboratory testing ordered by your healthcare provider.</p>
              <p className="pt-2 border-t border-red-300">
                <strong>Data source:</strong> NHANES 2013-2014 dataset. Model accuracy varies significantly by nutrient and population subgroups. 
                Calibrated probabilities include uncertainty estimates but do not guarantee clinical accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}