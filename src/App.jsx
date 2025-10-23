import { useState } from 'react'
import XRayProcessor from './pages/XRayProcessor'
import AdvancedXRayProcessor from './pages/AdvancedXRayProcessor'
import MethodologyFlow from './components/MethodologyFlow'
import ModelComparison from './components/ModelComparison'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-slate-800/90 backdrop-blur-sm border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              Medical Imaging Analysis Platform
            </h1>
            <div className="flex flex-wrap gap-2">
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
                Basic X-Ray
              </button>
              <button
                onClick={() => setCurrentPage('advanced')}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  currentPage === 'advanced'
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-200 hover:bg-blue-600/20'
                }`}
              >
                Advanced Analysis
              </button>
              <button
                onClick={() => setCurrentPage('methodology')}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  currentPage === 'methodology'
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-200 hover:bg-blue-600/20'
                }`}
              >
                Methodology
              </button>
              <button
                onClick={() => setCurrentPage('comparison')}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  currentPage === 'comparison'
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-200 hover:bg-blue-600/20'
                }`}
              >
                Model Comparison
              </button>
            </div>
          </div>
        </div>
      </nav>

        {/* Main Content */}
      <main>
        {currentPage === 'home' && (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
            <div className="text-center max-w-6xl mx-auto px-8">
              <h1 className="text-5xl font-bold text-white mb-6">
                Medical Imaging Analysis Platform
              </h1>
              <p className="text-xl text-blue-200 mb-8">
                Comprehensive AI-powered chest X-ray analysis with explainable results
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                  <div className="text-4xl mb-4">🫁</div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Basic X-Ray Analysis
                  </h3>
                  <p className="text-blue-200 mb-4 text-sm">
                    Simple X-ray processing with basic analysis
                  </p>
                  <button
                    onClick={() => setCurrentPage('xray')}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    Open Basic Tool
                  </button>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                  <div className="text-4xl mb-4">🧠</div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Advanced AI Analysis
                  </h3>
                  <p className="text-blue-200 mb-4 text-sm">
                    Full AI pipeline with heatmaps and model comparison
                  </p>
                  <button
                    onClick={() => setCurrentPage('advanced')}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    Open Advanced Tool
                  </button>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Methodology Flow
                  </h3>
                  <p className="text-blue-200 mb-4 text-sm">
                    View the complete project methodology and phases
                  </p>
                  <button
                    onClick={() => setCurrentPage('methodology')}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    View Methodology
                  </button>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                  <div className="text-4xl mb-4">⚖️</div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Model Comparison
                  </h3>
                  <p className="text-blue-200 mb-4 text-sm">
                    Compare different CNN models and their performance
                  </p>
                  <button
                    onClick={() => setCurrentPage('comparison')}
                    className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    Compare Models
                  </button>
                </div>
              </div>
              
              <div className="mt-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-8 border border-blue-500/20">
                <h2 className="text-2xl font-bold text-white mb-4">Project Overview</h2>
                <p className="text-blue-200 text-lg mb-6">
                  This platform implements a comprehensive 6-phase methodology for medical imaging analysis, 
                  from data preprocessing through model optimization to deployment. The system includes 
                  multiple CNN architectures, explainable AI with Grad-CAM, and real-time analysis capabilities.
                </p>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-400 mb-2">6</div>
                    <div className="text-blue-200">Implementation Phases</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-400 mb-2">4</div>
                    <div className="text-blue-200">CNN Models</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
                    <div className="text-blue-200">Explainable AI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {currentPage === 'xray' && <XRayProcessor />}
        {currentPage === 'advanced' && <AdvancedXRayProcessor />}
        {currentPage === 'methodology' && <MethodologyFlow />}
        {currentPage === 'comparison' && <ModelComparison />}
      </main>
    </div>
  )
}

export default App
