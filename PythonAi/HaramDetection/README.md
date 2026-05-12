# Image Moderation Pipeline

CPU-first image moderation pipeline for detecting haram/disallowed content using a multi-model stack.

## Features

- **PaddleOCR** - Text extraction and keyword detection
- **YOLO** - Object detection for risky items (alcohol, weapons, etc.)
- **NudeNet** - NSFW/nudity scoring
- **Moondream** - Contextual scene understanding
- **Rule Engine** - Combines all signals into a final risk score

## Architecture

```
Input Image
    → Preprocessing (validate, resize, normalize)
    → OCR Stage (text extraction)
    → Object Detection (risky objects)
    → NSFW Scoring (nudity detection)
    → Contextual Reasoning (scene understanding)
    → Rule Engine (combine signals)
    → Final Verdict
```

## Installation

```bash
pip install -r requirements.txt
```

Note: Some models require additional setup:

- PaddleOCR: Requires paddlepaddle
- NudeNet: `pip install nudenet`
- Moondream: Auto-downloads on first use

## Usage

### Command Line

```bash
python main.py path/to/image.jpg
```

### Python API

```python
from src.api import create_api

api = create_api()
result = api.check_file('image.jpg')

print(f"Label: {result['label']}")
print(f"Score: {result['score']}")
print(f"Signals: {result['signals']}")
```

### Configuration

Edit `config.yaml` to adjust:

- Model thresholds
- Scoring weights
- Risky objects and keywords
- Pipeline settings

## Output Format

```json
{
  "score": 85.5,
  "label": "HIGH RISK",
  "severity": "critical",
  "confidence": "high",
  "signals": [
    {
      "type": "nsfw",
      "risk": "high",
      "source": "nudenet",
      "message": "High NSFW probability: 0.92"
    }
  ],
  "details": {
    "ocr_score": 0,
    "detection_score": 35,
    "nsfw_score": 92,
    "vision_score": 40
  },
  "timing": {
    "total": 5.2
  }
}
```

## Score Bands

- **0-25**: SAFE
- **26-50**: QUESTIONABLE
- **51-75**: HARAM
- **76-100**: HIGH RISK

## CPU Optimization

- Uses YOLOv8n (nano) for fast object detection
- Early exits for obvious unsafe content
- Conditional model execution
- Configurable timeouts
- Lightweight preprocessing

## Testing

```bash
pytest tests/ -v
```

## License

MIT
