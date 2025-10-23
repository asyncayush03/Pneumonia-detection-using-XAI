import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  HardDrive, 
  Brain,
  Zap,
  Target,
  Award
} from 'lucide-react'

const ModelComparison = () => {
  const [selectedMetric, setSelectedMetric] = useState('accuracy')
  const [sortBy, setSortBy] = useState('accuracy')

  const models = [
    {
      name: 'VGG16',
      accuracy: 0.89,
      precision: 0.87,
      recall: 0.91,
      f1_score: 0.89,
      inference_time: 0.45,
      model_size: 528,
      parameters: 138000000,
      description: 'Deep CNN with 16 layers, excellent for feature extraction',
      pros: ['High accuracy', 'Good feature extraction', 'Proven architecture'],
      cons: ['Large model size', 'Slow inference', 'High memory usage']
    },
    {
      name: 'ResNet50',
      accuracy: 0.92,
      precision: 0.90,
      recall: 0.94,
      f1_score: 0.92,
      inference_time: 0.38,
      model_size: 98,
      parameters: 25600000,
      description: 'Residual Network with 50 layers, excellent performance',
      pros: ['Highest accuracy', 'Efficient training', 'Good generalization'],
      cons: ['Moderate size', 'Complex architecture']
    },
    {
      name: 'MobileNetV2',
      accuracy: 0.85,
      precision: 0.83,
      recall: 0.87,
      f1_score: 0.85,
      inference_time: 0.15,
      model_size: 14,
      parameters: 3500000,
      description: 'Lightweight CNN optimized for mobile devices',
      pros: ['Very fast inference', 'Small model size', 'Mobile optimized'],
      cons: ['Lower accuracy', 'Limited complexity']
    },
    {
      name: 'EfficientNet',
      accuracy: 0.94,
      precision: 0.93,
      recall: 0.95,
      f1_score: 0.94,
      inference_time: 0.25,
      model_size: 29,
      parameters: 5500000,
      description: 'Efficient CNN with compound scaling',
      pros: ['Best accuracy', 'Efficient scaling', 'Good speed'],
      cons: ['Newer architecture', 'Complex implementation']
    }
  ]

  const metrics = [
    { key: 'accuracy', label: 'Accuracy', icon: Target, color: 'text-green-400' },
    { key: 'precision', label: 'Precision', icon: TrendingUp, color: 'text-blue-400' },
    { key: 'recall', label: 'Recall', icon: Brain, color: 'text-purple-400' },
    { key: 'f1_score', label: 'F1-Score', icon: Award, color: 'text-yellow-400' },
    { key: 'inference_time', label: 'Inference Time', icon: Clock, color: 'text-red-400' },
    { key: 'model_size', label: 'Model Size', icon: HardDrive, color: 'text-orange-400' }
  ]

  const sortedModels = [...models].sort((a, b) => {
    if (sortBy === 'inference_time' || sortBy === 'model_size') {
      return a[sortBy] - b[sortBy] // Lower is better
    }
    return b[sortBy] - a[sortBy] // Higher is better
  })

  const getBestModel = (metric) => {
    if (metric === 'inference_time' || metric === 'model_size') {
      return sortedModels.reduce((best, current) => 
        current[metric] < best[metric] ? current : best
      )
    }
    return sortedModels.reduce((best, current) => 
      current[metric] > best[metric] ? current : best
    )
  }

  const formatValue = (value, metric) => {
    if (metric === 'accuracy' || metric === 'precision' || metric === 'recall' || metric === 'f1_score') {
      return `${(value * 100).toFixed(1)}%`
    } else if (metric === 'inference_time') {
      return `${value}s`
    } else if (metric === 'model_size') {
      return `${value}MB`
    }
    return value
  }

  const getBarWidth = (value, metric) => {
    const maxValue = Math.max(...models.map(m => m[metric]))
    const minValue = Math.min(...models.map(m => m[metric]))
    
    if (metric === 'inference_time' || metric === 'model_size') {
      // For these metrics, lower is better, so invert the calculation
      return ((maxValue - value) / (maxValue - minValue)) * 100
    }
    return (value / maxValue) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            CNN Model Comparison Dashboard
          </motion.h1>
          <p className="text-blue-200 text-lg">
            Comprehensive comparison of different CNN architectures for chest X-ray analysis
          </p>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-blue-500/20">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-blue-200 font-medium">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-slate-700 text-white rounded-lg border border-blue-500/20 focus:border-blue-500 focus:outline-none"
              >
                {metrics.map(metric => (
                  <option key={metric.key} value={metric.key}>
                    {metric.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="text-blue-200 font-medium">Highlight:</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 bg-slate-700 text-white rounded-lg border border-blue-500/20 focus:border-blue-500 focus:outline-none"
              >
                {metrics.map(metric => (
                  <option key={metric.key} value={metric.key}>
                    {metric.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Model Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {sortedModels.map((model, index) => {
            const isBest = getBestModel(selectedMetric).name === model.name
            const metricValue = model[selectedMetric]
            const barWidth = getBarWidth(metricValue, selectedMetric)
            
            return (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border-2 transition-all duration-300 ${
                  isBest 
                    ? 'border-yellow-500 bg-yellow-500/10' 
                    : 'border-blue-500/20 hover:border-blue-500/40'
                }`}
              >
                {/* Model Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${
                      isBest ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}>
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{model.name}</h3>
                      <p className="text-blue-200 text-sm">{model.description}</p>
                    </div>
                  </div>
                  {isBest && (
                    <div className="flex items-center text-yellow-400">
                      <Award className="w-5 h-5 mr-1" />
                      <span className="text-sm font-medium">Best</span>
                    </div>
                  )}
                </div>

                {/* Selected Metric Highlight */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-200 font-medium">
                      {metrics.find(m => m.key === selectedMetric)?.label}
                    </span>
                    <span className="text-white font-bold text-lg">
                      {formatValue(metricValue, selectedMetric)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-3 rounded-full ${
                        isBest ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                    />
                  </div>
                </div>

                {/* All Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {metrics.map(metric => {
                    const value = model[metric.key]
                    const isHighlighted = metric.key === selectedMetric
                    
                    return (
                      <div 
                        key={metric.key}
                        className={`p-3 rounded-lg transition-colors ${
                          isHighlighted 
                            ? 'bg-blue-600/20 border border-blue-500' 
                            : 'bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <metric.icon className={`w-4 h-4 ${metric.color}`} />
                          <span className="text-xs text-blue-200">{metric.label}</span>
                        </div>
                        <div className="text-white font-semibold">
                          {formatValue(value, metric.key)}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-2">Pros</h4>
                    <ul className="space-y-1">
                      {model.pros.map((pro, idx) => (
                        <li key={idx} className="text-xs text-green-200 flex items-start">
                          <span className="text-green-400 mr-1">•</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-2">Cons</h4>
                    <ul className="space-y-1">
                      {model.cons.map((con, idx) => (
                        <li key={idx} className="text-xs text-red-200 flex items-start">
                          <span className="text-red-400 mr-1">•</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Summary Statistics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-8 border border-blue-500/20"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Performance Summary
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {formatValue(Math.max(...models.map(m => m.accuracy)), 'accuracy')}
              </div>
              <div className="text-blue-200">Best Accuracy</div>
              <div className="text-sm text-gray-400">
                {getBestModel('accuracy').name}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {formatValue(Math.min(...models.map(m => m.inference_time)), 'inference_time')}
              </div>
              <div className="text-blue-200">Fastest Inference</div>
              <div className="text-sm text-gray-400">
                {getBestModel('inference_time').name}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {formatValue(Math.min(...models.map(m => m.model_size)), 'model_size')}
              </div>
              <div className="text-blue-200">Smallest Model</div>
              <div className="text-sm text-gray-400">
                {getBestModel('model_size').name}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ModelComparison