import io
import logging
from typing import Tuple, Optional, Dict, Any
from pathlib import Path
import numpy as np
from PIL import Image

logger = logging.getLogger(__name__)


class ImagePreprocessor:
    def __init__(self, config):
        self.max_size_mb = config.max_image_size_mb
        self.max_dim = config.max_image_dim
        
    def validate(self, image_data: bytes) -> Tuple[bool, str]:
        if not image_data:
            return False, "Empty image data"
        
        size_mb = len(image_data) / (1024 * 1024)
        if size_mb > self.max_size_mb:
            return False, f"Image too large: {size_mb:.2f}MB (max {self.max_size_mb}MB)"
        
        return True, ""
    
    def load_image(self, image_data: bytes) -> Tuple[Optional[Image.Image], str]:
        try:
            img = Image.open(io.BytesIO(image_data))
            img.load()
            return img, ""
        except Exception as e:
            return None, f"Failed to load image: {str(e)}"
    
    def preprocess(self, image_data: bytes) -> Tuple[Optional[Dict[str, Any]], str]:
        valid, msg = self.validate(image_data)
        if not valid:
            return None, msg
        
        img, msg = self.load_image(image_data)
        if img is None:
            return None, msg
        
        try:
            width, height = img.size
            scale = 1.0
            
            if max(width, height) > self.max_dim:
                scale = self.max_dim / max(width, height)
                new_size = (int(width * scale), int(height * scale))
                img = img.resize(new_size, Image.LANCZOS)
            
            img_rgb = img.convert('RGB')
            
            return {
                'image': img_rgb,
                'original_size': (width, height),
                'scale': scale,
                'format': img.format or 'unknown'
            }, ""
            
        except Exception as e:
            return None, f"Preprocessing failed: {str(e)}"
    
    def get_array(self, img: Image.Image) -> np.ndarray:
        return np.array(img)
    
    def get_pil(self, img_array: np.ndarray) -> Image.Image:
        return Image.fromarray(img_array)


def create_preprocessor(config) -> ImagePreprocessor:
    return ImagePreprocessor(config)