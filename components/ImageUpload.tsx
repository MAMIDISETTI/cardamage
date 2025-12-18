'use client'

import { useState, useRef } from 'react'
import { ImageAnalysis } from '@/app/page'

interface ImageUploadProps {
  onImageUpload: (analysis: ImageAnalysis) => void
  onAnalysisUpdate: (imageId: string, updated: Partial<ImageAnalysis>) => void
}

export default function ImageUpload({ onImageUpload, onAnalysisUpdate }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const analyzeImage = async (file: File, imageId: string) => {
    try {
      const base64 = await convertToBase64(file)
      const imageUrl = URL.createObjectURL(file)

      // Create initial analysis with loading state
      const initialAnalysis: ImageAnalysis = {
        imageId,
        imageUrl,
        imageName: file.name,
        damages: [],
        overallCondition: 'Fair',
        loading: true,
      }
      onImageUpload(initialAnalysis)

      // Call API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64,
          imageName: file.name,
        }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()

      // Update analysis with results
      onAnalysisUpdate(imageId, {
        damages: data.damages || [],
        overallCondition: data.overallCondition || 'Fair',
        message: data.message,
        loading: false,
      })
    } catch (error: any) {
      onAnalysisUpdate(imageId, {
        loading: false,
        error: error.message || 'Failed to analyze image',
      })
    }
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const imageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        analyzeImage(file, imageId)
      }
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
        isDragging
          ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20 scale-[1.02]'
          : 'border-cyan-500/50 bg-slate-800/50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !isDragging && fileInputRef.current?.click()}
      style={{ cursor: 'pointer' }}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      <div className="space-y-8">
        {/* Upload Icon */}
        <div className="flex justify-center">
          <div className={`p-4 rounded-full border-2 transition-all ${
            isDragging 
              ? 'border-cyan-400 bg-cyan-500/20' 
              : 'border-white/30 bg-slate-700/50'
          }`}>
            <svg
              className={`w-12 h-12 transition-colors ${
                isDragging ? 'text-cyan-400' : 'text-white'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <p className="text-xl font-bold text-white">
            Drag & drop your bike image
          </p>
          <p className="text-sm text-gray-400">
            or click to browse your files
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg border border-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">Select File</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Camera functionality can be added here
              fileInputRef.current?.click()
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg border border-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">Take Photo</span>
          </button>
        </div>
      </div>
    </div>
  )
}

