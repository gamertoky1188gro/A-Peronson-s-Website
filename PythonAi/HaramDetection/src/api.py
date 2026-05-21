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
            from urllib.parse import urlparse
            import requests

            parsed = urlparse(url)
            allowed_schemes = {'https'}
            blocked_hosts = {'169.254.169.254', '127.0.0.1', 'localhost', '::1', '0.0.0.0'}
            blocked_prefixes = ('10.', '172.16.', '172.17.', '172.18.', '172.19.',
                                '172.20.', '172.21.', '172.22.', '172.23.',
                                '172.24.', '172.25.', '172.26.', '172.27.',
                                '172.28.', '172.29.', '172.30.', '172.31.', '192.168.')

            if parsed.scheme not in allowed_schemes:
                return {'score': 0, 'label': 'ERROR', 'severity': 'error',
                        'error': 'Only HTTPS URLs are allowed'}

            host = parsed.hostname.lower() if parsed.hostname else ''
            if host in blocked_hosts or any(host.startswith(p) for p in blocked_prefixes):
                return {'score': 0, 'label': 'ERROR', 'severity': 'error',
                        'error': 'Access to this host is not allowed'}

            response = requests.get(url, timeout=30)
            response.raise_for_status()
            return self.check_image(response.content)
        except Exception as e:
            return {
                'score': 0,
                'label': 'ERROR',
                'severity': 'error',
                'error': 'Failed to check URL'
            }


def create_api(config_path: Optional[str] = None) -> ModerationAPI:
    return ModerationAPI(config_path)