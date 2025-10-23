import React, { useState, useRef } from 'react'

const XRayProcessor = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target.result)
        setProcessedImage(null)
        setAnalysisResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const applyXRayEffect = (imageSrc) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        
        // Draw the original image
        ctx.drawImage(img, 0, 0)
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        // Apply X-ray effect (invert colors and adjust contrast)
        for (let i = 0; i < data.length; i += 4) {
          // Invert colors for X-ray effect
          data[i] = 255 - data[i]     // Red
          data[i + 1] = 255 - data[i + 1] // Green
          data[i + 2] = 255 - data[i + 2] // Blue
          
          // Enhance contrast for better visibility
          data[i] = Math.max(0, Math.min(255, (data[i] - 128) * 1.5 + 128))
          data[i + 1] = Math.max(0, Math.min(255, (data[i + 1] - 128) * 1.5 + 128))
          data[i + 2] = Math.max(0, Math.min(255, (data[i + 2] - 128) * 1.5 + 128))
        }
        
        // Put the modified image data back
        ctx.putImageData(imageData, 0, 0)
        
        // Convert to data URL
        const processedDataUrl = canvas.toDataURL('image/png')
        resolve(processedDataUrl)
      }
      
      img.src = imageSrc
    })
  }

  const processImage = async () => {
    if (!selectedImage) return
    
    setIsProcessing(true)
    
    try {
      // Apply X-ray effect
      const xrayImage = await applyXRayEffect(selectedImage)
      setProcessedImage(xrayImage)
      
      // Simulate analysis (in a real app, this would call an AI service)
      setTimeout(() => {
        const mockResult = {
          hasPneumonia: Math.random() > 0.5,
          confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
          findings: [
            "Lung fields appear clear",
            "No obvious consolidation detected",
            "Pleural spaces are normal"
          ]
        }
        setAnalysisResult(mockResult)
        setIsProcessing(false)
      }, 2000)
    } catch (error) {
      console.error('Error processing image:', error)
      setIsProcessing(false)
    }
  }

  const resetProcessor = () => {
    setSelectedImage(null)
    setProcessedImage(null)
    setAnalysisResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Pneumonia X-Ray Image Processor
          </h1>
          <p className="text-blue-200 text-lg">
            Upload a chest X-ray image for analysis and X-ray effect processing
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 mb-8 border border-blue-500/20">
          <div className="text-center">
            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Choose X-Ray Image
              </label>
            </div>
            
            {selectedImage && (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={processImage}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  {isProcessing ? 'Processing...' : 'Process Image'}
                </button>
                <button
                  onClick={resetProcessor}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Image Display Section */}
        {(selectedImage || processedImage) && (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Original Image */}
            {selectedImage && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
                <h3 className="text-xl font-semibold text-white mb-4 text-center">
                  Original Image
                </h3>
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Original X-ray"
                    className="w-full h-80 object-contain rounded-lg bg-slate-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent rounded-lg"></div>
                </div>
              </div>
            )}

            {/* Processed Image */}
            {processedImage && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
                <h3 className="text-xl font-semibold text-white mb-4 text-center">
                  X-Ray Effect Applied
                </h3>
                <div className="relative">
                  <img
                    src={processedImage}
                    alt="Processed X-ray"
                    className="w-full h-80 object-contain rounded-lg bg-slate-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent rounded-lg"></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-blue-500/20">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">
              Analysis Results
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Diagnosis */}
              <div className="bg-slate-700/50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Diagnosis</h4>
                <div className="flex items-center mb-4">
                  <div className={`w-4 h-4 rounded-full mr-3 ${
                    analysisResult.hasPneumonia ? 'bg-red-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-white font-medium">
                    {analysisResult.hasPneumonia ? 'Pneumonia Detected' : 'No Pneumonia Detected'}
                  </span>
                </div>
                <div className="text-blue-200">
                  Confidence: {analysisResult.confidence}%
                </div>
              </div>

              {/* Findings */}
              <div className="bg-slate-700/50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Key Findings</h4>
                <ul className="space-y-2">
                  {analysisResult.findings.map((finding, index) => (
                    <li key={index} className="text-blue-200 flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-200 text-sm text-center">
                ⚠️ This is a demonstration tool. Results are simulated and should not be used for medical diagnosis. 
                Always consult with a qualified healthcare professional for medical advice.
              </p>
            </div>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-xl p-8 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-white text-lg">Processing X-Ray Image...</p>
              <p className="text-blue-200 text-sm mt-2">Applying X-ray effects and analyzing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default XRayProcessor