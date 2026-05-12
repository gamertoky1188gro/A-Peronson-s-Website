import os
import sys
import logging
from typing import Dict, Any, List, Optional

torch_lib = os.path.join(sys.prefix, 'Lib', 'site-packages', 'torch', 'lib')
if os.path.exists(torch_lib) and hasattr(os, 'add_dll_directory'):
    try:
        os.add_dll_directory(torch_lib)
    except:
        pass
os.environ['PATH'] = torch_lib + os.pathsep + os.environ.get('PATH', '')
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'

logger = logging.getLogger(__name__)


class OCREngine:
    def __init__(self, config, preprocessor):
        self.config = config
        self.preprocessor = preprocessor
        self.enabled = config.get('models.ocr.enabled', True)
        self.confidence_threshold = config.get('models.ocr.confidence_threshold', 0.5)
        self._paddle_ocr = None
        self._easyocr = None
    
    def _init_paddle(self):
        if self._paddle_ocr is None:
            try:
                from paddleocr import PaddleOCR
                self._paddle_ocr = PaddleOCR(
                    use_angle_cls=True,
                    lang=self.config.get('models.ocr.language', 'en'),
                    use_gpu=False,
                    show_log=False,
                    use_mkldnn=False,
                    enable_mkldnn=False,
                    use_tensorrt=False,
                    precision='fp32'
                )
                logger.info("PaddleOCR initialized (oneDNN disabled)")
            except Exception as e:
                logger.warning(f"Failed to initialize PaddleOCR: {e}")
                self._paddle_ocr = None
    
    def _init_easyocr(self):
        if self._easyocr is None:
            try:
                import easyocr
                lang = self.config.get('models.ocr.language', 'en')
                lang_code = 'en' if lang == 'en' else lang
                self._easyocr = easyocr.Reader([lang_code], gpu=False, verbose=False)
                logger.info("EasyOCR fallback initialized")
            except Exception as e:
                logger.warning(f"Failed to initialize EasyOCR fallback: {e}")
                self._easyocr = None
    
    def extract_text(self, image_data: bytes) -> Dict[str, Any]:
        if not self.enabled:
            return {'text': [], 'full_text': '', 'has_text': False}
        
        preprocess_result, msg = self.preprocessor.preprocess(image_data)
        if preprocess_result is None:
            return {'text': [], 'full_text': '', 'error': msg}
        
        img = preprocess_result['image']
        img_array = self.preprocessor.get_array(img)
        
        if self._paddle_ocr is None:
            self._init_paddle()
        
        if self._paddle_ocr is not None:
            try:
                result = self._paddle_ocr.ocr(img_array, cls=True)
                
                if result is None or len(result) == 0 or result[0] is None:
                    return {'text': [], 'full_text': '', 'has_text': False}
                
                texts = []
                for line in result[0]:
                    if line and len(line) >= 2:
                        text = line[1][0]
                        confidence = line[1][1]
                        if confidence >= self.confidence_threshold:
                            texts.append({
                                'text': text,
                                'confidence': float(confidence)
                            })
                
                full_text = ' '.join([t['text'] for t in texts])
                avg_conf = sum(t['confidence'] for t in texts) / len(texts) if texts else 0
                
                return {
                    'text': texts,
                    'full_text': full_text,
                    'has_text': len(texts) > 0,
                    'count': len(texts),
                    'avg_confidence': avg_conf,
                    'source': 'paddleocr'
                }
                
            except Exception as e:
                logger.error(f"PaddleOCR failed: {e}, falling back to EasyOCR")
        
        if self._easyocr is None:
            self._init_easyocr()
        
        if self._easyocr is not None:
            try:
                result = self._easyocr.readtext(img_array)
                
                if not result:
                    return {'text': [], 'full_text': '', 'has_text': False}
                
                texts = []
                for item in result:
                    if len(item) >= 2:
                        bbox, text, confidence = item[0], item[1], item[2]
                        if confidence >= self.confidence_threshold:
                            texts.append({
                                'text': text,
                                'confidence': float(confidence)
                            })
                
                full_text = ' '.join([t['text'] for t in texts])
                avg_conf = sum(t['confidence'] for t in texts) / len(texts) if texts else 0
                
                return {
                    'text': texts,
                    'full_text': full_text,
                    'has_text': len(texts) > 0,
                    'count': len(texts),
                    'avg_confidence': avg_conf,
                    'source': 'easyocr'
                }
            
            except Exception as e:
                logger.error(f"EasyOCR fallback failed: {e}")
        
        return {'text': [], 'full_text': '', 'avg_confidence': 0, 'error': 'OCR not available'}


def create_ocr_engine(config, preprocessor) -> OCREngine:
    return OCREngine(config, preprocessor)