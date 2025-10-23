import { useState } from 'react'
import XRayProcessor from './pages/XRayProcessor'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-slate-800/90 backdrop-blur-sm border-b border-blue-500/20">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              Medical Imaging Tools
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentPage('home')}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  currentPage === 'home'
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-200 hover:bg-blue-600/20'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage('xray')}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  currentPage === 'xray'
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-200 hover:bg-blue-600/20'
                }`}
              >
                X-Ray Processor
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {currentPage === 'home' && (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
            <div className="text-center max-w-4xl mx-auto px-8">
              <h1 className="text-5xl font-bold text-white mb-6">
                Medical Imaging Analysis
              </h1>
              <p className="text-xl text-blue-200 mb-8">
                Advanced tools for medical image processing and analysis
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-blue-500/20">
                  <div className="text-4xl mb-4">🫁</div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    X-Ray Processor
                  </h3>
                  <p className="text-blue-200 mb-6">
                    Upload chest X-ray images and apply X-ray effects for pneumonia detection
                  </p>
                  <button
                    onClick={() => setCurrentPage('xray')}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    Open X-Ray Processor
                  </button>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-blue-500/20">
                  <div className="text-4xl mb-4">🔬</div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    More Tools Coming Soon
                  </h3>
                  <p className="text-blue-200 mb-6">
                    Additional medical imaging analysis tools will be available soon
                  </p>
                  <button
                    disabled
                    className="w-full px-6 py-3 bg-gray-600 text-gray-400 font-semibold rounded-lg cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {currentPage === 'xray' && <XRayProcessor />}
      </main>
    </div>
  )
}

export default App
