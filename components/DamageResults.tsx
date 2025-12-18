'use client'

import { ImageAnalysis } from '@/app/page'

interface DamageResultsProps {
  analysis: ImageAnalysis
  onRemove: (imageId: string) => void
}

export default function DamageResults({ analysis, onRemove }: DamageResultsProps) {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent':
        return 'bg-green-100 text-green-800'
      case 'Good':
        return 'bg-blue-100 text-blue-800'
      case 'Fair':
        return 'bg-yellow-100 text-yellow-800'
      case 'Poor':
        return 'bg-orange-100 text-orange-800'
      case 'Severely Damaged':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor':
        return 'bg-green-100 text-green-700'
      case 'moderate':
        return 'bg-yellow-100 text-yellow-700'
      case 'severe':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getDamageIcon = (damageType: string) => {
    switch (damageType.toLowerCase()) {
      case 'scratch':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        )
      case 'dent':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )
      case 'crack':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
    }
  }

  const totalCost = analysis.damages.reduce((sum, d) => sum + d.estimatedCost, 0)

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      {/* Image Header */}
      <div className="relative bg-gray-900">
        <img
          src={analysis.imageUrl}
          alt={analysis.imageName}
          className="w-full h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button
          onClick={() => onRemove(analysis.imageId)}
          className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg z-10"
          aria-label="Remove image"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {analysis.loading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-3"></div>
              <p className="text-sm font-medium">Analyzing damage...</p>
              <p className="text-xs text-gray-300 mt-1">Please wait</p>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white text-sm font-medium truncate drop-shadow-lg">
            {analysis.imageName}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Condition Badge */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${getConditionColor(analysis.overallCondition)}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-600">Overall Condition</span>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getConditionColor(
              analysis.overallCondition
            )}`}
          >
            {analysis.overallCondition}
          </span>
        </div>

        {analysis.error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700 font-medium">{analysis.error}</p>
            </div>
          </div>
        )}

        {analysis.message && (
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-amber-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-amber-700">{analysis.message}</p>
            </div>
          </div>
        )}

        {!analysis.loading && !analysis.error && analysis.damages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                Detected Damages
              </h3>
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {analysis.damages.length} {analysis.damages.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            {analysis.damages.map((damage, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${getSeverityColor(damage.severity)} mt-0.5`}>
                      {getDamageIcon(damage.damageType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-900 mb-1">
                        {damage.carPart}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {damage.location}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="capitalize">{damage.damageType}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`ml-3 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${getSeverityColor(
                      damage.severity
                    )}`}
                  >
                    {damage.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-xs font-medium text-gray-600">Estimated Cost</span>
                  <span className="text-base font-bold text-blue-600">
                    ${damage.estimatedCost.toLocaleString()} AUD
                  </span>
                </div>
              </div>
            ))}
            {totalCost > 0 && (
              <div className="mt-4 pt-4 border-t-2 border-gray-300 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-700 uppercase tracking-wide">Total Repair Cost</span>
                  <span className="text-xl font-bold text-blue-700">
                    ${totalCost.toLocaleString()} AUD
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {!analysis.loading &&
          !analysis.error &&
          analysis.damages.length === 0 &&
          !analysis.message && (
            <div className="text-center py-8">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-3">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-600">No damages detected</p>
              <p className="text-xs text-gray-500 mt-1">Vehicle appears to be in good condition</p>
            </div>
          )}
      </div>
    </div>
  )
}

