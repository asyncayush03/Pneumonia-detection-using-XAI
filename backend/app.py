from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import numpy as np
import cv2
from PIL import Image
import io
import base64
import json
import os
from datetime import datetime
import logging

# Import our custom modules
from models.cnn_models import CNNModelManager
from models.gradcam import GradCAMGenerator
from utils.image_processing import ImageProcessor
from utils.data_augmentation import DataAugmentation
from utils.model_optimization import ModelOptimization

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize components
model_manager = CNNModelManager()
gradcam_generator = GradCAMGenerator()
image_processor = ImageProcessor()
data_augmentation = DataAugmentation()
model_optimization = ModelOptimization()

# Configuration
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_image_size(file):
    """Validate image size and dimensions"""
    try:
        img = Image.open(file)
        width, height = img.size
        
        # Check if image is too large
        if width > 4096 or height > 4096:
            return False, "Image dimensions too large. Maximum 4096x4096 pixels allowed."
        
        # Check file size
        file.seek(0, 2)  # Seek to end
        file_size = file.tell()
        file.seek(0)  # Reset to beginning
        
        if file_size > MAX_FILE_SIZE:
            return False, f"File too large. Maximum {MAX_FILE_SIZE // (1024*1024)}MB allowed."
        
        return True, "Valid"
    except Exception as e:
        return False, f"Invalid image file: {str(e)}"

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/models', methods=['GET'])
def get_available_models():
    """Get list of available CNN models"""
    try:
        models = model_manager.get_available_models()
        return jsonify({
            'success': True,
            'models': models
        })
    except Exception as e:
        logger.error(f"Error getting models: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    """Analyze uploaded chest X-ray image"""
    try:
        # Check if image file is present
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No image file provided'
            }), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No image file selected'
            }), 400
        
        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'error': 'Invalid file type. Only image files are allowed.'
            }), 400
        
        # Validate image
        is_valid, message = validate_image_size(file)
        if not is_valid:
            return jsonify({
                'success': False,
                'error': message
            }), 400
        
        # Get model type from request
        model_type = request.form.get('model_type', 'efficientnet')
        
        # Process the image
        file.seek(0)
        image_data = file.read()
        
        # Convert to PIL Image
        pil_image = Image.open(io.BytesIO(image_data))
        
        # Preprocess image
        processed_image = image_processor.preprocess_for_model(pil_image)
        
        # Run inference
        prediction_result = model_manager.predict(processed_image, model_type)
        
        # Generate Grad-CAM heatmap
        heatmap = gradcam_generator.generate_heatmap(processed_image, model_type)
        
        # Convert heatmap to base64
        heatmap_base64 = gradcam_generator.heatmap_to_base64(heatmap)
        
        # Save original image for reference
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"xray_{timestamp}_{file.filename}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        pil_image.save(file_path)
        
        # Prepare response
        response_data = {
            'success': True,
            'analysis': {
                'prediction': prediction_result['prediction'],
                'confidence': prediction_result['confidence'],
                'probabilities': prediction_result['probabilities'],
                'model_used': model_type,
                'processing_time': prediction_result['processing_time']
            },
            'heatmap': heatmap_base64,
            'image_info': {
                'filename': filename,
                'dimensions': pil_image.size,
                'file_size': len(image_data)
            },
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"Error analyzing image: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Analysis failed: {str(e)}'
        }), 500

@app.route('/api/compare-models', methods=['POST'])
def compare_models():
    """Compare different CNN models on the same image"""
    try:
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No image file provided'
            }), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No image file selected'
            }), 400
        
        # Process the image
        file.seek(0)
        image_data = file.read()
        pil_image = Image.open(io.BytesIO(image_data))
        processed_image = image_processor.preprocess_for_model(pil_image)
        
        # Get available models
        available_models = model_manager.get_available_models()
        comparison_results = {}
        
        for model_type in available_models:
            try:
                result = model_manager.predict(processed_image, model_type)
                comparison_results[model_type] = {
                    'prediction': result['prediction'],
                    'confidence': result['confidence'],
                    'probabilities': result['probabilities'],
                    'processing_time': result['processing_time']
                }
            except Exception as e:
                comparison_results[model_type] = {
                    'error': str(e)
                }
        
        return jsonify({
            'success': True,
            'comparison': comparison_results,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error comparing models: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Model comparison failed: {str(e)}'
        }), 500

@app.route('/api/augment', methods=['POST'])
def augment_image():
    """Apply data augmentation to uploaded image"""
    try:
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No image file provided'
            }), 400
        
        file = request.files['image']
        augmentation_type = request.form.get('type', 'rotation')
        
        # Process the image
        file.seek(0)
        image_data = file.read()
        pil_image = Image.open(io.BytesIO(image_data))
        
        # Apply augmentation
        augmented_image = data_augmentation.apply_augmentation(pil_image, augmentation_type)
        
        # Convert to base64
        buffered = io.BytesIO()
        augmented_image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return jsonify({
            'success': True,
            'augmented_image': f"data:image/png;base64,{img_str}",
            'augmentation_type': augmentation_type,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error augmenting image: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Augmentation failed: {str(e)}'
        }), 500

@app.route('/api/uploaded-images', methods=['GET'])
def get_uploaded_images():
    """Get list of uploaded images"""
    try:
        images = []
        for filename in os.listdir(UPLOAD_FOLDER):
            if filename.lower().endswith(tuple(ALLOWED_EXTENSIONS)):
                file_path = os.path.join(UPLOAD_FOLDER, filename)
                file_stats = os.stat(file_path)
                images.append({
                    'filename': filename,
                    'size': file_stats.st_size,
                    'modified': datetime.fromtimestamp(file_stats.st_mtime).isoformat()
                })
        
        return jsonify({
            'success': True,
            'images': images
        })
        
    except Exception as e:
        logger.error(f"Error getting uploaded images: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/optimize-model', methods=['POST'])
def optimize_model():
    """Optimize model for deployment"""
    try:
        data = request.get_json()
        model_type = data.get('model_type', 'efficientnet')
        optimization_type = data.get('optimization_type', 'quantization')
        target_size_mb = data.get('target_size_mb', 10.0)
        
        # Get model info
        model_info = model_manager.get_model_info(model_type)
        if not model_info:
            return jsonify({
                'success': False,
                'error': f'Model {model_type} not found'
            }), 400
        
        # Add performance metrics
        performance_metrics = model_manager.get_model_performance_metrics()
        model_info.update(performance_metrics.get(model_type, {}))
        
        # Optimize model
        optimization_result = model_optimization.optimize_model(
            model_info, optimization_type, target_size_mb
        )
        
        return jsonify({
            'success': True,
            'optimization_result': optimization_result
        })
        
    except Exception as e:
        logger.error(f"Error optimizing model: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/compare-optimizations', methods=['POST'])
def compare_optimizations():
    """Compare different optimization strategies"""
    try:
        data = request.get_json()
        model_type = data.get('model_type', 'efficientnet')
        target_size_mb = data.get('target_size_mb', 10.0)
        
        # Get model info
        model_info = model_manager.get_model_info(model_type)
        if not model_info:
            return jsonify({
                'success': False,
                'error': f'Model {model_type} not found'
            }), 400
        
        # Add performance metrics
        performance_metrics = model_manager.get_model_performance_metrics()
        model_info.update(performance_metrics.get(model_type, {}))
        
        # Compare optimizations
        comparison_result = model_optimization.compare_optimization_strategies(
            model_info, target_size_mb
        )
        
        return jsonify({
            'success': True,
            'comparison_result': comparison_result
        })
        
    except Exception as e:
        logger.error(f"Error comparing optimizations: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/optimization-report', methods=['POST'])
def get_optimization_report():
    """Get comprehensive optimization report"""
    try:
        data = request.get_json()
        model_type = data.get('model_type', 'efficientnet')
        target_size_mb = data.get('target_size_mb', 10.0)
        
        # Get model info
        model_info = model_manager.get_model_info(model_type)
        if not model_info:
            return jsonify({
                'success': False,
                'error': f'Model {model_type} not found'
            }), 400
        
        # Add performance metrics
        performance_metrics = model_manager.get_model_performance_metrics()
        model_info.update(performance_metrics.get(model_type, {}))
        
        # Generate report
        report = model_optimization.get_optimization_report(model_info, target_size_mb)
        
        return jsonify({
            'success': True,
            'report': report
        })
        
    except Exception as e:
        logger.error(f"Error generating optimization report: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)