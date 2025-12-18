# Car Damage Assessment - AI-Powered Analysis

A professional Next.js application for automotive damage assessment using Google's Gemini AI.

## Features

- 📸 **Multiple Image Upload**: Upload multiple car images from different angles
- 🤖 **AI-Powered Analysis**: Uses Google Gemini AI to detect and assess damages
- 📊 **Detailed Reports**: Comprehensive damage analysis with:
  - Car part identification
  - Damage type classification
  - Severity assessment (minor/moderate/severe)
  - Location mapping
  - Cost estimation in AUD
- 🔄 **Combined Analysis**: Automatically combines and deduplicates damages from all images
- 🏷️ **Smart Tagging**: Auto-generates relevant tags for easy categorization
- 📱 **Responsive Design**: Beautiful, modern UI that works on all devices

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory with:
```
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Note: The API key is also hardcoded as a fallback in the code, but it's recommended to use environment variables for security.

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload Images**: Drag and drop or click to browse and upload car images
2. **Wait for Analysis**: Each image is automatically analyzed using AI
3. **Review Results**: 
   - View individual image analyses
   - Check the combined analysis for overall assessment
   - Review total repair costs and condition ratings
4. **Remove Images**: Click the X button on any image to remove it from analysis

## Technology Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern styling
- **Google Gemini AI**: AI image analysis
- **React Hooks**: State management

## Project Structure

```
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts      # API endpoint for image analysis
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page component
├── components/
│   ├── ImageUpload.tsx        # Image upload component
│   ├── DamageResults.tsx      # Individual image results
│   └── CombinedAnalysis.tsx   # Combined analysis component
└── package.json
```

## API Endpoint

The `/api/analyze` endpoint accepts:
- `imageBase64`: Base64 encoded image
- `imageName`: Original filename

Returns:
- `damages`: Array of detected damages
- `overallCondition`: Overall condition rating
- `message`: Optional message if damage is unclear

## License

MIT

