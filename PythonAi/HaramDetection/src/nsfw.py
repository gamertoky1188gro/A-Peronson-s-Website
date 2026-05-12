import os
import sys
import logging
from typing import Dict, Any
import numpy as np

torch_lib = os.path.join(sys.prefix, 'Lib', 'site-packages', 'torch', 'lib')
if os.path.exists(torch_lib) and hasattr(os, 'add_dll_directory'):
    try:
        os.add_dll_directory(torch_lib)
    except:
        pass
os.environ['PATH'] = torch_lib + os.pathsep + os.environ.get('PATH', '')

logger = logging.getLogger(__name__)


class NSFWEngine:
    def __init__(self, config, preprocessor):
        self.config = config
        self.preprocessor = preprocessor
        self.model_name = config.get('models.nsfw.model_name', 'ndp40')
        self.threshold = config.get('models.nsfw.threshold', 0.3)
        self._detector = None
        
        self.class_descriptions = {
            'BELLY_EXPOSED': 'Exposed belly/abdomen',
            'BREAST_EXPOSED': 'Exposed breast',
            'FEMALE_BREAST_EXPOSED': 'Female breast exposed',
            'FEMALE_BREAST_COVERED': 'Female breast covered (braless)',
            'MALE_GENITALIA_EXPOSED': 'Male genitalia exposed',
            'FEMALE_GENITALIA_EXPOSED': 'Female genitalia exposed',
            'FEMALE_GENITALIA_COVERED': 'Female genitalia covered',
            'ANUS_EXPOSED': 'Anus exposed',
            'BUTTOCKS_EXPOSED': 'Buttocks exposed',
            'FACE_BELLY': 'Face with belly visible',
            'FACE_BREAST': 'Face with breast visible',
            'UNDERWEAR': 'Underwear visible',
            'BRA': 'Bra visible',
            'UNDERPANTS': 'Underpants visible',
            'EXPOSED_BELLY': 'Exposed belly',
            'EXPOSED_UPPER': 'Exposed upper body',
            'EXPOSED_LOWER': 'Exposed lower body',
            'NUDE': 'Nude content',
            'PARTIAL_NUDE': 'Partial nude'
        }
    
    def _init_model(self):
        if self._detector is None:
            try:
                from nudenet import NudeDetector
                self._detector = NudeDetector()
                logger.info("NudeNet detector initialized")
            except Exception as e:
                logger.warning(f"NudeNet not installed: {e}")
                self._detector = None
    
    def score(self, image_data: bytes) -> Dict[str, Any]:
        preprocess_result, msg = self.preprocessor.preprocess(image_data)
        if preprocess_result is None:
            return {'nsfw_score': 0.0, 'safe_score': 100.0, 'error': msg}
        
        img = preprocess_result['image']
        img_array = self.preprocessor.get_array(img)
        
        if self._detector is None:
            self._init_model()
        
        if self._detector is None:
            return {
                'nsfw_score': 0.0,
                'safe_score': 100.0,
                'error': 'NudeNet not available'
            }
        
        try:
            detections = self._detector.detect(img_array)
            
            logger.debug(f"NudeNet raw detections: {detections}")
            
            if not detections:
                return {
                    'nsfw_score': 0.0,
                    'safe_score': 100.0,
                    'is_nsfw': False,
                    'detections': [],
                    'reasons': []
                }
            
            nsfw_classes = {
                'BELLY_EXPOSED', 'BREAST_EXPOSED', 'nipples',
                'FEMALE_BREAST_EXPOSED', 'FEMALE_BREAST_COVERED',
                'MALE_GENITALIA_EXPOSED', 'FEMALE_GENITALIA_EXPOSED',
                'FEMALE_GENITALIA_COVERED', 'ANUS_EXPOSED', 'BUTTOCKS_EXPOSED',
                'FACE_BELLY', 'FACE_BREAST', 'UNDERWEAR', 'BRA', 'UNDERPANTS',
                'EXPOSED', 'EXPOSED_UPPER', 'EXPOSED_LOWER', 'EXPOSED_BELLY',
                'NUDE', 'PARTIAL_NUDE'
            }
            
            max_score = 0.0
            nsfw_detections = []
            reasons = []
            
            for det in detections:
                label = det.get('class', '')
                score = det.get('score', 0.0)
                
                is_nsfw = label in nsfw_classes or any(x in label.upper() for x in ['BELLY', 'BREAST', 'GENITALIA', 'NUDE', 'EXPOSED', 'BUTTOCKS', 'UNDERWEAR', 'BRA'])
                
                if is_nsfw:
                    description = self.class_descriptions.get(label, label.replace('_', ' ').title())
                    nsfw_detections.append({
                        'class': label,
                        'score': float(score),
                        'description': description
                    })
                    reasons.append(f"{description} ({int(score*100)}% confidence)")
                    
                    if score > max_score:
                        max_score = score
            
            nsfw_score = max_score * 100
            safe_score = 100 - nsfw_score
            is_nsfw = nsfw_score > (self.threshold * 100)
            
            return {
                'nsfw_score': float(nsfw_score),
                'safe_score': float(safe_score),
                'is_nsfw': is_nsfw,
                'threshold': self.threshold,
                'detections': nsfw_detections,
                'reasons': reasons
            }
            
        except Exception as e:
            logger.error(f"NSFW detection failed: {e}")
            return {'nsfw_score': 0.0, 'safe_score': 100.0, 'error': str(e)}


def create_nsfw_engine(config, preprocessor) -> NSFWEngine:
    return NSFWEngine(config, preprocessor)