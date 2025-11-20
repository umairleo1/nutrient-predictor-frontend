import React, { useState } from 'react';
import { User, Scale, Ruler, AlertCircle, Brain } from 'lucide-react';
import { 
  UserProfile, 
  GENDER_OPTIONS, 
  RACE_OPTIONS, 
  EDUCATION_OPTIONS, 
  MARITAL_STATUS_OPTIONS,
  COUNTRY_OPTIONS 
} from '../../types';

interface UserInputFormProps {
  onSubmit: (data: UserProfile) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function UserInputForm({ onSubmit, isLoading = false, error }: UserInputFormProps) {
  const [formData, setFormData] = useState<UserProfile>({
    age: 0,
    gender: '',
    race: '',
    weight: 0,
    height: 0,
    education: '',
    marital_status: '',
    country_of_birth: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  const validateField = (field: keyof UserProfile, value: any) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'age':
        if (!value || value < 18 || value > 120) {
          newErrors.age = 'Age must be between 18 and 120';
        } else {
          delete newErrors.age;
        }
        break;
      case 'weight':
        if (!value || value < 30 || value > 300) {
          newErrors.weight = 'Weight must be between 30 and 300 kg';
        } else {
          delete newErrors.weight;
        }
        break;
      case 'height':
        if (!value || value < 100 || value > 250) {
          newErrors.height = 'Height must be between 100 and 250 cm';
        } else {
          delete newErrors.height;
        }
        break;
      case 'gender':
        if (!value) {
          newErrors.gender = 'Gender is required';
        } else {
          delete newErrors.gender;
        }
        break;
      case 'race':
        if (!value) {
          newErrors.race = 'Race/ethnicity is required';
        } else {
          delete newErrors.race;
        }
        break;
      case 'education':
        if (!value) {
          newErrors.education = 'Education level is required';
        } else {
          delete newErrors.education;
        }
        break;
      case 'marital_status':
        if (!value) {
          newErrors.marital_status = 'Marital status is required';
        } else {
          delete newErrors.marital_status;
        }
        break;
      case 'country_of_birth':
        if (!value) {
          newErrors.country_of_birth = 'Country of birth is required';
        } else {
          delete newErrors.country_of_birth;
        }
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.age || formData.age < 18 || formData.age > 120) {
      newErrors.age = 'Age must be between 18 and 120';
    }
    if (!formData.weight || formData.weight < 30 || formData.weight > 300) {
      newErrors.weight = 'Weight must be between 30 and 300 kg';
    }
    if (!formData.height || formData.height < 100 || formData.height > 250) {
      newErrors.height = 'Height must be between 100 and 250 cm';
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    if (!formData.race) {
      newErrors.race = 'Race/ethnicity is required';
    }
    if (!formData.education) {
      newErrors.education = 'Education level is required';
    }
    if (!formData.marital_status) {
      newErrors.marital_status = 'Marital status is required';
    }
    if (!formData.country_of_birth) {
      newErrors.country_of_birth = 'Country of birth is required';
    }

    setErrors(newErrors);
    setTouched({
      age: true,
      gender: true,
      race: true,
      weight: true,
      height: true,
      education: true,
      marital_status: true,
      country_of_birth: true
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: keyof UserProfile) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const bmi = formData.weight && formData.height 
    ? formData.weight / ((formData.height / 100) ** 2) 
    : null;

  const getBMICategory = () => {
    if (!bmi) return { text: 'Calculate BMI', color: 'text-gray-500' };
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-yellow-600' };
    return { text: 'Obese', color: 'text-red-600' };
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Streamlined Header */}
        <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Quick Health Assessment</h2>
              <p className="text-sm text-gray-600">8 fields • 2 minutes to complete</p>
            </div>
            <div className="hidden md:block text-xs text-gray-500">
              <div className="text-center space-y-2">
                <span className="bg-gray-100 px-2 py-1 rounded-full">Quick & Secure</span>
                <div className="flex items-center justify-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Private</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>No Storage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Form with All Fields in Grid */}
        <form onSubmit={handleSubmit} className="p-8">
          
          {/* Single Grid with All Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            {/* Age */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
                  errors.age && touched.age 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 focus:bg-white'
                }`}
                placeholder="25"
                value={formData.age || ''}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                onBlur={() => handleBlur('age')}
                min="18"
                max="120"
              />
              {errors.age && touched.age && (
                <div className="flex items-center space-x-1 text-red-600 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.age}</span>
                </div>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full px-4 py-3 pr-10 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
                  errors.gender && touched.gender 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 focus:bg-white'
                } ${formData.gender === '' ? 'text-gray-400' : 'text-gray-900'}`}
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value as 'Male' | 'Female')}
                onBlur={() => handleBlur('gender')}
              >
                <option value="" className="text-gray-400">Select</option>
                {GENDER_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.gender && touched.gender && (
                <div className="flex items-center space-x-1 text-red-600 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.gender}</span>
                </div>
              )}
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Weight (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
                  errors.weight && touched.weight 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 focus:bg-white'
                }`}
                placeholder="70"
                value={formData.weight || ''}
                onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                onBlur={() => handleBlur('weight')}
                min="30"
                max="300"
              />
              {errors.weight && touched.weight && (
                <div className="flex items-center space-x-1 text-red-600 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.weight}</span>
                </div>
              )}
            </div>

            {/* Height */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Height (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
                  errors.height && touched.height 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 focus:bg-white'
                }`}
                placeholder="175"
                value={formData.height || ''}
                onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
                onBlur={() => handleBlur('height')}
                min="100"
                max="250"
              />
              {errors.height && touched.height && (
                <div className="flex items-center space-x-1 text-red-600 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.height}</span>
                </div>
              )}
            </div>

