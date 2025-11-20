import { Activity, Heart, Wifi, WifiOff, Loader2, Zap, Target, TrendingUp } from 'lucide-react';

interface HeaderProps {
  className?: string;
  connectionStatus?: 'checking' | 'connected' | 'error';
  onRetryConnection?: () => void;
  showModelPerformance?: boolean;
  onNavigateToModelPerformance?: () => void;
}

export default function Header({ className = '', connectionStatus = 'connected', onRetryConnection, showModelPerformance = false, onNavigateToModelPerformance }: HeaderProps) {
  return (
    <header className={`bg-gradient-to-r from-white to-gray-50 shadow-lg border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 rounded-3xl shadow-lg transform rotate-12">
                  <div className="bg-white/20 rounded-2xl p-2 backdrop-blur-sm transform -rotate-12">
                    <div className="relative">
                      <Heart className="h-6 w-6 text-white" />
                      <Zap className="h-3 w-3 text-yellow-300 absolute -top-1 -right-1" />
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full p-1.5 shadow-md">
                  <Target className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Nutrient Deficiency Predictor
              </h1>
              <p className="text-sm text-gray-600 hidden sm:block font-medium">
                AI-powered personalized nutrition recommendations
              </p>
            </div>
          </div>

          {/* Status/Action Area */}
          <div className="flex items-center space-x-3">
            {/* Model Performance Button (when results are shown) */}
            {showModelPerformance && (
              <button
                onClick={onNavigateToModelPerformance || (() => window.open('/model-performance', '_blank'))}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors"
              >
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Model Performance</span>
              </button>
            )}
            
            {/* Connection Status (when no results) */}
            {!showModelPerformance && (
              <>
                {connectionStatus === 'checking' && (
                  <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full">
                    <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-700">Connecting...</span>
                  </div>
                )}
                
                {connectionStatus === 'connected' && (
                  <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                    <Wifi className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Connected</span>
                  </div>
                )}
                
                {connectionStatus === 'error' && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full">
                      <WifiOff className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-700">Disconnected</span>
                    </div>
                    {onRetryConnection && (
                      <button 
                        onClick={onRetryConnection}
                        className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 underline hover:no-underline transition-colors"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}