import os
import sys
import logging
from typing import Dict, Any, List, Optional
import numpy as np

torch_lib = os.path.join(sys.prefix, 'Lib', 'site-packages', 'torch', 'lib')
if os.path.exists(torch_lib) and hasattr(os, 'add_dll_directory'):
    try:
        os.add_dll_directory(torch_lib)
    except:
        pass
os.environ['PATH'] = torch_lib + os.pathsep + os.environ.get('PATH', '')

logger = logging.getLogger(__name__)


class DetectionEngine:
    def __init__(self, config, preprocessor):
        self.config = config
        self.preprocessor = preprocessor
        self.model_name = config.get('models.yolo.model_name', 'yolov8n')
        self.confidence_threshold = config.get('models.yolo.confidence_threshold', 0.4)
        self.iou_threshold = config.get('models.yolo.iou_threshold', 0.45)
        self._model = None
        self._risky_objects = config.risky_objects
    
    def _init_model(self):
        if self._model is None:
            try:
                from ultralytics import YOLO
                self._model = YOLO(f"{self.model_name}.pt")
                logger.info(f"YOLO model {self.model_name} initialized")
            except Exception as e:
                logger.warning(f"Failed to initialize YOLO: {e}")
                self._model = None
    
    def _map_label(self, label: str) -> str:
        label_map = {
            'person': 'person',
            'bicycle': 'bicycle',
            'car': 'car',
            'motorcycle': 'motorcycle',
            'airplane': 'airplane',
            'bus': 'bus',
            'train': 'train',
            'truck': 'truck',
            'boat': 'boat',
            'traffic light': 'traffic light',
            'fire hydrant': 'fire hydrant',
            'stop sign': 'stop sign',
            'parking meter': 'parking meter',
            'bench': 'bench',
            'bird': 'bird',
            'cat': 'cat',
            'dog': 'dog',
            'horse': 'horse',
            'sheep': 'sheep',
            'cow': 'cow',
            'elephant': 'elephant',
            'bear': 'bear',
            'zebra': 'zebra',
            'giraffe': 'giraffe',
            'backpack': 'backpack',
            'umbrella': 'umbrella',
            'handbag': 'handbag',
            'tie': 'tie',
            'suitcase': 'suitcase',
            'frisbee': 'frisbee',
            'skis': 'skis',
            'snowboard': 'snowboard',
            'sports ball': 'sports ball',
            'kite': 'kite',
            'baseball bat': 'baseball bat',
            'baseball glove': 'baseball glove',
            'skateboard': 'skateboard',
            'surfboard': 'surfboard',
            'tennis racket': 'tennis racket',
            'bottle': 'bottle',
            'wine glass': 'wine glass',
            'cup': 'cup',
            'fork': 'fork',
            'knife': 'knife',
            'spoon': 'spoon',
            'bowl': 'bowl',
            'banana': 'banana',
            'apple': 'apple',
            'sandwich': 'sandwich',
            'orange': 'orange',
            'broccoli': 'broccoli',
            'carrot': 'carrot',
            'hot dog': 'hot dog',
            'pizza': 'pizza',
            'donut': 'donut',
            'cake': 'cake',
            'chair': 'chair',
            'couch': 'couch',
            'potted plant': 'potted plant',
            'bed': 'bed',
            'dining table': 'dining table',
            'toilet': 'toilet',
            'tv': 'tv',
            'laptop': 'laptop',
            'mouse': 'mouse',
            'remote': 'remote',
            'keyboard': 'keyboard',
            'cell phone': 'cell phone',
            'microwave': 'microwave',
            'oven': 'oven',
            'toaster': 'toaster',
            'sink': 'sink',
            'refrigerator': 'refrigerator',
            'book': 'book',
            'clock': 'clock',
            'vase': 'vase',
            'scissors': 'scissors',
            'teddy bear': 'teddy bear',
            'hair drier': 'hair drier',
            'toothbrush': 'toothbrush',
            'knife2': 'knife',
            'knife1': 'knife'
        }
        return label_map.get(label.lower(), label.lower())
    
    def _get_risk_level(self, label: str) -> Optional[str]:
        label_lower = label.lower()
        for obj in self._risky_objects.get('high_risk', []):
            if obj in label_lower or label_lower in obj:
                return 'high'
        for obj in self._risky_objects.get('medium_risk', []):
            if obj in label_lower or label_lower in obj:
                return 'medium'
        return None
    
    def detect(self, image_data: bytes) -> Dict[str, Any]:
        preprocess_result, msg = self.preprocessor.preprocess(image_data)
        if preprocess_result is None:
            return {'detections': [], 'risky_count': 0, 'error': msg}
        
        img = preprocess_result['image']
        
        if self._model is None:
            self._init_model()
        
        if self._model is None:
            return {'detections': [], 'risky_count': 0, 'error': 'Model not available'}
        
        try:
            results = self._model.predict(
                img,
                conf=self.confidence_threshold,
                iou=self.iou_threshold,
                verbose=False
            )
            
            detections = []
            risky_count = 0
            
            if results and len(results) > 0:
                result = results[0]
                boxes = result.boxes
                
                for i in range(len(boxes)):
                    box = boxes[i]
                    label = box.cls[0].item()
                    conf = box.conf[0].item()
                    label_name = self._model.names[int(label)]
                    mapped_label = self._map_label(label_name)
                    
                    risk_level = self._get_risk_level(label_name)
                    
                    detection = {
                        'label': mapped_label,
                        'original_label': label_name,
                        'confidence': float(conf),
                        'risk_level': risk_level,
                        'bbox': {
                            'x1': float(box.xyxy[0][0].item()),
                            'y1': float(box.xyxy[0][1].item()),
                            'x2': float(box.xyxy[0][2].item()),
                            'y2': float(box.xyxy[0][3].item())
                        }
                    }
                    
                    detections.append(detection)
                    if risk_level:
                        risky_count += 1
            
            return {
                'detections': detections,
                'risky_count': risky_count,
                'total_count': len(detections)
            }
            
        except Exception as e:
            logger.error(f"Object detection failed: {e}")
            return {'detections': [], 'risky_count': 0, 'error': str(e)}


def create_detection_engine(config, preprocessor) -> DetectionEngine:
    return DetectionEngine(config, preprocessor)