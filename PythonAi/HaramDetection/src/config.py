import os
import yaml
from pathlib import Path
from typing import Any, Dict, Optional


class Config:
    def __init__(self, config_path: Optional[str] = None):
        if config_path is None:
            config_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "config.yaml")
        
        with open(config_path, 'r') as f:
            self._config = yaml.safe_load(f)
    
    def get(self, key: str, default: Any = None) -> Any:
        keys = key.split('.')
        value = self._config
        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
            else:
                return default
        return value if value is not None else default
    
    @property
    def pipeline(self) -> Dict[str, Any]:
        return self._config.get('pipeline', {})
    
    @property
    def models(self) -> Dict[str, Any]:
        return self._config.get('models', {})
    
    @property
    def scoring(self) -> Dict[str, Any]:
        return self._config.get('scoring', {})
    
    @property
    def risky_objects(self) -> Dict[str, Any]:
        return self._config.get('risky_objects', {})
    
    @property
    def banned_keywords(self) -> Dict[str, Any]:
        return self._config.get('banned_keywords', {})
    
    @property
    def context_triggers(self) -> Dict[str, Any]:
        return self._config.get('context_triggers', {})
    
    @property
    def max_image_size_mb(self) -> int:
        return self.get('pipeline.image_max_size_mb', 10)
    
    @property
    def max_image_dim(self) -> int:
        return self.get('pipeline.image_max_dim', 2048)
    
    @property
    def timeout_seconds(self) -> int:
        return self.get('pipeline.timeout_seconds', 60)
    
    @property
    def early_exit_threshold(self) -> int:
        return self.get('pipeline.early_exit_threshold', 85)


_config: Optional[Config] = None

def get_config(config_path: Optional[str] = None) -> Config:
    global _config
    if _config is None or config_path is not None:
        _config = Config(config_path)
    return _config