import os
import sys
import warnings
import logging
import io
from pathlib import Path

json_mode = any(x.lower().replace('-', '').replace('/', '') in ('json', 'html') for x in sys.argv[1:])

log_level = logging.CRITICAL if json_mode else logging.WARNING
logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
if json_mode:
    warnings.filterwarnings('ignore')
    os.environ['PYTHONWARNINGS'] = 'ignore'
    for logger_name in ['paddle', 'ppocr', '']:
        logging.getLogger(logger_name).setLevel(logging.CRITICAL)

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
    from src.cli import display
    display(result)


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
    parser.add_argument('--html', action='store_true', help='Output as HTML report')
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    json_output = json_mode or args.json
    html_output = args.html

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
    
    if html_output:
        from src.html_report import generate as gen_html
        html = gen_html(result)
        print(html)
    elif json_output:
        import json
        print(json.dumps(result, indent=2))
    else:
        print_result(result)
    
    if args.output:
        import json
        with open(args.output, 'w') as f:
            json.dump(result, f, indent=2)