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
          ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
          : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-md'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className={`p-6 rounded-full transition-colors ${
            isDragging ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <svg
              className={`w-12 h-12 transition-colors ${
                isDragging ? 'text-blue-600' : 'text-gray-400'
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
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-800">
            Drag & drop vehicle images here
          </p>
          <p className="text-sm text-gray-600">
            or{' '}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 font-semibold underline decoration-2 underline-offset-2 transition-colors"
            >
              browse files
            </button>
          </p>
        </div>
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>JPG, PNG, WebP</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Multiple images</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>High quality recommended</span>
          </div>
        </div>
      </div>
    </div>
  )
}

