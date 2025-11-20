# Nutrient Deficiency Predictor - Frontend

A modern React application for personalized nutrient deficiency prediction using AI-powered analysis. This frontend provides an intuitive interface for users to input their health profile and receive detailed nutritional risk assessments.

## Overview

This React application serves as the user interface for the Nutrient Deficiency Predictor system. It provides a clean, responsive design for collecting user demographic and health data, displaying AI-generated predictions, and offering personalized nutritional recommendations.

## Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **User Input Form**: Comprehensive health profile collection
- **Real-time Validation**: Client-side form validation with error handling
- **Prediction Dashboard**: Interactive display of risk scores and explanations
- **SHAP Visualizations**: Model interpretability with feature importance charts
- **Model Performance**: Technical details and accuracy metrics
- **Professional UI**: Modern design with smooth animations and transitions
- **Accessibility**: WCAG compliant interface elements

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Charts**: Chart.js with React Chart.js 2
- **Development**: ESLint, PostCSS

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Setup

1. Clone the repository:

```bash
git clone https://github.com/umairleo1/nutrient-predictor-frontend.git
cd nutrient-predictor-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Type Checking
npm run type-check   # TypeScript compilation check
```

## API Integration

The frontend communicates with the FastAPI backend service deployed on Render:

```typescript
const API_BASE_URL = "https://your-nutrient-predictor-production"; // Production
// const API_BASE_URL = 'http://localhost:8000'; // Development
```

**Live Backend**: [https://your-nutrient-predictor-production](https://your-nutrient-predictor-production)

## Project Structure

```
src/
├── components/         # React components
│   ├── forms/         # Form components
│   │   └── UserInputForm.tsx
│   ├── layout/        # Layout components
│   │   └── Header.tsx
│   └── results/       # Result display components
│       ├── PredictionResults.tsx
│       ├── RiskScore.tsx
│       ├── FeatureImportance.tsx
│       └── Recommendations.tsx
├── pages/             # Page components
│   └── ModelPerformance.tsx
├── services/          # API services
│   └── api.ts
├── types/             # TypeScript definitions
│   └── index.ts
├── constants/         # App constants
│   └── colors.ts
├── App.tsx           # Main app component
└── main.tsx          # App entry point

public/               # Static assets
├── favicon.svg       # App icon
└── models/          # Model metadata
```

## Components

### UserInputForm

Collects user demographic and health information:

- Age, gender, race/ethnicity
- Height, weight (BMI calculation)
- Education level, marital status
- Country of birth
- Real-time validation and BMI display

### PredictionResults

Displays prediction outcomes:

- Risk scores for B12, Iron deficiency, and Diabetes
- Confidence levels and risk categories
- SHAP explanations for model interpretability
- Personalized recommendations

### ModelPerformance

Technical information about ML models:

- Model accuracy metrics (AUC, Precision, Recall)
- Training data information
- Feature importance analysis
- Calibration plots

## Features in Detail

### Health Profile Input

- **Comprehensive Form**: 8-field health profile collection
- **Smart Validation**: Real-time input validation with helpful error messages
- **BMI Calculator**: Automatic BMI calculation and categorization
- **Responsive Design**: Works seamlessly on mobile and desktop

### Prediction Display

- **Risk Scoring**: Color-coded risk levels (Very Low, Low, Moderate, High, Very High)
- **Confidence Indicators**: Model confidence for each prediction
- **Interactive Charts**: SHAP value visualizations for model explanations
- **Recommendations**: Personalized nutritional guidance

### User Experience

- **Loading States**: Smooth loading animations during API calls
- **Error Handling**: Graceful error handling with user-friendly messages
- **Responsive Layout**: Mobile-first design with tablet and desktop optimization
- **Accessibility**: Screen reader compatible with proper ARIA labels

## Styling

The application uses Tailwind CSS for styling with:

- **Design System**: Consistent color palette and typography
- **Component Library**: Reusable UI components
- **Animations**: Smooth transitions and hover effects
- **Dark Mode Ready**: Architecture supports dark mode implementation

### Color Conventions

- **Primary**: Blue gradient (Blue 500 to Indigo 600)
- **Success**: Green 500 for positive outcomes
- **Warning**: Amber 500 for moderate risks
- **Danger**: Red 500 for high risks
- **Neutral**: Gray scale for backgrounds and text

## Deployment

### Production Build

```bash
npm run build
```

### Deployment Platforms

This application is optimized for deployment on:

- **Vercel**: Zero-config deployment with automatic builds
- **Netlify**: Static site hosting with form handling
- **GitHub Pages**: Static deployment option
- **AWS S3 + CloudFront**: Enterprise deployment solution

### Environment Variables

Create a `.env` file for local development:

```env
VITE_API_URL=https://nutrient-predictor-backend.onrender.com
VITE_APP_TITLE=Nutrient Deficiency Predictor
```

For production deployment, set environment variables in your hosting platform or GitHub repository secrets.

## Performance

- **Bundle Size**: Optimized with tree shaking and code splitting
- **Loading Speed**: Lazy loading for components and images
- **Caching**: Service worker ready for offline functionality
- **SEO**: Meta tags and structured data for search engines

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS 14+, Android 8+)

## Development Guidelines

### Code Style

- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier integration for formatting
- Conventional commits for version control

### Component Architecture

- Functional components with hooks
- Props interface definitions
- Error boundaries for robust error handling
- Memoization for performance optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the coding standards
4. Add tests for new features
5. Submit a pull request

## Testing

```bash
# Unit tests
npm run test

# Component testing
npm run test:components

# E2E testing
npm run test:e2e
```

## License

This project is for educational and research purposes only. Not intended for medical diagnosis or treatment.

## Disclaimer

This application is designed for educational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical decisions.

## Contact

**Author**: Muhammad Umair  
**LinkedIn**: [muhammad-umair-amin](https://www.linkedin.com/in/muhammad-umair-amin/)  
**GitHub**: [umairleo1](https://github.com/umairleo1)

## Backend Repository

The corresponding backend API can be found at:  
[nutrient-predictor-backend](https://github.com/umairleo1/nutrient-predictor-backend)

---

**Note**: This is a research demonstration project showcasing modern web development practices and machine learning integration in healthcare applications.
