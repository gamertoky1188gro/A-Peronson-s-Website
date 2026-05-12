import io
import logging
import base64
from typing import Optional, Dict, Any
from pathlib import Path

from .pipeline import create_pipeline

logger = logging.getLogger(__name__)


class ModerationAPI:
    def __init__(self, config_path: Optional[str] = None):
        self.pipeline = create_pipeline(config_path)
    
    def check_image(self, image_data: bytes) -> Dict[str, Any]:
        return self.pipeline.analyze(image_data)
    
    def check_file(self, file_path: str) -> Dict[str, Any]:
        return self.pipeline.analyze_file(file_path)
    
    def check_base64(self, image_base64: str) -> Dict[str, Any]:
        try:
            image_data = base64.b64decode(image_base64)
            return self.check_image(image_data)
        except Exception as e:
            return {
                'score': 0,
                'label': 'ERROR',
                'severity': 'error',
                'error': str(e)
            }
    
    def check_url(self, url: str) -> Dict[str, Any]:
        try:
            import requests
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            return self.check_image(response.content)
        except Exception as e:
            return {
                'score': 0,
                'label': 'ERROR',
                'severity': 'error',
                'error': str(e)
            }


def create_api(config_path: Optional[str] = None) -> ModerationAPI:
    return ModerationAPI(config_path)