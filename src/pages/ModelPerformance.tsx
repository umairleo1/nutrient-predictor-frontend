import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend, ScatterChart, Scatter, ReferenceLine, RadialBarChart, RadialBar 
} from 'recharts';
import { 
  TrendingUp, Activity, Target, AlertCircle, CheckCircle, Brain, 
  Database, Settings, BarChart3, LineChart as LineChartIcon, 
  Zap, Shield, Award, ArrowLeft, ArrowRight, Info, Heart
} from 'lucide-react';
import Header from '../components/layout/Header';

interface ModelMetrics {
  nutrients: string[];
  features: string[];
  performance: {
    [key: string]: {
      auc: number;
      calibrated_auc: number;
      brier_original: number;
      brier_calibrated: number;
      pr_auc: number;
      cv_mean: number;
      cv_std: number;
      train_auc: number;
      overfitting: number;
      deficient_count: number;
      total_count: number;
      scale_pos_weight: number;
      evaluation_details: {
        precision: number;
        recall: number;
        f1: number;
        calibration_data: {
          fraction_positives: number[];
          mean_predicted: number[];
        };
        confusion_matrix: {
          true_negative: number;
          false_positive: number;
          false_negative: number;
          true_positive: number;
        };
        specificity: number;
        sensitivity: number;
        threshold_performance: Array<{
          threshold: number;
          precision: number;
          recall: number;
        }>;
      };
    };
  };
  model_type: string;
  n_samples: number;
  n_features: number;
}

