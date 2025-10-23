import numpy as np
import cv2
from PIL import Image
import logging

logger = logging.getLogger(__name__)

class ImageProcessor:
    """
    Image processing utilities for medical imaging
    Implements Phase 1: Data Acquisition & Preprocessing
    """
    
    def __init__(self):
        self.target_size = (224, 224)
        self.normalization_mean = [0.485, 0.456, 0.406]
        self.normalization_std = [0.229, 0.224, 0.225]
    
    def preprocess_for_model(self, image, target_size=(224, 224)):
        """
        Preprocess image for CNN model input
        """
        try:
            # Convert PIL to numpy array
            if isinstance(image, Image.Image):
                image_array = np.array(image)
            else:
                image_array = image
            
            # Convert to RGB if needed
            if len(image_array.shape) == 3 and image_array.shape[2] == 4:
                image_array = cv2.cvtColor(image_array, cv2.COLOR_RGBA2RGB)
            elif len(image_array.shape) == 2:
                image_array = cv2.cvtColor(image_array, cv2.COLOR_GRAY2RGB)
            
            # Resize image
            resized_image = cv2.resize(image_array, target_size)
            
            # Normalize pixel values to [0, 1]
            normalized_image = resized_image.astype(np.float32) / 255.0
            
            # Apply ImageNet normalization
            normalized_image = self._apply_imagenet_normalization(normalized_image)
            
            return normalized_image
            
        except Exception as e:
            logger.error(f"Error preprocessing image: {str(e)}")
            # Return a default processed image
            return self._create_default_processed_image(target_size)
    
    def _apply_imagenet_normalization(self, image):
        """Apply ImageNet normalization"""
        try:
            normalized = np.zeros_like(image)
            for i in range(3):
                normalized[:, :, i] = (image[:, :, i] - self.normalization_mean[i]) / self.normalization_std[i]
            return normalized
        except Exception as e:
            logger.error(f"Error applying ImageNet normalization: {str(e)}")
            return image
    
    def _create_default_processed_image(self, target_size):
        """Create a default processed image as fallback"""
        return np.random.rand(*target_size, 3).astype(np.float32)
    
    def enhance_contrast(self, image, method='clahe'):
        """
        Enhance image contrast for better visibility
        """
        try:
            if len(image.shape) == 3:
                # Convert to LAB color space
                lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
                l, a, b = cv2.split(lab)
                
                if method == 'clahe':
                    # Apply CLAHE to L channel
                    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
                    l = clahe.apply(l)
                elif method == 'histogram':
                    # Apply histogram equalization
                    l = cv2.equalizeHist(l)
                
                # Merge channels and convert back
                enhanced_lab = cv2.merge([l, a, b])
                enhanced_image = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2RGB)
            else:
                # Grayscale image
                if method == 'clahe':
                    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
                    enhanced_image = clahe.apply(image)
                else:
                    enhanced_image = cv2.equalizeHist(image)
            
            return enhanced_image
            
        except Exception as e:
            logger.error(f"Error enhancing contrast: {str(e)}")
            return image
    
    def apply_xray_effect(self, image):
        """
        Apply X-ray effect to image (invert and enhance)
        """
        try:
            # Convert to numpy array if needed
            if isinstance(image, Image.Image):
                image_array = np.array(image)
            else:
                image_array = image
            
            # Invert colors for X-ray effect
            inverted = 255 - image_array
            
            # Enhance contrast
            enhanced = self.enhance_contrast(inverted, method='clahe')
            
            return enhanced
            
        except Exception as e:
            logger.error(f"Error applying X-ray effect: {str(e)}")
            return image
    
    def detect_lung_region(self, image):
        """
        Detect lung region in chest X-ray
        """
        try:
            # Convert to grayscale
            if len(image.shape) == 3:
                gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
            else:
                gray = image
            
            # Apply Gaussian blur
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            
            # Apply threshold
            _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            
            # Find contours
            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            # Find the largest contour (likely the lung region)
            if contours:
                largest_contour = max(contours, key=cv2.contourArea)
                
                # Create mask
                mask = np.zeros_like(gray)
                cv2.fillPoly(mask, [largest_contour], 255)
                
                return mask, largest_contour
            else:
                # Return full image if no contours found
                return np.ones_like(gray) * 255, None
                
        except Exception as e:
            logger.error(f"Error detecting lung region: {str(e)}")
            # Return full image as fallback
            if len(image.shape) == 3:
                gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
            else:
                gray = image
            return np.ones_like(gray) * 255, None
    
    def crop_to_lung_region(self, image, padding=0.1):
        """
        Crop image to focus on lung region
        """
        try:
            mask, contour = self.detect_lung_region(image)
            
            if contour is not None:
                # Get bounding rectangle
                x, y, w, h = cv2.boundingRect(contour)
                
                # Add padding
                height, width = image.shape[:2]
                pad_x = int(w * padding)
                pad_y = int(h * padding)
                
                x = max(0, x - pad_x)
                y = max(0, y - pad_y)
                w = min(width - x, w + 2 * pad_x)
                h = min(height - y, h + 2 * pad_y)
                
                # Crop image
                cropped = image[y:y+h, x:x+w]
                
                return cropped
            else:
                return image
                
        except Exception as e:
            logger.error(f"Error cropping to lung region: {str(e)}")
            return image
    
    def resize_with_aspect_ratio(self, image, target_size, maintain_aspect=True):
        """
        Resize image while maintaining aspect ratio
        """
        try:
            if not maintain_aspect:
                return cv2.resize(image, target_size)
            
            h, w = image.shape[:2]
            target_w, target_h = target_size
            
            # Calculate scaling factor
            scale = min(target_w / w, target_h / h)
            
            # Calculate new dimensions
            new_w = int(w * scale)
            new_h = int(h * scale)
            
            # Resize image
            resized = cv2.resize(image, (new_w, new_h))
            
            # Create canvas with target size
            canvas = np.zeros((target_h, target_w, image.shape[2] if len(image.shape) == 3 else 1), dtype=image.dtype)
            
            # Calculate position to center the image
            y_offset = (target_h - new_h) // 2
            x_offset = (target_w - new_w) // 2
            
            # Place resized image on canvas
            if len(image.shape) == 3:
                canvas[y_offset:y_offset+new_h, x_offset:x_offset+new_w] = resized
            else:
                canvas[y_offset:y_offset+new_h, x_offset:x_offset+new_w, 0] = resized
            
            return canvas
            
        except Exception as e:
            logger.error(f"Error resizing with aspect ratio: {str(e)}")
            return cv2.resize(image, target_size)
    
    def validate_image_quality(self, image):
        """
        Validate image quality for analysis
        """
        try:
            quality_issues = []
            
            # Check image dimensions
            if len(image.shape) == 3:
                h, w, c = image.shape
            else:
                h, w = image.shape
                c = 1
            
            if h < 100 or w < 100:
                quality_issues.append("Image resolution too low")
            
            # Check for very dark or very bright images
            if len(image.shape) == 3:
                gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
            else:
                gray = image
            
            mean_intensity = np.mean(gray)
            if mean_intensity < 30:
                quality_issues.append("Image too dark")
            elif mean_intensity > 225:
                quality_issues.append("Image too bright")
            
            # Check contrast
            std_intensity = np.std(gray)
            if std_intensity < 20:
                quality_issues.append("Low contrast image")
            
            # Check for blur
            laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
            if laplacian_var < 100:
                quality_issues.append("Image appears blurred")
            
            return {
                'is_valid': len(quality_issues) == 0,
                'issues': quality_issues,
                'quality_score': self._calculate_quality_score(gray, laplacian_var, std_intensity)
            }
            
        except Exception as e:
            logger.error(f"Error validating image quality: {str(e)}")
            return {
                'is_valid': False,
                'issues': [f"Validation error: {str(e)}"],
                'quality_score': 0
            }
    
    def _calculate_quality_score(self, gray_image, laplacian_var, std_intensity):
        """Calculate overall image quality score"""
        try:
            # Normalize metrics
            sharpness_score = min(laplacian_var / 1000, 1.0)  # Normalize to 0-1
            contrast_score = min(std_intensity / 100, 1.0)    # Normalize to 0-1
            
            # Calculate overall quality score
            quality_score = (sharpness_score + contrast_score) / 2
            
            return min(max(quality_score, 0), 1)
            
        except Exception as e:
            logger.error(f"Error calculating quality score: {str(e)}")
            return 0.5