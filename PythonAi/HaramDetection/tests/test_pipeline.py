import pytest
import os
import json
from pathlib import Path


class TestConfig:
    def test_config_loads(self):
        from src.config import get_config
        config = get_config()
        assert config is not None
        assert config.max_image_size_mb > 0
    
    def test_risky_objects_defined(self):
        from src.config import get_config
        config = get_config()
        assert hasattr(config, 'risky_objects')
        assert 'high_risk' in config.risky_objects


class TestPreprocessing:
    def test_preprocessor_creation(self):
        from src.config import get_config
        from src.preprocessing import create_preprocessor
        config = get_config()
        preprocessor = create_preprocessor(config)
        assert preprocessor is not None
    
    def test_validate_empty_data(self):
        from src.config import get_config
        from src.preprocessing import create_preprocessor
        config = get_config()
        preprocessor = create_preprocessor(config)
        valid, msg = preprocessor.validate(b'')
        assert valid is False
    
    def test_validate_small_data(self):
        from src.config import get_config
        from src.preprocessing import create_preprocessor
        config = get_config()
        preprocessor = create_preprocessor(config)
        valid, msg = preprocessor.validate(b'fake image data')
        assert valid is True


class TestOCREngine:
    def test_ocr_engine_creation(self):
        from src.config import get_config
        from src.preprocessing import create_preprocessor
        from src.ocr import create_ocr_engine
        config = get_config()
        preprocessor = create_preprocessor(config)
        ocr = create_ocr_engine(config, preprocessor)
        assert ocr is not None
    
    def test_extract_text_empty(self):
        from src.config import get_config
        from src.preprocessing import create_preprocessor
        from src.ocr import create_ocr_engine
        config = get_config()
        preprocessor = create_preprocessor(config)
        ocr = create_ocr_engine(config, preprocessor)
        result = ocr.extract_text(b'not an image')
        assert 'text' in result


class TestDetectionEngine:
    def test_detection_engine_creation(self):
        from src.config import get_config
        from src.preprocessing import create_preprocessor
        from src.detection import create_detection_engine
        config = get_config()
        preprocessor = create_preprocessor(config)
        detection = create_detection_engine(config, preprocessor)
        assert detection is not None


class TestNSFWEngine:
    def test_nsfw_engine_creation(self):
        from src.config import get_config
        from src.preprocessing import create_preprocessor
        from src.nsfw import create_nsfw_engine
        config = get_config()
        preprocessor = create_preprocessor(config)
        nsfw = create_nsfw_engine(config, preprocessor)
        assert nsfw is not None


class TestRuleEngine:
    def test_rule_engine_creation(self):
        from src.config import get_config
        from src.rules import create_rule_engine
        config = get_config()
        engine = create_rule_engine(config)
        assert engine is not None
    
    def test_evaluate_with_empty_results(self):
        from src.config import get_config
        from src.rules import create_rule_engine
        config = get_config()
        engine = create_rule_engine(config)
        
        empty_result = {'text': [], 'full_text': '', 'has_text': False}
        empty_detection = {'detections': [], 'risky_count': 0}
        empty_nsfw = {'nsfw_score': 0.0, 'safe_score': 1.0}
        empty_vision = {'description': '', 'analysis': '', 'suspicious': False}
        
        result = engine.evaluate(
            empty_result,
            empty_detection,
            empty_nsfw,
            empty_vision
        )
        
        assert 'score' in result
        assert 'label' in result
        assert result['label'] == 'SAFE'
    
    def test_evaluate_with_high_risk_text(self):
        from src.config import get_config
        from src.rules import create_rule_engine
        config = get_config()
        engine = create_rule_engine(config)
        
        risky_text = {'text': [{'text': 'porn site', 'confidence': 0.9}], 'full_text': 'porn site', 'has_text': True}
        
        result = engine.evaluate(
            risky_text,
            {'detections': [], 'risky_count': 0},
            {'nsfw_score': 0.0, 'safe_score': 1.0},
            {'description': '', 'analysis': '', 'suspicious': False}
        )
        
        assert result['score'] > 0
        assert any('porn' in s['message'].lower() for s in result['signals'])


class TestPipeline:
    def test_pipeline_creation(self):
        from src.pipeline import create_pipeline
        pipeline = create_pipeline()
        assert pipeline is not None
    
    def test_analyze_with_invalid_data(self):
        from src.pipeline import create_pipeline
        pipeline = create_pipeline()
        result = pipeline.analyze(b'not valid image')
        assert 'score' in result
        assert 'label' in result


class TestAPI:
    def test_api_creation(self):
        from src.api import create_api
        api = create_api()
        assert api is not None
    
    def test_check_image_error(self):
        from src.api import create_api
        api = create_api()
        result = api.check_image(b'')
        assert result['label'] == 'ERROR'


if __name__ == '__main__':
    pytest.main([__file__, '-v'])