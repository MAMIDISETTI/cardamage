'use client'

import { useState, useCallback } from 'react'
import ImageUpload from '@/components/ImageUpload'
import DamageResults from '@/components/DamageResults'
import CombinedAnalysis from '@/components/CombinedAnalysis'

export interface Damage {
  carPart: string
  damageType: string
  severity: 'minor' | 'moderate' | 'severe'
  location: string
  estimatedCost: number
}

export interface ImageAnalysis {
  imageId: string
  imageUrl: string
  imageName: string
  damages: Damage[]
  overallCondition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Severely Damaged'
  message?: string
  loading?: boolean
  error?: string
}

export default function Home() {
  const [analyses, setAnalyses] = useState<ImageAnalysis[]>([])

  const handleImageUpload = useCallback((newAnalysis: ImageAnalysis) => {
    setAnalyses((prev) => [...prev, newAnalysis])
  }, [])

  const handleImageRemove = useCallback((imageId: string) => {
    setAnalyses((prev) => prev.filter((a) => a.imageId !== imageId))
  }, [])

  const handleAnalysisUpdate = useCallback((imageId: string, updated: Partial<ImageAnalysis>) => {
    setAnalyses((prev) =>
      prev.map((a) => (a.imageId === imageId ? { ...a, ...updated } : a))
    )
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Professional Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  AutoDamage Pro
                </h1>
                <p className="text-sm text-gray-600">Professional Vehicle Damage Assessment System</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>AI-Powered Analysis</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Upload Section */}
        <div className="mb-10">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Vehicle Images</h2>
            <p className="text-sm text-gray-600">
              Upload multiple images from different angles for comprehensive damage assessment
            </p>
          </div>
          <ImageUpload
            onImageUpload={handleImageUpload}
            onAnalysisUpdate={handleAnalysisUpdate}
          />
        </div>

        {/* Results Section */}
        {analyses.length > 0 && (
          <div className="space-y-10">
            {/* Combined Analysis - Show First */}
            <CombinedAnalysis analyses={analyses} />

            {/* Individual Image Analyses */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Detailed Image Analysis
                  </h2>
                  <p className="text-sm text-gray-600">
                    Individual assessment for each uploaded image
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {analyses.length} {analyses.length === 1 ? 'image' : 'images'}
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {analyses.map((analysis) => (
                  <DamageResults
                    key={analysis.imageId}
                    analysis={analysis}
                    onRemove={handleImageRemove}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {analyses.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-2xl shadow-xl mb-6">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-full inline-block">
                <svg
                  className="w-20 h-20 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Ready to Assess Vehicle Damage
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              Upload high-quality images of your vehicle from multiple angles to get a comprehensive AI-powered damage assessment
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Instant Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Cost Estimates</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Detailed Reports</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

