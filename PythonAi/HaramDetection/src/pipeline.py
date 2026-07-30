import logging
import time
from typing import Dict, Any, Optional
from pathlib import Path

from .config import get_config
from .preprocessing import create_preprocessor
from .ocr import create_ocr_engine
from .detection import create_detection_engine
from .nsfw import create_nsfw_engine
from .vision_reasoning import create_vision_engine
from .rules import create_rule_engine

logger = logging.getLogger(__name__)


class ModerationPipeline:
    def __init__(self, config_path: Optional[str] = None):
        self.config = get_config(config_path)
        self.preprocessor = create_preprocessor(self.config)
        self.ocr_engine = create_ocr_engine(self.config, self.preprocessor)
        self.detection_engine = create_detection_engine(self.config, self.preprocessor)
        self.nsfw_engine = create_nsfw_engine(self.config, self.preprocessor)
        self.vision_engine = create_vision_engine(self.config, self.preprocessor)
        self.rule_engine = create_rule_engine(self.config)
        
        logger.info("Moderation Pipeline initialized")
    
    def analyze(self, image_data: bytes, early_exit: bool = True) -> Dict[str, Any]:
        start_time = time.time()
        
        results = {
            'ocr': {},
            'detection': {},
            'nsfw': {},
            'vision': {},
            'timing': {}
        }
        
        ocr_result = self.ocr_engine.extract_text(image_data)
        results['ocr'] = ocr_result
        results['timing']['ocr'] = time.time() - start_time
        
        if self._should_early_exit(ocr_result, early_exit):
            early_score, label = self._quick_judgment(ocr_result)
            return {
                'score': early_score,
                'label': label,
                'severity': 'high' if early_score > 50 else 'medium',
                'confidence': 'high',
                'signals': [{
                    'type': 'early_exit',
                    'risk': 'high',
                    'source': 'ocr',
                    'message': 'Explicit content detected in text'
                }],
                'details': results,
                'timing': results['timing'],
                'is_early_exit': True
            }
        
        detection_result = self.detection_engine.detect(image_data)
        results['detection'] = detection_result
        results['timing']['detection'] = time.time() - start_time
        
        if self._should_early_exit(detection_result, early_exit):
            early_score, label = self._quick_judgment_detection(detection_result)
            return {
                'score': early_score,
                'label': label,
                'severity': 'high',
                'confidence': 'high',
                'signals': [{
                    'type': 'early_exit',
                    'risk': 'high',
                    'source': 'detection',
                    'message': 'High-risk object detected'
                }],
                'details': results,
                'timing': results['timing'],
                'is_early_exit': True
            }
        
        nsfw_result = self.nsfw_engine.score(image_data)
        results['nsfw'] = nsfw_result
        results['timing']['nsfw'] = time.time() - start_time
        
        if nsfw_result.get('nsfw_score', 0) > 80:
            early_score, label = self._quick_judgment_nsfw(nsfw_result)
            return {
                'score': early_score,
                'label': label,
                'severity': 'critical',
                'confidence': 'high',
                'signals': [{
                    'type': 'early_exit',
                    'risk': 'critical',
                    'source': 'nsfw',
                    'message': 'High NSFW probability detected'
                }],
                'details': results,
                'timing': results['timing'],
                'is_early_exit': True
            }
        
        vision_result = self.vision_engine.describe(image_data)
        results['vision'] = vision_result
        results['timing']['vision'] = time.time() - start_time
        
        final_result = self.rule_engine.evaluate(
            ocr_result,
            detection_result,
            nsfw_result,
            vision_result
        )
        
        final_result['details'] = results
        final_result['timing'] = results['timing']
        final_result['timing']['total'] = time.time() - start_time
        
        return final_result
    
    def analyze_file(self, file_path: str, early_exit: bool = True) -> Dict[str, Any]:
        with open(file_path, 'rb') as f:
            image_data = f.read()
        return self.analyze(image_data, early_exit)
    
    def _should_early_exit(self, result: Dict[str, Any], early_exit: bool) -> bool:
        if not early_exit:
            return False
        
        text = result.get('full_text', '').lower()
        high_risk_keywords = ['porn', 'xxx', 'nude', 'adult', 'escort', 'prostitute']
        if any(k in text for k in high_risk_keywords):
            return True
        
        return False
    
    def _quick_judgment(self, ocr_result: Dict[str, Any]) -> float:
        text = ocr_result.get('full_text', '').lower()
        
        extreme_keywords = ['porn', 'xxx', 'adult', 'explicit']
        if any(k in text for k in extreme_keywords):
            return 95, 'HIGH RISK'
        
        high_keywords = ['nude', 'naked', 'escort']
        if any(k in text for k in high_keywords):
            return 75, 'HARAM'
        
        return 50, 'QUESTIONABLE'
    
    def _quick_judgment_detection(self, detection_result: Dict[str, Any]) -> float:
        detections = detection_result.get('detections', [])
        
        for det in detections:
            if det.get('risk_level') == 'high':
                return 80, 'HARAM'
        
        return 60, 'QUESTIONABLE'
    
    def _quick_judgment_nsfw(self, nsfw_result: Dict[str, Any]) -> float:
        score = nsfw_result.get('nsfw_score', 0)
        
        if score > 90:
            return 95, 'HIGH RISK'
        return 85, 'HIGH RISK'


def create_pipeline(config_path: Optional[str] = None) -> ModerationPipeline:
    return ModerationPipeline(config_path)