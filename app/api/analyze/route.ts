import { NextRequest, NextResponse } from 'next/server'

interface DamageAnalysis {
  carPart: string
  damageType: string
  severity: 'minor' | 'moderate' | 'severe'
  location: string
  estimatedCost: number
}

interface AnalysisResult {
  damages: DamageAnalysis[]
  overallCondition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Severely Damaged'
  message?: string
}

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, imageName } = await request.json()

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')

    // Determine image MIME type
    const mimeType = imageBase64.match(/data:image\/(\w+);base64/)?.[1] || 'jpeg'
    const imageMimeType = `image/${mimeType}`

    const prompt = `You are an expert automotive damage assessment specialist. Analyze the car image and provide detailed damage assessments in JSON format.

For each visible damage, provide:
- carPart: The specific car part (e.g., front bumper, rear bumper, bonnet, fender, door, windshield, headlight, taillight, side mirror, alloy wheel)
- damageType: Type of damage (scratch, dent, crack, broken, bent, paint peel)
- severity: minor, moderate, or severe
- location: front, rear, left, right, or top
- estimatedCost: Estimated repair/replacement cost in AUD (be realistic based on damage type and severity)

Provide an overall condition rating: Excellent, Good, Fair, Poor, or Severely Damaged.

If damage is unclear or image quality is poor, set message to "Damage not clearly visible in this image." and return empty damages array.

Return ONLY valid JSON in this format:
{
  "damages": [
    {
      "carPart": "string",
      "damageType": "string",
      "severity": "minor|moderate|severe",
      "location": "string",
      "estimatedCost": number
    }
  ],
  "overallCondition": "Excellent|Good|Fair|Poor|Severely Damaged",
  "message": "optional message"
}

Analyze this car image for all visible damages. Provide a detailed assessment in the specified JSON format.`

    // Azure DeepSeek API endpoint and key
    const API_KEY = process.env.DEEPSEEK_API_KEY
    const BASE_URL = "https://DeepSeek-R1-oplms.eastus2.models.ai.azure.com/chat/completions"

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    }

    // Format image URL for DeepSeek (using data URI format)
    const imageUrl = `data:${imageMimeType};base64,${base64Data}`

    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl
            }
          }
        ]
      }
    ]

    const payload = {
      "model": "DEEPSEEK-REASONER",
      "messages": messages,
      "temperature": 0.0
    }

    const deepseekResponse = await fetch(BASE_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })

    if (!deepseekResponse.ok) {
      const errorText = await deepseekResponse.text()
      throw new Error(
        `DeepSeek API error: ${deepseekResponse.status} ${deepseekResponse.statusText} - ${errorText}`
      )
    }

    const deepseekData = await deepseekResponse.json()
    const content = deepseekData.choices?.[0]?.message?.content || '{}'
    
    // Try to extract JSON from the response
    let analysisResult: AnalysisResult
    try {
      // Remove markdown code blocks if present
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : content
      analysisResult = JSON.parse(jsonString)
    } catch (parseError) {
      // If parsing fails, return a safe default
      analysisResult = {
        damages: [],
        overallCondition: 'Fair',
        message: 'Unable to parse analysis. Please try again with a clearer image.',
      }
    }

    return NextResponse.json(analysisResult)
  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      {
        error: 'Failed to analyze image',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}

