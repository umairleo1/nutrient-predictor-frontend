import { useState, useEffect } from 'react';
import { Loader2, Heart, Target } from 'lucide-react';
import Header from './components/layout/Header';
import UserInputForm from './components/forms/UserInputForm';
import PredictionResults from './components/results/PredictionResults';
import ModelPerformance from './pages/ModelPerformance';
import { UserProfile, PredictionResponse, LoadingState } from './types';
import { predictNutrientDeficiencies, healthCheck } from './services/api';

function App() {
  const [results, setResults] = useState<PredictionResponse | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    error: null
  });
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [showForm, setShowForm] = useState(true);
  const [currentPage, setCurrentPage] = useState<'main' | 'model-performance'>('main');

  // Check backend connection on component mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      setConnectionStatus('checking');
      const healthResult = await healthCheck();
      
      if (healthResult.models_loaded) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
        setLoadingState({
          isLoading: false,
          error: 'Backend models are not loaded. Please ensure the backend is properly set up with trained models.'
        });
      }
    } catch (error) {
      console.error('Backend connection failed:', error);
      setConnectionStatus('error');
      setLoadingState({
        isLoading: false,
        error: 'Cannot connect to backend. Please ensure the backend server is running on port 8000.'
      });
    }
  };

  const handleFormSubmit = async (profile: UserProfile) => {
    setLoadingState({ isLoading: true, error: null });
    
    try {
      const predictionResults = await predictNutrientDeficiencies(profile);
      
      setResults(predictionResults);
      setShowForm(false);
      setLoadingState({ isLoading: false, error: null });
      
      // Scroll to top to show results
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Prediction error:', error);
      let errorMessage = 'An unexpected error occurred while processing your request.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      setLoadingState({
        isLoading: false,
        error: errorMessage
      });
    }
  };

  const handleStartOver = () => {
    setResults(null);
    setShowForm(true);
    setLoadingState({ isLoading: false, error: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  // Handle navigation
  useEffect(() => {
    const handleNavigation = () => {
      const path = window.location.pathname;
      if (path === '/model-performance') {
        setCurrentPage('model-performance');
      } else {
        setCurrentPage('main');
      }
    };

    handleNavigation();
    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  const navigateToModelPerformance = () => {
    window.history.pushState({}, '', '/model-performance');
    setCurrentPage('model-performance');
  };


  if (currentPage === 'model-performance') {
    return <ModelPerformance />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        connectionStatus={connectionStatus}
        onRetryConnection={checkBackendConnection}
        showModelPerformance={!!results && !showForm}
        onNavigateToModelPerformance={navigateToModelPerformance}
      />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        

        {/* Compact Welcome Section */}
        {showForm && !results && (
          <div className="text-center mb-6 animate-fadeIn">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Get Your Personalized Nutrition Analysis
            </h1>
            <p className="text-gray-600 max-w-lg mx-auto text-sm mb-4">
              AI-powered nutrient deficiency prediction using NHANES population health data
            </p>
            
            {/* Compact Features */}
            <div className="flex justify-center items-center space-x-6 text-xs text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>AI Analysis</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>SHAP Insights</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Personalized</span>
              </div>
            </div>
          </div>
        )}

        {/* Form or Results */}
        {showForm ? (
          <UserInputForm
            onSubmit={handleFormSubmit}
            isLoading={loadingState.isLoading}
            error={loadingState.error}
          />
        ) : results ? (
          <PredictionResults
            results={results}
            onStartOver={handleStartOver}
          />
        ) : null}

        {/* Loading Overlay */}
        {loadingState.isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4">
              <div className="flex items-center space-x-4">
                <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                <div>
                  <h3 className="font-semibold text-gray-900">Analyzing Your Profile</h3>
                  <p className="text-sm text-gray-600">
                    Our AI models are processing your data to provide personalized insights...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
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
                <p className="text-primary-300 text-sm font-medium">
                  Presented by{' '}
                  <a 
                    href="https://www.linkedin.com/in/muhammad-umair-amin/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-200 underline transition-colors duration-200"
                  >
                    Muhammad Umair
                  </a>
                </p>
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

export default App;