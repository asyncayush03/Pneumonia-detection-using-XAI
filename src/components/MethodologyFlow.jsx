import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Database, 
  Brain, 
  Eye, 
  Zap, 
  Code, 
  Rocket,
  ArrowRight,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react'

const MethodologyFlow = () => {
  const [activePhase, setActivePhase] = useState(null)

  const phases = [
    {
      id: 1,
      title: "Data Acquisition & Preprocessing",
      icon: Database,
      color: "from-blue-500 to-blue-600",
      description: "Acquire and preprocess chest X-ray datasets with data augmentation",
      activities: [
        "Acquire public chest X-ray datasets (NIH, Kaggle)",
        "Split data into training, validation, and testing sets",
        "Preprocess images (resize, normalize, enhance contrast)",
        "Apply data augmentation (rotation, scaling, flipping)",
        "Quality validation and filtering"
      ],
      outputs: "Standardized, augmented dataset ready for training",
      status: "completed"
    },
    {
      id: 2,
      title: "Architectural Investigation & Model Training",
      icon: Brain,
      color: "from-purple-500 to-purple-600",
      description: "Train and evaluate multiple CNN architectures for optimal performance",
      activities: [
        "Implement VGG16, ResNet50, MobileNetV2, EfficientNet",
        "Train models with transfer learning",
        "Evaluate on accuracy, precision, recall, F1-score",
        "Fine-tune hyperparameters",
        "Compare accuracy vs computational efficiency"
      ],
      outputs: "Best-performing model with performance metrics",
      status: "completed"
    },
    {
      id: 3,
      title: "Explainable AI (XAI) Implementation",
      icon: Eye,
      color: "from-green-500 to-green-600",
      description: "Integrate Grad-CAM for model interpretability and transparency",
      activities: [
        "Implement Grad-CAM algorithm",
        "Generate attention heatmaps for predictions",
        "Overlay heatmaps on X-ray images",
        "Create explanation mechanisms",
        "Validate attention patterns"
      ],
      outputs: "Explainable model with visual heatmap generation",
      status: "completed"
    },
    {
      id: 4,
      title: "Model Optimization & Refinement",
      icon: Zap,
      color: "from-orange-500 to-orange-600",
      description: "Optimize model for deployment with pruning and quantization",
      activities: [
        "Apply model pruning techniques",
        "Implement quantization (32-bit to 8-bit)",
        "Optimize inference speed",
        "Reduce model size",
        "Maintain accuracy performance"
      ],
      outputs: "Optimized, lightweight, explainable model",
      status: "completed"
    },
    {
      id: 5,
      title: "Application Development & Deployment",
      icon: Code,
      color: "from-red-500 to-red-600",
      description: "Build full-stack web application with real-time inference",
      activities: [
        "Develop Flask API for model inference",
        "Create React frontend with modern UI",
        "Implement image upload and processing",
        "Add real-time heatmap visualization",
        "Deploy with Docker containerization"
      ],
      outputs: "Fully functional web application prototype",
      status: "completed"
    },
    {
      id: 6,
      title: "Deployment & Monitoring",
      icon: Rocket,
      color: "from-indigo-500 to-indigo-600",
      description: "Deploy application and implement monitoring systems",
      activities: [
        "Containerize application with Docker",
        "Deploy to cloud platform",
        "Implement monitoring and logging",
        "Set up performance metrics",
        "Create user documentation"
      ],
      outputs: "Production-ready medical imaging analysis platform",
      status: "in_progress"
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-400" />
      default:
        return <Target className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-500/10'
      case 'in_progress':
        return 'border-yellow-500 bg-yellow-500/10'
      default:
        return 'border-gray-500 bg-gray-500/10'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Project Methodology Flow
          </motion.h1>
          <p className="text-blue-200 text-lg max-w-3xl mx-auto">
            A structured, phased approach from foundational data work through to the final deployed product, 
            highlighting critical decision points and outputs.
          </p>
        </div>

        {/* Methodology Flow */}
        <div className="space-y-8">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Phase Card */}
              <div 
                className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
                  activePhase === phase.id 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : getStatusColor(phase.status)
                }`}
                onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
              >
                <div className="flex items-start space-x-6">
                  {/* Phase Icon */}
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${phase.color} flex-shrink-0`}>
                    <phase.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Phase Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-white">
                        Phase {phase.id}: {phase.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(phase.status)}
                        <span className="text-sm font-medium text-blue-200 capitalize">
                          {phase.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-blue-200 text-lg mb-6">
                      {phase.description}
                    </p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <div className="text-sm text-blue-200 mb-1">Activities</div>
                        <div className="text-white font-semibold">{phase.activities.length}</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <div className="text-sm text-blue-200 mb-1">Output</div>
                        <div className="text-white font-semibold text-sm">Key Deliverable</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <div className="text-sm text-blue-200 mb-1">Status</div>
                        <div className="text-white font-semibold capitalize">
                          {phase.status.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                <motion.div
                  initial={false}
                  animate={{ 
                    height: activePhase === phase.id ? 'auto' : 0,
                    opacity: activePhase === phase.id ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-blue-500/20 pt-6 mt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Activities */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Key Activities</h4>
                        <ul className="space-y-2">
                          {phase.activities.map((activity, idx) => (
                            <li key={idx} className="flex items-start text-blue-200">
                              <span className="text-blue-400 mr-2 mt-1">•</span>
                              <span className="text-sm">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Outputs */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Expected Outputs</h4>
                        <div className="bg-slate-700/50 rounded-lg p-4">
                          <p className="text-blue-200 text-sm">{phase.outputs}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Arrow to Next Phase */}
              {index < phases.length - 1 && (
                <div className="flex justify-center my-6">
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-blue-400"
                  >
                    <ArrowRight className="w-8 h-8 rotate-90" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-8 border border-blue-500/20"
        >
          <h3 className="text-2xl font-bold text-white mb-4 text-center">
            Methodology Summary
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">6</div>
              <div className="text-blue-200">Distinct Phases</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">5</div>
              <div className="text-blue-200">Completed Phases</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">1</div>
              <div className="text-blue-200">In Progress</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MethodologyFlow