export default function ModelPerformance() {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>('iron_deficient');
  const [animatedValues, setAnimatedValues] = useState(false);

  useEffect(() => {
    // Load model metadata from the backend
    fetch('/api/model-metadata')
      .then(res => res.json())
      .then(data => {
        setMetrics(data);
        setLoading(false);
        setTimeout(() => setAnimatedValues(true), 100);
      })
      .catch(() => {
        // Fallback to loading from static file if backend endpoint doesn't exist
        fetch('/models/model_metadata.json')
          .then(res => res.json())
          .then(data => {
            setMetrics(data);
            setLoading(false);
            setTimeout(() => setAnimatedValues(true), 100);
          })
          .catch(() => {
            // Use sample data for demonstration
            setMetrics(sampleMetrics);
            setLoading(false);
            setTimeout(() => setAnimatedValues(true), 100);
          });
      });
  }, []);

  const sampleMetrics: ModelMetrics = {
    nutrients: ["b12_deficient", "iron_deficient", "diabetes_risk"],
    features: ["RIDAGEYR", "RIAGENDR", "RIDRETH3", "BMXWT", "BMXHT", "BMXBMI"],
    performance: {
      b12_deficient: {
        auc: 0.758,
        calibrated_auc: 0.785,
        brier_original: 0.374,
        brier_calibrated: 0.011,
        pr_auc: 0.026,
        cv_mean: 0.777,
        cv_std: 0.022,
        train_auc: 0.883,
        overfitting: 0.125,
        deficient_count: 109,
        total_count: 9813,
        scale_pos_weight: 89.0,
        evaluation_details: {
          precision: 0.023,
          recall: 0.909,
          f1: 0.045,
          calibration_data: { fraction_positives: [], mean_predicted: [] },
          confusion_matrix: { true_negative: 1085, false_positive: 856, false_negative: 2, true_positive: 20 },
          specificity: 0.559,
          sensitivity: 0.909,
          threshold_performance: []
        }
      },
      iron_deficient: {
        auc: 0.809,
        calibrated_auc: 0.810,
        brier_original: 0.170,
        brier_calibrated: 0.109,
        pr_auc: 0.397,
        cv_mean: 0.802,
        cv_std: 0.011,
        train_auc: 0.884,
        overfitting: 0.075,
        deficient_count: 1510,
        total_count: 9813,
        scale_pos_weight: 5.5,
        evaluation_details: {
          precision: 0.358,
          recall: 0.725,
          f1: 0.479,
          calibration_data: { fraction_positives: [], mean_predicted: [] },
          confusion_matrix: { true_negative: 1268, false_positive: 393, false_negative: 83, true_positive: 219 },
          specificity: 0.763,
          sensitivity: 0.725,
          threshold_performance: []
        }
      },
      diabetes_risk: {
        auc: 0.517,
        calibrated_auc: 0.509,
        brier_original: 0.248,
        brier_calibrated: 0.083,
        pr_auc: 0.092,
        cv_mean: 0.508,
        cv_std: 0.015,
        train_auc: 0.580,
        overfitting: 0.063,
        deficient_count: 888,
        total_count: 9813,
        scale_pos_weight: 10.1,
        evaluation_details: {
          precision: 0.090,
          recall: 0.404,
          f1: 0.147,
          calibration_data: { fraction_positives: [], mean_predicted: [] },
          confusion_matrix: { true_negative: 1057, false_positive: 728, false_negative: 106, true_positive: 72 },
          specificity: 0.592,
          sensitivity: 0.404,
          threshold_performance: []
        }
      }
    },
    model_type: "XGBoost",
    n_samples: 9813,
    n_features: 20
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto mt-2 ml-2"></div>
          </div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Loading model insights...</p>
          <p className="mt-2 text-sm text-gray-500">Analyzing performance metrics</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl p-8 shadow-lg border border-red-100">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Data</h3>
          <p className="text-gray-600">Model performance data is currently unavailable</p>
        </div>
      </div>
    );
  }

  const currentModel = metrics.performance[selectedModel];
  const modelDisplayNames = {
    b12_deficient: 'Vitamin B12 Deficiency',
    iron_deficient: 'Iron Deficiency/Anemia',
    diabetes_risk: 'Diabetes Risk'
  };

  const modelColors = {
    b12_deficient: { primary: '#10B981', secondary: '#D1FAE5', accent: '#059669' },
    iron_deficient: { primary: '#3B82F6', secondary: '#DBEAFE', accent: '#2563EB' },
    diabetes_risk: { primary: '#F59E0B', secondary: '#FEF3C7', accent: '#D97706' }
  };

  const currentColors = modelColors[selectedModel as keyof typeof modelColors];

  // Prepare data for performance comparison chart
  const performanceData = Object.keys(metrics.performance).map(key => ({
    model: modelDisplayNames[key as keyof typeof modelDisplayNames] || key,
    AUC: metrics.performance[key].auc,
    'Calibrated AUC': metrics.performance[key].calibrated_auc,
    'CV Mean': metrics.performance[key].cv_mean,
    Precision: metrics.performance[key].evaluation_details.precision,
    Recall: metrics.performance[key].evaluation_details.recall,
    'F1-Score': metrics.performance[key].evaluation_details.f1
  }));

  // Prepare confusion matrix data for visualization
  const confusionData = [
    { name: 'True Positive', value: currentModel.evaluation_details.confusion_matrix.true_positive, color: '#10B981', emoji: '✅' },
    { name: 'True Negative', value: currentModel.evaluation_details.confusion_matrix.true_negative, color: '#3B82F6', emoji: '✅' },
    { name: 'False Positive', value: currentModel.evaluation_details.confusion_matrix.false_positive, color: '#F59E0B', emoji: '⚠️' },
    { name: 'False Negative', value: currentModel.evaluation_details.confusion_matrix.false_negative, color: '#EF4444', emoji: '❌' }
  ];

  // Class imbalance data
  const classData = [
    { 
      name: 'Positive Cases', 
      value: currentModel.deficient_count, 
      color: currentColors.primary, 
      percentage: (currentModel.deficient_count / currentModel.total_count * 100).toFixed(1) 
    },
    { 
      name: 'Negative Cases', 
      value: currentModel.total_count - currentModel.deficient_count, 
      color: '#E5E7EB', 
      percentage: ((currentModel.total_count - currentModel.deficient_count) / currentModel.total_count * 100).toFixed(1) 
    }
  ];

  // Performance score for radial chart
  const performanceScore = [
    {
      name: 'AUC Score',
      value: currentModel.auc * 100,
      fill: currentColors.primary
    }
  ];

  const getPerformanceLevel = (auc: number) => {
    if (auc >= 0.9) return { level: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (auc >= 0.8) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    if (auc >= 0.7) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { level: 'Poor', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const performanceLevel = getPerformanceLevel(currentModel.auc);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-xl">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.dataKey}:</span> {typeof entry.value === 'number' ? entry.value.toFixed(3) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const navigateBack = () => {
    // Use browser's back functionality to return to previous page
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        connectionStatus="connected"
        showModelPerformance={false}
      />

      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={navigateBack}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Back to Results</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Model Selection Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Select Model for Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.keys(metrics.performance).map((key, index) => {
              const model = metrics.performance[key];
              const isSelected = selectedModel === key;
              const colors = modelColors[key as keyof typeof modelColors];
              
              return (
                <div
                  key={key}
                  className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    isSelected ? 'scale-105' : 'hover:shadow-xl'
                  }`}
                  onClick={() => setSelectedModel(key)}
                >
                  <div className={`relative bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 ${
                    isSelected 
                      ? `border-${colors.primary.replace('#', '')} shadow-2xl` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                        isSelected ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gray-100'
                      } transition-all duration-300`}>
                        {key === 'b12_deficient' && <Zap className={`h-8 w-8 ${isSelected ? 'text-white' : 'text-gray-600'}`} />}
                        {key === 'iron_deficient' && <Shield className={`h-8 w-8 ${isSelected ? 'text-white' : 'text-gray-600'}`} />}
                        {key === 'diabetes_risk' && <Activity className={`h-8 w-8 ${isSelected ? 'text-white' : 'text-gray-600'}`} />}
                      </div>
                      
                      <h3 className={`font-semibold mb-2 transition-colors duration-300 ${
                        isSelected ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {modelDisplayNames[key as keyof typeof modelDisplayNames]}
                      </h3>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">AUC Score</span>
                          <span className={`font-bold ${isSelected ? colors.accent : 'text-gray-700'}`}>
                            {(model.auc * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">F1-Score</span>
                          <span className={`font-bold ${isSelected ? colors.accent : 'text-gray-700'}`}>
                            {(model.evaluation_details.f1 * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* AUC Score Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${currentColors.secondary} group-hover:scale-110 transition-transform duration-300`}>
                <TrendingUp className={`h-6 w-6 text-${currentColors.accent}`} style={{ color: currentColors.accent }} />
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${performanceLevel.bg} ${performanceLevel.color} ${performanceLevel.border} border`}>
                {performanceLevel.level}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Test AUC</p>
              <p className="text-3xl font-bold text-gray-900">
                {animatedValues ? (currentModel.auc * 100).toFixed(1) : '0.0'}%
              </p>
              <p className="text-xs text-gray-500">Area Under ROC Curve</p>
            </div>
          </div>

          {/* Calibrated AUC Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Target className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
                Improved
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Calibrated AUC</p>
              <p className="text-3xl font-bold text-gray-900">
                {animatedValues ? (currentModel.calibrated_auc * 100).toFixed(1) : '0.0'}%
              </p>
              <p className="text-xs text-gray-500">Post-calibration performance</p>
            </div>
          </div>

          {/* Overfitting Card */}
          <div className={`bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 ${
                currentModel.overfitting > 0.1 ? 'bg-red-50' : 'bg-green-50'
              }`}>
                <AlertCircle className={`h-6 w-6 ${
                  currentModel.overfitting > 0.1 ? 'text-red-600' : 'text-green-600'
                }`} />
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                currentModel.overfitting > 0.1 
                  ? 'bg-red-50 text-red-700 border-red-200' 
                  : 'bg-green-50 text-green-700 border-green-200'
              }`}>
                {currentModel.overfitting > 0.1 ? 'High' : 'Low'}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Overfitting</p>
              <p className={`text-3xl font-bold ${
                currentModel.overfitting > 0.1 ? 'text-red-600' : 'text-green-600'
              }`}>
                {animatedValues ? (currentModel.overfitting * 100).toFixed(1) : '0.0'}%
              </p>
              <p className="text-xs text-gray-500">Train AUC - Test AUC</p>
            </div>
          </div>

          {/* F1-Score Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                Balanced
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">F1-Score</p>
              <p className="text-3xl font-bold text-gray-900">
                {animatedValues ? (currentModel.evaluation_details.f1 * 100).toFixed(1) : '0.0'}%
              </p>
              <p className="text-xs text-gray-500">Harmonic mean of precision & recall</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Performance Radar Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Overview</h3>
              <p className="text-sm text-gray-600">Comprehensive model metrics</p>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="80%" data={performanceScore}>
                  <RadialBar 
                    dataKey="value" 
                    cornerRadius={10} 
                    fill={currentColors.primary}
                    stroke={currentColors.accent}
                    strokeWidth={2}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            
            {/* AUC Score Display */}
            <div className="text-center mt-4">
              <div className="text-3xl font-bold text-gray-900">
                {(currentModel.auc * 100).toFixed(1)}%
              </div>
              <div className="text-sm font-medium text-gray-600 mt-1">
                AUC Score
              </div>
            </div>
          </div>

          {/* Class Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Distribution</h3>
              <p className="text-sm text-gray-600">Class imbalance analysis</p>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    strokeWidth={2}
                    stroke="#fff"
                  >
                    {classData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <Info className="h-4 w-4 text-yellow-600" />
                <p className="text-sm font-medium text-yellow-800">Class Imbalance Handling</p>
              </div>
              <p className="text-xs text-yellow-700">
                Ratio: 1:{Math.round(currentModel.scale_pos_weight)} | 
                Scale Weight: {currentModel.scale_pos_weight.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Model Comparison Chart */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Model Comparison</h3>
              <p className="text-gray-600">Performance metrics across all models</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex-shrink-0">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          
          {/* Performance Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {Object.keys(metrics.performance).map((key, index) => {
              const model = metrics.performance[key];
              const modelName = modelDisplayNames[key as keyof typeof modelDisplayNames] || key;
              const colors = modelColors[key as keyof typeof modelColors];
              const isCurrentModel = selectedModel === key;
              
              return (
                <div 
                  key={key} 
                  className={`bg-gradient-to-br from-gray-50 to-white border-2 rounded-xl p-6 transition-all duration-300 ${
                    isCurrentModel 
                      ? 'border-blue-200 shadow-lg scale-105' 
                      : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`font-bold text-gray-900 ${isCurrentModel ? 'text-blue-700' : ''}`}>
                      {modelName}
                    </h4>
                    {isCurrentModel && (
                      <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        Selected
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">AUC Score</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-12 h-2 bg-gray-200 rounded-full overflow-hidden`}>
                          <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000"
                            style={{ width: `${model.auc * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {(model.auc * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Precision</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-12 h-2 bg-gray-200 rounded-full overflow-hidden`}>
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                            style={{ width: `${model.evaluation_details.precision * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {(model.evaluation_details.precision * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Recall</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-12 h-2 bg-gray-200 rounded-full overflow-hidden`}>
                          <div 
                            className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-1000"
                            style={{ width: `${model.evaluation_details.recall * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {(model.evaluation_details.recall * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">F1-Score</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-12 h-2 bg-gray-200 rounded-full overflow-hidden`}>
                          <div 
                            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000"
                            style={{ width: `${model.evaluation_details.f1 * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {(model.evaluation_details.f1 * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Total Samples: {model.total_count.toLocaleString()}</span>
                      <span>Positive Cases: {model.deficient_count.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Detailed Performance Metrics</h3>
              <p className="text-gray-600">Comprehensive evaluation results for {modelDisplayNames[selectedModel as keyof typeof modelDisplayNames]}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider rounded-l-lg">
                    Metric
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider rounded-r-lg">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  {
                    metric: 'Test AUC',
                    value: currentModel.auc.toFixed(4),
                    description: 'Area under ROC curve on test set',
                    color: 'text-blue-600'
                  },
                  {
                    metric: 'Cross-Validation AUC',
                    value: `${currentModel.cv_mean.toFixed(4)} ± ${currentModel.cv_std.toFixed(4)}`,
                    description: '5-fold CV performance with standard deviation',
                    color: 'text-green-600'
                  },
                  {
                    metric: 'Precision',
                    value: `${(currentModel.evaluation_details.precision * 100).toFixed(2)}%`,
                    description: 'True Positives / (True Positives + False Positives)',
                    color: 'text-purple-600'
                  },
                  {
                    metric: 'Recall (Sensitivity)',
                    value: `${(currentModel.evaluation_details.recall * 100).toFixed(2)}%`,
                    description: 'True Positives / (True Positives + False Negatives)',
                    color: 'text-orange-600'
                  },
                  {
                    metric: 'Specificity',
                    value: `${(currentModel.evaluation_details.specificity * 100).toFixed(2)}%`,
                    description: 'True Negatives / (True Negatives + False Positives)',
                    color: 'text-teal-600'
                  },
                  {
                    metric: 'F1-Score',
                    value: `${(currentModel.evaluation_details.f1 * 100).toFixed(2)}%`,
                    description: 'Harmonic mean of precision and recall',
                    color: 'text-indigo-600'
                  },
                  {
                    metric: 'Brier Score (Original)',
                    value: currentModel.brier_original.toFixed(4),
                    description: 'Mean squared difference between predicted and actual probabilities',
                    color: 'text-red-600'
                  },
                  {
                    metric: 'Brier Score (Calibrated)',
                    value: currentModel.brier_calibrated.toFixed(4),
                    description: 'Brier score after probability calibration',
                    color: 'text-emerald-600'
                  },
                  {
                    metric: 'PR-AUC',
                    value: currentModel.pr_auc.toFixed(4),
                    description: 'Area under Precision-Recall curve (better for imbalanced data)',
                    color: 'text-pink-600'
                  }
                ].map((row, index) => (
                  <tr key={row.metric} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {row.metric}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${row.color}`}>
                      {row.value}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical Implementation Notes */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 shadow-xl border border-gray-100 mb-12">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Technical Implementation</h3>
            <p className="text-gray-600">Model architecture and optimization techniques</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-blue-600" />
                  Model Architecture
                </h4>
                <ul className="space-y-3 text-gray-700">
                  {[
                    { text: `Algorithm: ${metrics.model_type} Classifier` },
                    { text: `Features: ${metrics.n_features} NHANES variables` },
                    { text: `Training samples: ${metrics.n_samples.toLocaleString()}` },
                    { text: 'Cross-validation: 5-fold stratified' }
                  ].map((item, index) => (
                    <li key={index} className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                      <span className="text-sm font-medium">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                  Model Improvements
                </h4>
                <ul className="space-y-3 text-gray-700">
                  {[
                    { text: 'SMOTE for B12 class balancing' },
                    { text: 'Regularization for diabetes overfitting' },
                    { text: 'Probability calibration (Platt scaling)' },
                    { text: 'Hyperparameter optimization' }
                  ].map((item, index) => (
                    <li key={index} className="p-3 bg-white rounded-lg border border-gray-200 hover:border-yellow-300 transition-colors duration-200">
                      <span className="text-sm font-medium">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h5 className="font-semibold text-blue-900 mb-2">Research Context & Limitations</h5>
                <p className="text-sm text-blue-800 leading-relaxed">
                  These models were developed for educational and research purposes using NHANES 2013-2014 data. 
                  Performance varies significantly across demographic groups and clinical contexts. The models should 
                  not be used for clinical diagnosis without proper validation and healthcare provider oversight. 
                  Results represent population-level patterns and may not apply to individual cases.
                </p>
              </div>
            </div>
          </div>
        </div>

        </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Brand Section */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 rounded-2xl shadow-md">
                    <div className="bg-white/10 rounded-xl p-1.5 backdrop-blur-sm">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full p-1">
                    <Target className="h-2.5 w-2.5 text-white" />
                  </div>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">NDP</span>
              </div>
              <p className="text-gray-300 text-sm text-center md:text-left mb-3">
                AI-powered nutrition insights based on clinical research and population health data.
              </p>
              <div className="text-center md:text-left">
                <p className="text-primary-300 text-sm font-medium">Presented by Muhammad Umair</p>
              </div>
            </div>

            {/* Info Section */}
            <div className="text-center">
              <h3 className="font-semibold text-white mb-4">About This System</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>Built with XGBoost & SHAP</p>
                <p>NHANES 2013-2014 Dataset</p>
                <p>Clinical Decision Support</p>
                <p>Educational & Research Use</p>
              </div>
            </div>

            {/* Legal Section */}
            <div className="text-center md:text-right">
              <h3 className="font-semibold text-white mb-4">Important Notice</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>Not intended as medical advice</p>
                <p>Consult healthcare professionals</p>
                <p>For educational purposes only</p>
                <p>© 2025 Research Project</p>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-xs text-gray-400">
              This is a demonstration system for machine learning in healthcare. 
              Always consult qualified healthcare professionals for medical decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}