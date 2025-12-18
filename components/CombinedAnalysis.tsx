'use client'

import { ImageAnalysis, Damage } from '@/app/page'

interface CombinedAnalysisProps {
  analyses: ImageAnalysis[]
}

export default function CombinedAnalysis({ analyses }: CombinedAnalysisProps) {
  // Combine all damages from all images
  const allDamages: Damage[] = []
  analyses.forEach((analysis) => {
    if (!analysis.loading && !analysis.error && analysis.damages) {
      allDamages.push(...analysis.damages)
    }
  })

  // Remove duplicates based on car part, damage type, and location
  const uniqueDamages = allDamages.reduce((acc: Damage[], current) => {
    const exists = acc.some(
      (damage) =>
        damage.carPart === current.carPart &&
        damage.damageType === current.damageType &&
        damage.location === current.location
    )
    if (!exists) {
      acc.push(current)
    } else {
      // If duplicate exists, keep the one with higher cost (more severe)
      const existingIndex = acc.findIndex(
        (damage) =>
          damage.carPart === current.carPart &&
          damage.damageType === current.damageType &&
          damage.location === current.location
      )
      if (existingIndex !== -1 && current.estimatedCost > acc[existingIndex].estimatedCost) {
        acc[existingIndex] = current
      }
    }
    return acc
  }, [])

  // Calculate total cost
  const totalCost = uniqueDamages.reduce((sum, damage) => sum + damage.estimatedCost, 0)

  // Determine overall condition based on damages
  const getOverallCondition = (): 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Severely Damaged' => {
    if (uniqueDamages.length === 0) return 'Excellent'
    
    const severeCount = uniqueDamages.filter((d) => d.severity === 'severe').length
    const moderateCount = uniqueDamages.filter((d) => d.severity === 'moderate').length
    
    if (severeCount >= 3 || totalCost > 10000) return 'Severely Damaged'
    if (severeCount >= 1 || moderateCount >= 3 || totalCost > 5000) return 'Poor'
    if (moderateCount >= 1 || totalCost > 2000) return 'Fair'
    if (uniqueDamages.length > 0 && totalCost > 500) return 'Good'
    return 'Excellent'
  }

  const overallCondition = getOverallCondition()

  // Generate tags
  const generateTags = (): string[] => {
    const tags: string[] = []
    const damageTypes = new Set(uniqueDamages.map((d) => d.damageType))
    const hasSevere = uniqueDamages.some((d) => d.severity === 'severe')
    const hasModerate = uniqueDamages.some((d) => d.severity === 'moderate')

    damageTypes.forEach((type) => {
      if (type === 'scratch') tags.push('#Scratch')
      if (type === 'dent') tags.push('#Dent')
      if (type === 'crack') tags.push('#Crack')
      if (type === 'broken') tags.push('#Broken')
      if (type === 'bent') tags.push('#Bent')
      if (type === 'paint peel') tags.push('#PaintWork')
    })

    if (uniqueDamages.length > 0) {
      tags.push('#AccidentDamage')
    }

    if (totalCost > 5000 || hasSevere) {
      tags.push('#MajorRepair')
    } else if (totalCost > 0) {
      tags.push('#MinorRepair')
    }

    return tags
  }

  const tags = generateTags()

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent':
        return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'Good':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
      case 'Fair':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'Poor':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50'
      case 'Severely Damaged':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  // Calculate statistics
  const severeCount = uniqueDamages.filter((d) => d.severity === 'severe').length
  const moderateCount = uniqueDamages.filter((d) => d.severity === 'moderate').length
  const minorCount = uniqueDamages.filter((d) => d.severity === 'minor').length
  
  // Group by damage type
  const damageTypeGroups = uniqueDamages.reduce((acc, damage) => {
    const type = damage.damageType
    if (!acc[type]) {
      acc[type] = { count: 0, totalCost: 0 }
    }
    acc[type].count++
    acc[type].totalCost += damage.estimatedCost
    return acc
  }, {} as Record<string, { count: number; totalCost: number }>)

  // Group by car part
  const carPartGroups = uniqueDamages.reduce((acc, damage) => {
    const part = damage.carPart
    if (!acc[part]) {
      acc[part] = { count: 0, totalCost: 0 }
    }
    acc[part].count++
    acc[part].totalCost += damage.estimatedCost
    return acc
  }, {} as Record<string, { count: number; totalCost: number }>)

  return (
    <div className="bg-slate-800/80 rounded-2xl shadow-xl border border-cyan-500/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600/80 to-blue-600/80 px-6 md:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Comprehensive Damage Report</h2>
            <p className="text-cyan-100 text-sm">Complete assessment across all uploaded images</p>
          </div>
          <div className="hidden md:block bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-5 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-cyan-400 uppercase tracking-wide">Total Damages</p>
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">{uniqueDamages.length}</p>
            <p className="text-xs text-cyan-300 mt-1">Unique damage points</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-5 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-green-400 uppercase tracking-wide">Total Cost</p>
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">
              ${totalCost.toLocaleString()}
            </p>
            <p className="text-xs text-green-300 mt-1">Estimated repair cost (AUD)</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-xl p-5 border border-amber-500/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-amber-400 uppercase tracking-wide">Severity</p>
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-300">Severe:</span>
                <span className="text-lg font-bold text-red-400">{severeCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-300">Moderate:</span>
                <span className="text-lg font-bold text-yellow-400">{moderateCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-300">Minor:</span>
                <span className="text-lg font-bold text-green-400">{minorCount}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-xl p-5 border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-purple-400 uppercase tracking-wide">Condition</p>
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span
              className={`inline-block px-4 py-2 rounded-lg text-sm font-bold border ${getConditionColor(
                overallCondition
              )}`}
            >
              {overallCondition}
            </span>
            <p className="text-xs text-purple-300 mt-2">Overall vehicle status</p>
          </div>
        </div>

        {/* Damage Breakdown by Type */}
        {Object.keys(damageTypeGroups).length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Damage Breakdown by Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(damageTypeGroups).map(([type, data]) => (
                <div key={type} className="bg-slate-700/50 rounded-lg p-4 border border-cyan-500/20 hover:shadow-md hover:border-cyan-400/40 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white capitalize">{type}</span>
                    <span className="text-xs font-medium text-gray-300 bg-slate-600 px-2 py-1 rounded">
                      {data.count} {data.count === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-cyan-400">
                    ${data.totalCost.toLocaleString()} AUD
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Damage Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm font-semibold border border-cyan-500/50 hover:bg-cyan-500/30 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Damage List */}
        {uniqueDamages.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Detailed Damage Report
              </h3>
              <span className="text-sm text-gray-300 bg-slate-700 px-3 py-1 rounded-full font-medium">
                {uniqueDamages.length} {uniqueDamages.length === 1 ? 'damage' : 'damages'}
              </span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {uniqueDamages.map((damage, index) => (
                <div
                  key={index}
                  className="border border-cyan-500/20 rounded-xl p-5 bg-gradient-to-br from-slate-700/50 to-slate-800/50 hover:shadow-lg hover:border-cyan-400/40 transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-lg border ${
                          damage.severity === 'severe'
                            ? 'bg-red-500/20 text-red-400 border-red-500/50'
                            : damage.severity === 'moderate'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                            : 'bg-green-500/20 text-green-400 border-green-500/50'
                        }`}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-white">{damage.carPart}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                            <span className="capitalize">{damage.damageType}</span>
                            <span className="text-gray-500">•</span>
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              {damage.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-6 flex flex-col items-end">
                      <p className="font-bold text-xl text-cyan-400 mb-2">
                        ${damage.estimatedCost.toLocaleString()}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${
                          damage.severity === 'severe'
                            ? 'bg-red-500/20 text-red-400 border-red-500/50'
                            : damage.severity === 'moderate'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                            : 'bg-green-500/20 text-green-400 border-green-500/50'
                        }`}
                      >
                        {damage.severity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {uniqueDamages.length === 0 && (
          <div className="text-center py-12 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border-2 border-green-500/30">
            <div className="inline-block p-4 bg-green-500/20 rounded-full mb-4 border border-green-500/50">
              <svg className="w-12 h-12 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Damages Detected</h3>
            <p className="text-gray-300">All images show the vehicle is in excellent condition.</p>
          </div>
        )}
      </div>
    </div>
  )
}

