import os
import sys
import logging
from typing import Dict, Any, Optional
import json

torch_lib = os.path.join(sys.prefix, 'Lib', 'site-packages', 'torch', 'lib')
if os.path.exists(torch_lib) and hasattr(os, 'add_dll_directory'):
    try:
        os.add_dll_directory(torch_lib)
    except:
        pass
os.environ['PATH'] = torch_lib + os.pathsep + os.environ.get('PATH', '')

logger = logging.getLogger(__name__)


def get_system_ram_gb() -> float:
    try:
        import psutil
        return psutil.virtual_memory().total / (1024 ** 3)
    except ImportError:
        pass
    
    try:
        if sys.platform == 'win32':
            import ctypes
            kernel32 = ctypes.windll.kernel32
            c_ulong = ctypes.c_ulong
            class MEMORYSTATUS(ctypes.Structure):
                _fields_ = [
                    ('dwLength', c_ulong),
                    ('dwMemoryLoad', c_ulong),
                    ('dwTotalPhys', c_ulong),
                    ('dwAvailPhys', c_ulong),
                    ('dwTotalPageFile', c_ulong),
                    ('dwAvailPageFile', c_ulong),
                    ('dwTotalVirtual', c_ulong),
                    ('dwAvailVirtual', c_ulong)
                ]
            mem = MEMORYSTATUS()
            mem.dwLength = ctypes.sizeof(mem)
            kernel32.GlobalMemoryStatus(ctypes.byref(mem))
            return mem.dwTotalPhys / (1024 ** 3)
    except:
        pass
    
    return 0.0


MOONDREAM_MODELS = {
    '0.5b': {
        'name': 'vikhyatk/moondream2',
        'revision': '01b292d79113fac24b2f70722891da1db794a6e9',
        'min_ram_gb': 4,
        'description': 'Moondream 0.5B (lightweight)'
    },
    '2b': {
        'name': 'vikhyatk/moondream2',
        'revision': 'main',
        'min_ram_gb': 12,
        'description': 'Moondream 2B (recommended)'
    },
    '3': {
        'name': 'vikhyatk/moondream3',
        'revision': 'main',
        'min_ram_gb': 32,
        'description': 'Moondream 3 Preview'
    }
}


class VisionReasoningEngine:
    def __init__(self, config, preprocessor):
        self.config = config
        self.preprocessor = preprocessor
        
        system_ram = get_system_ram_gb()
        logger.info(f"System RAM detected: {system_ram:.1f} GB")
        
        config_enabled = config.get('models.moondream.enabled', False)
        model_size = config.get('models.moondream.model_size', '2b')
        
        selected_model = self._select_model(system_ram, model_size)
        
        if config_enabled and selected_model:
            self.enabled = True
            self.model_info = selected_model
            self.max_tokens = config.get('models.moondream.max_tokens', 100)
        else:
            self.enabled = False
            self.model_info = None
        
        if self.enabled:
            logger.info(f"Moondream enabled: {self.model_info['description']}")
        else:
            logger.info(f"Moondream disabled (RAM: {system_ram:.1f}GB, config: {config_enabled})")
        
        self._model = None
        self._processor = None
    
    def _select_model(self, system_ram: float, config_model: str) -> Optional[Dict]:
        if system_ram < 4:
            logger.warning(f"Insufficient RAM for Moondream: {system_ram:.1f}GB (min 4GB)")
            return None
        
        if system_ram >= 32:
            if '3' in config_model or config_model == '3':
                return MOONDREAM_MODELS['3']
            return MOONDREAM_MODELS['2b']
        
        if system_ram >= 12:
            return MOONDREAM_MODELS['2b']
        
        if system_ram >= 4:
            return MOONDREAM_MODELS['0.5b']
        
        return None
    
    def _init_model(self):
        if self._model is None and self.model_info:
            try:
                from transformers import AutoModelForCausalLM, AutoTokenizer
                
                model_name = self.model_info['name']
                revision = self.model_info.get('revision', 'main')
                
                logger.info(f"Loading Moondream: {self.model_info['description']}")
                
                self._processor = AutoTokenizer.from_pretrained(
                    model_name, 
                    revision=revision,
                    trust_remote_code=True
                )
                self._model = AutoModelForCausalLM.from_pretrained(
                    model_name,
                    revision=revision,
                    trust_remote_code=True,
                    torch_dtype="auto",
                    device_map="cpu"
                )
                logger.info(f"Moondream {self.model_info['description']} loaded successfully")
            except Exception as e:
                logger.warning(f"Failed to initialize Moondream: {e}")
                self._model = None
    
    def describe(self, image_data: bytes) -> Dict[str, Any]:
        if not self.enabled:
            return {'description': '', 'analysis': '', 'suspicious': False, 'model': 'disabled'}
        
        preprocess_result, msg = self.preprocessor.preprocess(image_data)
        if preprocess_result is None:
            return {'description': '', 'analysis': '', 'error': msg}
        
        img = preprocess_result['image']
        
        if self._model is None:
            self._init_model()
        
        if self._model is None or self._processor is None:
            return {
                'description': 'Model not available',
                'analysis': '',
                'error': 'Moondream not loaded',
                'model': self.model_info['description'] if self.model_info else 'unknown'
            }
        
        try:
            description = self._model.generate_caption(img)
            
            analysis_prompt = """Analyze this image for content moderation.
Respond in this exact format:
VERDICT: [SAFE/QUESTIONABLE/HARAM/HIGH_RISK]
SCORE: [0-100]
REASONS: [comma separated reasons]

Look for: nudity, alcohol, cigarettes, vaping, gambling, weapons, drugs.
Be accurate and concise."""
            
            analysis = self._model.query_image(img, analysis_prompt)
            
            parsed = self._parse_moondream_response(analysis)
            
            suspicious = self._check_suspicious(description, analysis)
            
            return {
                'description': description or '',
                'analysis': analysis or '',
                'suspicious': suspicious,
                'has_reasoning': bool(description or analysis),
                'model': self.model_info['description'] if self.model_info else 'unknown',
                'verdict': parsed.get('verdict', ''),
                'score': parsed.get('score', 0),
                'reasons': parsed.get('reasons', '')
            }
            
        except Exception as e:
            logger.error(f"Vision reasoning failed: {e}")
            return {'description': '', 'analysis': '', 'error': str(e)}
    
    def _parse_moondream_response(self, response: str) -> Dict[str, Any]:
        result = {'verdict': '', 'score': 0, 'reasons': ''}
        
        if not response:
            return result
        
        response = response.strip()
        
        for line in response.split('\n'):
            line = line.strip()
            if line.startswith('VERDICT:'):
                verdict = line.replace('VERDICT:', '').strip()
                result['verdict'] = verdict
            elif line.startswith('SCORE:'):
                try:
                    score = int(line.replace('SCORE:', '').strip())
                    result['score'] = score
                except:
                    pass
            elif line.startswith('REASONS:'):
                reasons = line.replace('REASONS:', '').strip()
                result['reasons'] = reasons
        
        return result
    
    def _check_suspicious(self, description: str, analysis: str) -> bool:
        if not description:
            return False
        
        text = (description + ' ' + analysis).lower()
        
        suspicious_terms = [
            'nude', 'naked', 'explicit', 'sexual', 'alcohol', 'wine',
            'beer', 'drinking', 'smoking', 'cigarette', 'vape',
            'weapon', 'gun', 'knife', 'gambling', 'casino', 'drug'
        ]
        
        return any(term in text for term in suspicious_terms)


def create_vision_engine(config, preprocessor) -> VisionReasoningEngine:
    return VisionReasoningEngine(config, preprocessor)