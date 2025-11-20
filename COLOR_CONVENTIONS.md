# Color Conventions Documentation

## Overview
This document outlines the consistent color conventions used throughout the Nutrient Deficiency Predictor application.

## Color Standards

### Risk Levels
| Risk Level | Background | Border | Text | Icon | Chart Color | Bar Color |
|------------|------------|--------|------|------|-------------|-----------|
| **Low**    | `bg-green-50` | `border-green-200` | `text-green-800` | `text-green-600` | `#22c55e` | `bg-green-500` |
| **Moderate** | `bg-yellow-50` | `border-yellow-200` | `text-yellow-800` | `text-yellow-600` | `#eab308` | `bg-yellow-500` |
| **High**   | `bg-red-50` | `border-red-200` | `text-red-800` | `text-red-600` | `#ef4444` | `bg-red-500` |

### Health Score Levels
| Score Range | Level | Background | Border | Text Color |
|-------------|-------|------------|--------|------------|
| 80-100      | Excellent | `bg-green-50` | `border-green-200` | `text-green-600` |
| 60-79       | Good | `bg-blue-50` | `border-blue-200` | `text-blue-600` |
| 40-59       | Fair | `bg-yellow-50` | `border-yellow-200` | `text-yellow-600` |
| 0-39        | Needs Attention | `bg-red-50` | `border-red-200` | `text-red-600` |

### Recommendation Categories
| Category | Background | Border | Text | Icon |
|----------|------------|--------|------|------|
| **Medical** | `bg-blue-50` | `border-blue-200` | `text-blue-800` | `text-blue-600` |
| **Dietary** | `bg-green-50` | `border-green-200` | `text-green-800` | `text-green-600` |
| **Lifestyle** | `bg-purple-50` | `border-purple-200` | `text-purple-800` | `text-purple-600` |

### Priority Levels
| Priority | Badge Classes |
|----------|---------------|
| **High** | `bg-red-100 text-red-800 border-red-200` |
| **Medium** | `bg-yellow-100 text-yellow-800 border-yellow-200` |
| **Low** | `bg-gray-100 text-gray-800 border-gray-200` |

### SHAP Chart Colors
| Factor Type | Color | Hex Code | Meaning |
|-------------|-------|----------|---------|
| **Positive Impact** | Red | `#ef4444` | Increases deficiency risk |
| **Negative Impact** | Green | `#22c55e` | Decreases deficiency risk (protective) |
| **Reference Line** | Gray | `#94a3b8` | Neutral baseline |

### Connection Status
| Status | Text Color |
|--------|------------|
| **Checking** | `text-yellow-600` |
| **Connected** | `text-green-600` |
| **Error** | `text-red-600` |

## Implementation

### Centralized Colors
All colors are defined in `/src/constants/colors.ts` with helper functions:
- `getRiskColor(category)` - Gets risk level colors
- `getHealthScoreColor(score)` - Gets health score colors  
- `getCategoryColor(category)` - Gets recommendation category colors
- `getPriorityColor(priority)` - Gets priority level colors
- `getSHAPColor(isPositive)` - Gets SHAP chart colors

### Components Using Colors
- **RiskScore.tsx** - Risk level indicators and progress bars
- **PredictionResults.tsx** - Overall health score banner
- **FeatureImportance.tsx** - SHAP chart bars and tooltips
- **Recommendations.tsx** - Category and priority badges
- **Header.tsx** - Status indicators
- **App.tsx** - Connection status indicators

## Color Accessibility
All color combinations meet WCAG 2.1 AA standards for:
- Text contrast ratios (minimum 4.5:1)
- Color-blind accessibility
- Clear visual hierarchy

## Usage Guidelines
1. **Always use centralized color functions** instead of hardcoded values
2. **Maintain semantic meaning** - red for danger/high risk, green for success/low risk
3. **Ensure consistency** across all components and states
4. **Test with color-blind simulation** tools for accessibility