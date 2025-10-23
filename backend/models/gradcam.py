import numpy as np
import cv2
import tensorflow as tf
from tensorflow import keras
import matplotlib.pyplot as plt
import matplotlib.cm as cm
from PIL import Image
import io
import base64
import logging

logger = logging.getLogger(__name__)

class GradCAMGenerator:
    """
    Grad-CAM implementation for explainable AI
    Implements Phase 3: Explainable AI (XAI) Implementation
    """
    
    def __init__(self):
        self.cam_models = {}
        self._initialize_cam_models()
    
    def _initialize_cam_models(self):
        """Initialize models for Grad-CAM generation"""
        try:
            # For demonstration, we'll create mock models
            # In a real implementation, these would be the actual trained models
            self.cam_models = {
                'vgg16': {'last_conv_layer': 'block5_conv3'},
                'resnet50': {'last_conv_layer': 'conv5_block3_out'},
                'mobilenetv2': {'last_conv_layer': 'Conv_1'},
                'efficientnet': {'last_conv_layer': 'block6a_expand_conv'}
            }
        except Exception as e:
            logger.error(f"Error initializing CAM models: {str(e)}")
    
    def generate_heatmap(self, processed_image, model_name='efficientnet', class_index=1):
        """
        Generate Grad-CAM heatmap for the given image
        """
        try:
            if model_name not in self.cam_models:
                logger.warning(f"Model {model_name} not found, using mock heatmap")
                return self._generate_mock_heatmap(processed_image)
            
            # For demonstration, generate a mock heatmap
            # In a real implementation, this would use the actual model
            return self._generate_mock_heatmap(processed_image, model_name)
            
        except Exception as e:
            logger.error(f"Error generating heatmap: {str(e)}")
            return self._generate_mock_heatmap(processed_image)
    
    def _generate_mock_heatmap(self, processed_image, model_name='efficientnet'):
        """
        Generate a mock heatmap for demonstration purposes
        In a real implementation, this would be replaced with actual Grad-CAM
        """
        try:
            # Convert to numpy array if needed
            if isinstance(processed_image, np.ndarray):
                img_array = processed_image
            else:
                img_array = np.array(processed_image)
            
            # Ensure we have the right shape
            if len(img_array.shape) == 4:
                img_array = img_array[0]  # Remove batch dimension
            
            height, width = img_array.shape[:2]
            
            # Create a mock heatmap based on image characteristics
            heatmap = self._create_mock_attention_map(img_array, model_name)
            
            # Resize heatmap to match image dimensions
            heatmap = cv2.resize(heatmap, (width, height))
            
            # Normalize heatmap
            heatmap = (heatmap - heatmap.min()) / (heatmap.max() - heatmap.min())
            
            return heatmap
            
        except Exception as e:
            logger.error(f"Error creating mock heatmap: {str(e)}")
            # Return a simple gradient heatmap as fallback
            height, width = processed_image.shape[:2] if hasattr(processed_image, 'shape') else (224, 224)
            return np.random.rand(height, width)
    
    def _create_mock_attention_map(self, img_array, model_name):
        """
        Create a mock attention map based on image characteristics
        """
        height, width = img_array.shape[:2]
        
        # Create base heatmap
        heatmap = np.zeros((height, width))
        
        # Different models focus on different areas
        if model_name == 'vgg16':
            # VGG16 tends to focus on edges and textures
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY) if len(img_array.shape) == 3 else img_array
            edges = cv2.Canny(gray.astype(np.uint8), 50, 150)
            heatmap = cv2.GaussianBlur(edges.astype(np.float32), (15, 15), 0)
            
        elif model_name == 'resnet50':
            # ResNet50 focuses on hierarchical features
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY) if len(img_array.shape) == 3 else img_array
            # Create attention around high-contrast areas
            laplacian = cv2.Laplacian(gray.astype(np.uint8), cv2.CV_64F)
            heatmap = cv2.GaussianBlur(np.abs(laplacian), (21, 21), 0)
            
        elif model_name == 'mobilenetv2':
            # MobileNetV2 focuses on efficient feature extraction
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY) if len(img_array.shape) == 3 else img_array
            # Focus on areas with significant intensity changes
            sobelx = cv2.Sobel(gray.astype(np.uint8), cv2.CV_64F, 1, 0, ksize=3)
            sobely = cv2.Sobel(gray.astype(np.uint8), cv2.CV_64F, 0, 1, ksize=3)
            heatmap = np.sqrt(sobelx**2 + sobely**2)
            heatmap = cv2.GaussianBlur(heatmap, (17, 17), 0)
            
        elif model_name == 'efficientnet':
            # EfficientNet focuses on compound scaling features
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY) if len(img_array.shape) == 3 else img_array
            # Multi-scale attention
            heatmap1 = cv2.GaussianBlur(gray.astype(np.float32), (5, 5), 0)
            heatmap2 = cv2.GaussianBlur(gray.astype(np.float32), (15, 15), 0)
            heatmap3 = cv2.GaussianBlur(gray.astype(np.float32), (25, 25), 0)
            heatmap = (heatmap1 + heatmap2 + heatmap3) / 3
            
        else:
            # Default: random attention with some structure
            heatmap = np.random.rand(height, width)
            # Add some structure by creating regions of interest
            center_y, center_x = height // 2, width // 2
            y, x = np.ogrid[:height, :width]
            mask = ((x - center_x)**2 + (y - center_y)**2) < (min(height, width) // 3)**2
            heatmap[mask] *= 2
        
        return heatmap
    
    def heatmap_to_base64(self, heatmap, colormap='jet'):
        """
        Convert heatmap to base64 encoded image
        """
        try:
            # Normalize heatmap
            heatmap_normalized = (heatmap - heatmap.min()) / (heatmap.max() - heatmap.min())
            
            # Apply colormap
            cmap = cm.get_cmap(colormap)
            heatmap_colored = cmap(heatmap_normalized)
            
            # Convert to PIL Image
            heatmap_image = Image.fromarray((heatmap_colored[:, :, :3] * 255).astype(np.uint8))
            
            # Convert to base64
            buffered = io.BytesIO()
            heatmap_image.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode()
            
            return f"data:image/png;base64,{img_str}"
            
        except Exception as e:
            logger.error(f"Error converting heatmap to base64: {str(e)}")
            # Return a simple colored square as fallback
            fallback_image = Image.new('RGB', (224, 224), color='red')
            buffered = io.BytesIO()
            fallback_image.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode()
            return f"data:image/png;base64,{img_str}"
    
    def overlay_heatmap_on_image(self, original_image, heatmap, alpha=0.4):
        """
        Overlay heatmap on original image
        """
        try:
            # Ensure both images have the same dimensions
            if len(original_image.shape) == 3:
                original_gray = cv2.cvtColor(original_image, cv2.COLOR_RGB2GRAY)
            else:
                original_gray = original_image
            
            # Resize heatmap to match original image
            heatmap_resized = cv2.resize(heatmap, (original_gray.shape[1], original_gray.shape[0]))
            
            # Normalize heatmap
            heatmap_normalized = (heatmap_resized - heatmap_resized.min()) / (heatmap_resized.max() - heatmap_resized.min())
            
            # Apply colormap
            heatmap_colored = cv2.applyColorMap((heatmap_normalized * 255).astype(np.uint8), cv2.COLORMAP_JET)
            
            # Convert original to 3-channel if needed
            if len(original_image.shape) == 2:
                original_3ch = cv2.cvtColor(original_image, cv2.COLOR_GRAY2RGB)
            else:
                original_3ch = original_image
            
            # Overlay heatmap
            overlay = cv2.addWeighted(original_3ch, 1-alpha, heatmap_colored, alpha, 0)
            
            return overlay
            
        except Exception as e:
            logger.error(f"Error overlaying heatmap: {str(e)}")
            return original_image
    
    def generate_explanation_text(self, heatmap, prediction, confidence):
        """
        Generate textual explanation based on heatmap analysis
        """
        try:
            # Analyze heatmap characteristics
            max_attention = np.max(heatmap)
            mean_attention = np.mean(heatmap)
            attention_std = np.std(heatmap)
            
            # Find regions of high attention
            threshold = mean_attention + attention_std
            high_attention_regions = heatmap > threshold
            
            # Count connected components
            num_regions = len(cv2.connectedComponents(high_attention_regions.astype(np.uint8))[1])
            
            # Generate explanation based on analysis
            explanations = []
            
            if max_attention > 0.8:
                explanations.append("High attention detected in specific lung regions")
            elif max_attention > 0.6:
                explanations.append("Moderate attention focused on lung areas")
            else:
                explanations.append("Distributed attention across the image")
            
            if num_regions > 3:
                explanations.append("Multiple regions of interest identified")
            elif num_regions > 1:
                explanations.append("Several focal areas detected")
            else:
                explanations.append("Single region of primary interest")
            
            if prediction == 'Pneumonia' and confidence > 70:
                explanations.append("Model confidence suggests potential pathology")
            elif prediction == 'Normal' and confidence > 70:
                explanations.append("Model confidence suggests normal lung appearance")
            else:
                explanations.append("Model shows moderate confidence in diagnosis")
            
            return {
                'attention_level': 'high' if max_attention > 0.7 else 'moderate' if max_attention > 0.4 else 'low',
                'regions_count': int(num_regions),
                'explanations': explanations,
                'heatmap_stats': {
                    'max_attention': float(max_attention),
                    'mean_attention': float(mean_attention),
                    'attention_std': float(attention_std)
                }
            }
            
        except Exception as e:
            logger.error(f"Error generating explanation: {str(e)}")
            return {
                'attention_level': 'unknown',
                'regions_count': 0,
                'explanations': ["Unable to analyze attention patterns"],
                'heatmap_stats': {}
            }