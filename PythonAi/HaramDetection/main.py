import os
import sys
import warnings
import logging
import io
from pathlib import Path

json_mode = any(x.lower().replace('-', '').replace('/', '') == 'json' for x in sys.argv[1:])

if json_mode:
    warnings.filterwarnings('ignore')
    os.environ['PYTHONWARNINGS'] = 'ignore'
    for logger_name in ['paddle', 'ppocr', '']:
        logging.getLogger(logger_name).setLevel(logging.CRITICAL)
    logging.disable(logging.CRITICAL)
else:
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'

torch_lib = os.path.join(sys.prefix, 'Lib', 'site-packages', 'torch', 'lib')
if os.path.exists(torch_lib):
    os.add_dll_directory(torch_lib)
    os.environ['PATH'] = torch_lib + os.pathsep + os.environ.get('PATH', '')

from src.config import get_config
from src.preprocessing import create_preprocessor
from src.ocr import create_ocr_engine
from src.detection import create_detection_engine
from src.nsfw import create_nsfw_engine
from src.vision_reasoning import create_vision_engine
from src.rules import create_rule_engine
import time
import logging

logger = logging.getLogger(__name__)


class ModerationPipeline:
    def __init__(self, config_path: str = None):
        self.config = get_config(config_path)
        self.preprocessor = create_preprocessor(self.config)
        self.ocr_engine = create_ocr_engine(self.config, self.preprocessor)
        self.detection_engine = create_detection_engine(self.config, self.preprocessor)
        self.nsfw_engine = create_nsfw_engine(self.config, self.preprocessor)
        self.vision_engine = create_vision_engine(self.config, self.preprocessor)
        self.rule_engine = create_rule_engine(self.config)
        
        if not json_mode:
            logger.info("Moderation Pipeline initialized")
    
    def analyze(self, image_data: bytes, early_exit: bool = True):
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
        
        detection_result = self.detection_engine.detect(image_data)
        results['detection'] = detection_result
        results['timing']['detection'] = time.time() - start_time
        
        nsfw_result = self.nsfw_engine.score(image_data)
        results['nsfw'] = nsfw_result
        results['timing']['nsfw'] = time.time() - start_time
        
        vision_result = self.vision_engine.describe(image_data)
        results['vision'] = vision_result
        results['timing']['vision'] = time.time() - start_time
        
        final_result = self.rule_engine.evaluate(
            ocr_result,
            detection_result,
            nsfw_result,
            vision_result
        )
        
        final_result['details']['ocr'] = results.get('ocr', {})
        final_result['details']['detection'] = results.get('detection', {})
        final_result['details']['nsfw'] = results.get('nsfw', {})
        final_result['details']['vision'] = results.get('vision', {})
        final_result['details']['timing'] = results.get('timing', {})
        final_result['timing'] = results['timing']
        final_result['timing']['total'] = time.time() - start_time
        
        return final_result
    
    def analyze_file(self, file_path: str, early_exit: bool = True):
        with open(file_path, 'rb') as f:
            image_data = f.read()
        return self.analyze(image_data, early_exit)


def create_pipeline(config_path: str = None):
    return ModerationPipeline(config_path)


def print_result(result: dict):
    print("\n" + "=" * 50)
    print(f"RESULT: {result['label']}")
    print(f"SCORE: {result['score']}")
    print(f"SEVERITY: {result.get('severity', 'unknown')}")
    print(f"CONFIDENCE: {result.get('confidence', 'unknown')}")
    print("=" * 50)
    
    details = result.get('details', {})
    
    print("\n--- SCORE BREAKDOWN ---")
    print(f"  OCR Score: {details.get('ocr_score', 0)}")
    print(f"  YOLO Detection Score: {details.get('detection_score', 0)}")
    print(f"  NSFW Score: {details.get('nsfw_score', 0)}")
    print(f"  Vision Score: {details.get('vision_score', 0)}")
    print(f"  Weights: {details.get('weights', {})}")
    
    print("\n--- MODEL RESULTS ---")
    ocr = details.get('ocr', {})
    if ocr.get('full_text'):
        print(f"  OCR Text: {ocr.get('full_text', '')[:100]}...")
        print(f"  OCR Source: {ocr.get('source', 'unknown')}")
    else:
        print("  OCR: No text detected")
    
    detection = details.get('detection', {})
    print(f"  YOLO Objects: {detection.get('total_count', 0)} detected, {detection.get('risky_count', 0)} risky")
    for det in detection.get('detections', [])[:5]:
        print(f"    - {det.get('label')}: {det.get('risk_level', 'none')}")
    
    nsfw = details.get('nsfw', {})
    print(f"  NSFW Raw Score: {nsfw.get('nsfw_score', 0):.1f}")
    print(f"  Safe Score: {nsfw.get('safe_score', 100):.1f}")
    for reason in nsfw.get('reasons', []):
        print(f"    - {reason}")
    
    print("\n--- DETECTED SIGNALS ---")
    if result.get('signals'):
        for signal in result['signals'][:15]:
            print(f"  [{signal['risk'].upper()}] {signal['message']}")
    else:
        print("  No signals detected")
    
    if 'timing' in result:
        print(f"\n--- TIMING ---")
        timing = result['timing']
        for k, v in timing.items():
            print(f"  {k}: {v:.2f}s")
        print(f"  TOTAL: {timing.get('total', 0):.2f}s")


if __name__ == '__main__':
    import argparse
    import sys
    
    parser = argparse.ArgumentParser(description='Image Moderation Pipeline')
    parser.add_argument('image_path', nargs='?', help='Path to image file')
    parser.add_argument('--stdin', action='store_true', help='Read image from stdin (binary)')
    parser.add_argument('--base64', action='store_true', help='Input is base64 encoded image')
    parser.add_argument('--config', '-c', default='config.yaml', help='Config file path')
    parser.add_argument('--output', '-o', help='Output JSON file')
    parser.add_argument('--verbose', '-v', action='store_true')
    parser.add_argument('--json', '-j', action='store_true', help='Output as JSON')
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    json_output = json_mode or args.json
    
    pipeline = create_pipeline(args.config)
    
    if args.stdin:
        image_data = sys.stdin.buffer.read()
        result = pipeline.analyze(image_data)
    elif args.base64 and args.image_path:
        import base64
        image_data = base64.b64decode(args.image_path)
        result = pipeline.analyze(image_data)
    else:
        result = pipeline.analyze_file(args.image_path)
    
    if json_output:
        import json
        print(json.dumps(result, indent=2))
    else:
        print_result(result)
    
    if args.output:
        import json
        with open(args.output, 'w') as f:
            json.dump(result, f, indent=2)