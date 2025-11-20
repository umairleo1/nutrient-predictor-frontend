import { 
  Heart, 
  AlertCircle, 
  Info, 
  CheckCircle,
  Stethoscope,
  Utensils,
  User
} from 'lucide-react';
import { Recommendation } from '../../types';
import { getCategoryColor } from '../../constants/colors';

interface RecommendationsProps {
  recommendations: Recommendation[];
  className?: string;
}

export default function Recommendations({ recommendations, className = '' }: RecommendationsProps) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'medical':
        return Stethoscope;
      case 'dietary':
        return Utensils;
      case 'lifestyle':
        return User;
      default:
        return Info;
    }
  };

  // Use centralized color functions

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return AlertCircle;
      case 'medium':
        return Info;
      case 'low':
        return CheckCircle;
      default:
        return Info;
    }
  };

  // Group recommendations by priority
  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    if (!acc[rec.priority]) {
      acc[rec.priority] = [];
    }
    acc[rec.priority].push(rec);
    return acc;
  }, {} as Record<string, Recommendation[]>);

  // Sort priorities by importance
  const priorityOrder = ['High', 'Medium', 'Low'];
  const sortedPriorities = Object.keys(groupedRecommendations).sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a);
    const bIndex = priorityOrder.indexOf(b);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-50 rounded-lg border border-green-200">
            <Heart className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Personalized Recommendations</h3>
            <p className="text-sm text-gray-500">
              Evidence-based suggestions to improve your nutritional health
            </p>
          </div>
        </div>
      </div>

      <div className="card-content">
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Great News!</h4>
            <p className="text-gray-600">
              Your nutritional profile looks good. Keep maintaining your healthy lifestyle!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedPriorities.map((priority) => {
              const priorityRecs = groupedRecommendations[priority];
              // const priorityColor = getPriorityColor(priority);
              const PriorityIcon = getPriorityIcon(priority);

              return (
                <div key={priority}>
                  {/* Priority Header */}
                  <div className="flex items-center space-x-2 mb-4">
                    <PriorityIcon className={`h-5 w-5 ${priority === 'High' ? 'text-red-600' : priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`} />
                    <h4 className="font-bold text-gray-900 text-lg">
                      {priority} Priority
                    </h4>
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-xs text-gray-500">{priorityRecs.length} item{priorityRecs.length !== 1 ? 's' : ''}</span>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-3">
                    {priorityRecs.map((rec, index) => {
                      const CategoryIcon = getCategoryIcon(rec.category);
                      const categoryColor = getCategoryColor(rec.category);
                      
                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-2 ${priority === 'High' ? 'border-red-200 bg-red-50' : priority === 'Medium' ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'}`}
                        >
                          <div className="flex items-start space-x-3">
                            {/* Category Badge */}
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${categoryColor}`}>
                              <CategoryIcon className="h-3 w-3 mr-1" />
                              {rec.category}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              {/* Recommendation Text */}
                              <p className={`text-sm font-bold mb-2 ${priority === 'High' ? 'text-red-800' : priority === 'Medium' ? 'text-yellow-800' : 'text-green-800'}`}>
                                {rec.recommendation}
                              </p>
                              
                              {/* Rationale */}
                              <p className="text-xs text-gray-700">
                                <span className="font-medium">Why:</span> {rec.rationale}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-amber-800 font-medium mb-1">Important Disclaimer</p>
                  <p className="text-amber-700 text-xs leading-relaxed">
                    These recommendations are generated by AI based on population data and should not replace 
                    professional medical advice. Always consult with qualified healthcare providers before making 
                    significant changes to your diet, lifestyle, or starting new supplements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}