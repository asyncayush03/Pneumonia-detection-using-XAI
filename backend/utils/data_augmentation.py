import numpy as np
import cv2
from PIL import Image, ImageEnhance, ImageOps
import random
import logging

logger = logging.getLogger(__name__)

class DataAugmentation:
    """
    Data augmentation utilities for medical imaging
    Implements Phase 1: Data Augmentation
    """
    
    def __init__(self):
        self.augmentation_methods = {
            'rotation': self._apply_rotation,
            'flip': self._apply_flip,
            'brightness': self._apply_brightness,
            'contrast': self._apply_contrast,
            'noise': self._apply_noise,
            'blur': self._apply_blur,
            'zoom': self._apply_zoom,
            'translation': self._apply_translation,
            'elastic': self._apply_elastic_transform
        }
    
    def apply_augmentation(self, image, augmentation_type='rotation', intensity=0.5):
        """
        Apply specified augmentation to image
        """
        try:
            if augmentation_type not in self.augmentation_methods:
                logger.warning(f"Unknown augmentation type: {augmentation_type}")
                return image
            
            # Convert PIL to numpy if needed
            if isinstance(image, Image.Image):
                image_array = np.array(image)
                is_pil = True
            else:
                image_array = image
                is_pil = False
            
            # Apply augmentation
            augmented = self.augmentation_methods[augmentation_type](image_array, intensity)
            
            # Convert back to PIL if original was PIL
            if is_pil:
                return Image.fromarray(augmented)
            else:
                return augmented
                
        except Exception as e:
            logger.error(f"Error applying augmentation {augmentation_type}: {str(e)}")
            return image
    
    def apply_random_augmentation(self, image, num_augmentations=1):
        """
        Apply random augmentations to image
        """
        try:
            augmented = image
            
            for _ in range(num_augmentations):
                # Randomly select augmentation type
                aug_type = random.choice(list(self.augmentation_methods.keys()))
                intensity = random.uniform(0.3, 0.7)
                
                augmented = self.apply_augmentation(augmented, aug_type, intensity)
            
            return augmented
            
        except Exception as e:
            logger.error(f"Error applying random augmentation: {str(e)}")
            return image
    
    def _apply_rotation(self, image, intensity):
        """Apply rotation augmentation"""
        try:
            # Convert intensity to rotation angle (-30 to 30 degrees)
            angle = (intensity - 0.5) * 60
            
            h, w = image.shape[:2]
            center = (w // 2, h // 2)
            
            # Create rotation matrix
            rotation_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
            
            # Apply rotation
            rotated = cv2.warpAffine(image, rotation_matrix, (w, h), 
                                   flags=cv2.INTER_LINEAR, 
                                   borderMode=cv2.BORDER_REFLECT_101)
            
            return rotated
            
        except Exception as e:
            logger.error(f"Error applying rotation: {str(e)}")
            return image
    
    def _apply_flip(self, image, intensity):
        """Apply flip augmentation"""
        try:
            # Randomly choose horizontal or vertical flip
            if random.random() < 0.5:
                return cv2.flip(image, 1)  # Horizontal flip
            else:
                return cv2.flip(image, 0)  # Vertical flip
                
        except Exception as e:
            logger.error(f"Error applying flip: {str(e)}")
            return image
    
    def _apply_brightness(self, image, intensity):
        """Apply brightness augmentation"""
        try:
            # Convert intensity to brightness factor (0.5 to 1.5)
            brightness_factor = 0.5 + intensity
            
            if len(image.shape) == 3:
                # Color image
                hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
                hsv[:, :, 2] = np.clip(hsv[:, :, 2] * brightness_factor, 0, 255)
                brightened = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
            else:
                # Grayscale image
                brightened = np.clip(image * brightness_factor, 0, 255)
            
            return brightened.astype(np.uint8)
            
        except Exception as e:
            logger.error(f"Error applying brightness: {str(e)}")
            return image
    
    def _apply_contrast(self, image, intensity):
        """Apply contrast augmentation"""
        try:
            # Convert intensity to contrast factor (0.5 to 1.5)
            contrast_factor = 0.5 + intensity
            
            if len(image.shape) == 3:
                # Color image
                contrasted = np.clip((image - 128) * contrast_factor + 128, 0, 255)
            else:
                # Grayscale image
                contrasted = np.clip((image - 128) * contrast_factor + 128, 0, 255)
            
            return contrasted.astype(np.uint8)
            
        except Exception as e:
            logger.error(f"Error applying contrast: {str(e)}")
            return image
    
    def _apply_noise(self, image, intensity):
        """Apply noise augmentation"""
        try:
            # Convert intensity to noise level
            noise_level = intensity * 25  # 0 to 25
            
            # Generate Gaussian noise
            noise = np.random.normal(0, noise_level, image.shape)
            
            # Add noise to image
            noisy = np.clip(image.astype(np.float32) + noise, 0, 255)
            
            return noisy.astype(np.uint8)
            
        except Exception as e:
            logger.error(f"Error applying noise: {str(e)}")
            return image
    
    def _apply_blur(self, image, intensity):
        """Apply blur augmentation"""
        try:
            # Convert intensity to blur kernel size
            kernel_size = int(1 + intensity * 4)  # 1 to 5
            if kernel_size % 2 == 0:
                kernel_size += 1
            
            # Apply Gaussian blur
            blurred = cv2.GaussianBlur(image, (kernel_size, kernel_size), 0)
            
            return blurred
            
        except Exception as e:
            logger.error(f"Error applying blur: {str(e)}")
            return image
    
    def _apply_zoom(self, image, intensity):
        """Apply zoom augmentation"""
        try:
            h, w = image.shape[:2]
            
            # Convert intensity to zoom factor (0.8 to 1.2)
            zoom_factor = 0.8 + intensity * 0.4
            
            # Calculate new dimensions
            new_h = int(h * zoom_factor)
            new_w = int(w * zoom_factor)
            
            # Resize image
            if zoom_factor > 1:
                # Zoom in - crop center
                resized = cv2.resize(image, (new_w, new_h))
                start_y = (new_h - h) // 2
                start_x = (new_w - w) // 2
                zoomed = resized[start_y:start_y+h, start_x:start_x+w]
            else:
                # Zoom out - pad with black
                resized = cv2.resize(image, (new_w, new_h))
                zoomed = np.zeros_like(image)
                start_y = (h - new_h) // 2
                start_x = (w - new_w) // 2
                zoomed[start_y:start_y+new_h, start_x:start_x+new_w] = resized
            
            return zoomed
            
        except Exception as e:
            logger.error(f"Error applying zoom: {str(e)}")
            return image
    
    def _apply_translation(self, image, intensity):
        """Apply translation augmentation"""
        try:
            h, w = image.shape[:2]
            
            # Convert intensity to translation distance
            max_translation = int(intensity * min(h, w) * 0.2)  # Up to 20% of image size
            
            # Random translation
            tx = random.randint(-max_translation, max_translation)
            ty = random.randint(-max_translation, max_translation)
            
            # Create translation matrix
            translation_matrix = np.float32([[1, 0, tx], [0, 1, ty]])
            
            # Apply translation
            translated = cv2.warpAffine(image, translation_matrix, (w, h), 
                                      flags=cv2.INTER_LINEAR, 
                                      borderMode=cv2.BORDER_REFLECT_101)
            
            return translated
            
        except Exception as e:
            logger.error(f"Error applying translation: {str(e)}")
            return image
    
    def _apply_elastic_transform(self, image, intensity):
        """Apply elastic transformation augmentation"""
        try:
            h, w = image.shape[:2]
            
            # Convert intensity to transformation parameters
            alpha = intensity * 100  # Elastic deformation strength
            sigma = 10  # Gaussian filter parameter
            
            # Create random displacement fields
            dx = np.random.randn(h, w) * alpha
            dy = np.random.randn(h, w) * alpha
            
            # Apply Gaussian filter to displacement fields
            dx = cv2.GaussianBlur(dx, (sigma, sigma), 0)
            dy = cv2.GaussianBlur(dy, (sigma, sigma), 0)
            
            # Create coordinate grids
            x, y = np.meshgrid(np.arange(w), np.arange(h))
            
            # Apply displacement
            map_x = (x + dx).astype(np.float32)
            map_y = (y + dy).astype(np.float32)
            
            # Apply elastic transformation
            elastic = cv2.remap(image, map_x, map_y, cv2.INTER_LINEAR, 
                              borderMode=cv2.BORDER_REFLECT_101)
            
            return elastic
            
        except Exception as e:
            logger.error(f"Error applying elastic transform: {str(e)}")
            return image
    
    def create_augmentation_pipeline(self, augmentations):
        """
        Create a pipeline of augmentations to apply sequentially
        """
        def pipeline(image):
            result = image
            for aug_type, intensity in augmentations:
                result = self.apply_augmentation(result, aug_type, intensity)
            return result
        
        return pipeline
    
    def get_augmentation_preview(self, image, num_samples=4):
        """
        Generate preview of different augmentations
        """
        try:
            previews = []
            augmentation_types = list(self.augmentation_methods.keys())
            
            for i in range(min(num_samples, len(augmentation_types))):
                aug_type = augmentation_types[i]
                intensity = 0.5
                augmented = self.apply_augmentation(image, aug_type, intensity)
                previews.append({
                    'type': aug_type,
                    'image': augmented
                })
            
            return previews
            
        except Exception as e:
            logger.error(f"Error creating augmentation preview: {str(e)}")
            return []