            {/* Race */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Race/Ethnicity <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full px-4 py-3 pr-10 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
                  errors.race && touched.race 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 focus:bg-white'
                } ${formData.race === '' ? 'text-gray-400' : 'text-gray-900'}`}
                value={formData.race}
                onChange={(e) => handleInputChange('race', e.target.value)}
                onBlur={() => handleBlur('race')}
              >
                <option value="" className="text-gray-400">Select</option>
                {RACE_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.race && touched.race && (
                <div className="flex items-center space-x-1 text-red-600 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.race}</span>
                </div>
              )}
            </div>

            {/* Education */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Education Level <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full px-4 py-3 pr-10 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
                  errors.education && touched.education 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 focus:bg-white'
                } ${formData.education === '' ? 'text-gray-400' : 'text-gray-900'}`}
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                onBlur={() => handleBlur('education')}
              >
                <option value="" className="text-gray-400">Select</option>
                {EDUCATION_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.education && touched.education && (
                <div className="flex items-center space-x-1 text-red-600 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.education}</span>
                </div>
              )}
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Marital Status <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full px-4 py-3 pr-10 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
                  errors.marital_status && touched.marital_status 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 focus:bg-white'
                } ${formData.marital_status === '' ? 'text-gray-400' : 'text-gray-900'}`}
                value={formData.marital_status}
                onChange={(e) => handleInputChange('marital_status', e.target.value)}
                onBlur={() => handleBlur('marital_status')}
              >
                <option value="" className="text-gray-400">Select</option>
                {MARITAL_STATUS_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.marital_status && touched.marital_status && (
                <div className="flex items-center space-x-1 text-red-600 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.marital_status}</span>
                </div>
              )}
            </div>

            {/* Country of Birth */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Country of Birth <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full px-4 py-3 pr-10 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 ${
                  errors.country_of_birth && touched.country_of_birth 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 focus:bg-white'
                } ${formData.country_of_birth === '' ? 'text-gray-400' : 'text-gray-900'}`}
                value={formData.country_of_birth}
                onChange={(e) => handleInputChange('country_of_birth', e.target.value)}
                onBlur={() => handleBlur('country_of_birth')}
              >
                <option value="" className="text-gray-400">Select</option>
                {COUNTRY_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.country_of_birth && touched.country_of_birth && (
                <div className="flex items-center space-x-1 text-red-600 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.country_of_birth}</span>
                </div>
              )}
            </div>

          </div>

          {/* BMI Display */}
          {bmi && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Scale className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Calculated BMI</p>
                    <p className="text-xs text-gray-600">Based on height and weight</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">{bmi.toFixed(1)}</p>
                  <p className={`text-sm font-semibold ${getBMICategory().color}`}>
                    {getBMICategory().text}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Section */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center space-x-3 px-12 py-4 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Profile...</span>
                </>
              ) : (
                <span>Get AI Analysis</span>
              )}
            </button>

            {/* Subtle Disclaimer Below Button */}
            <div className="mt-4 text-center">
              <p className="text-xs text-amber-600 leading-relaxed">
                For educational purposes only • Not medical advice
                <br />
                Always consult healthcare professionals for medical decisions
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}