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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                {/* Three stacked rectangles */}
                <div className="absolute inset-0 flex flex-col space-y-0.5">
                  <div className="w-8 h-1.5 bg-cyan-400 rounded transform translate-x-0.5"></div>
                  <div className="w-8 h-1.5 bg-cyan-300 rounded transform translate-x-1"></div>
                  <div className="w-8 h-1.5 bg-cyan-500 rounded"></div>
                </div>
                {/* Checkmark */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <span className="text-white text-xl font-bold">AutoInspect</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button className="text-white px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
                Sign In
              </button>
              <button className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-lg shadow-cyan-500/50">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section - Only show when no analyses */}
        {analyses.length === 0 && (
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-cyan-400/50 bg-cyan-400/10 mb-6">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span className="text-cyan-300 text-sm font-medium">AI-Powered Vehicle Inspection</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent">
                AutoInspect
              </span>
              <span className="text-white"> AI</span>
            </h1>

            {/* Slogan */}
            <p className="text-xl md:text-2xl text-white mb-2">
              Instant AI Repair Estimates for Your Bike
            </p>

            {/* Tagline */}
            <p className="text-cyan-400 text-lg mb-8">
              Powered by Advanced Vision Technology
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-white text-sm font-medium">AI Damage Detection</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
                <span className="text-white text-lg font-semibold">₹</span>
                <span className="text-white text-sm font-medium">Hyderabad Pricing</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span className="text-white text-sm font-medium">Instant Results</span>
              </div>
            </div>
          </div>
        )}

        {/* Image Upload Section */}
        <div className="mb-10">
          {analyses.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                Upload Vehicle Image
              </h2>
            </div>
          )}
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
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Detailed Image Analysis
                  </h2>
                  <p className="text-sm text-gray-400">
                    Individual assessment for each uploaded image
                  </p>
                </div>
                <div className="text-sm text-gray-400">
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
      </div>

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-cyan-500/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Section */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 flex flex-col space-y-0.5">
                    <div className="w-8 h-1.5 bg-cyan-400 rounded transform translate-x-0.5"></div>
                    <div className="w-8 h-1.5 bg-cyan-300 rounded transform translate-x-1"></div>
                    <div className="w-8 h-1.5 bg-cyan-500 rounded"></div>
                  </div>
                </div>
                <span className="text-white text-xl font-bold">AutoInspect AI</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI-powered vehicle inspection platform providing instant damage assessment and repair estimates for bikes and motorcycles in India.
              </p>
            </div>

            {/* Middle Section */}
            <div>
              <h3 className="text-white font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Integrations</a></li>
              </ul>
            </div>

            {/* Right Section */}
            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Press</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

