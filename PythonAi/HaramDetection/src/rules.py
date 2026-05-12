import logging
from typing import Dict, Any, List, Optional, Tuple

logger = logging.getLogger(__name__)


class RuleEngine:
    def __init__(self, config):
        self.config = config
        self.weights = config.get('scoring.weights', {
            'ocr': 0.15,
            'yolo': 0.25,
            'nsfw': 0.35,
            'moondream': 0.25
        })
        self.thresholds = config.get('scoring.thresholds', {
            'safe_max': 25,
            'questionable_max': 50,
            'haram_max': 75
        })
        self.banned_keywords = config.banned_keywords
        self.context_triggers = config.context_triggers
        
        self.nsfw_levels = config.get('scoring.nsfw_score_levels', {
            'extreme': 70,
            'high': 50,
            'medium': 30,
            'low': 15
        })
        self.object_risk_scores = config.get('scoring.object_risk_scores', {
            'high': 35,
            'medium': 15
        })
        self.keyword_risk_scores = config.get('scoring.keyword_risk_scores', {
            'high': 40,
            'medium': 20
        })
    
    def evaluate(
        self,
        ocr_result: Dict[str, Any],
        detection_result: Dict[str, Any],
        nsfw_result: Dict[str, Any],
        vision_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        signals = []
        total_score = 0.0
        
        ocr_score, ocr_signals = self._evaluate_ocr(ocr_result)
        detection_score, detection_signals = self._evaluate_detection(detection_result)
        nsfw_score, nsfw_signals = self._evaluate_nsfw(nsfw_result)
        vision_score, vision_signals = self._evaluate_vision(vision_result)
        
        signals.extend(ocr_signals)
        signals.extend(detection_signals)
        signals.extend(nsfw_signals)
        signals.extend(vision_signals)
        
        total_score = (
            ocr_score * self.weights['ocr'] +
            detection_score * self.weights['yolo'] +
            nsfw_score * self.weights['nsfw'] +
            vision_score * self.weights['moondream']
        )
        
        signals.extend(self._check_combinations(
            ocr_result, detection_result, nsfw_result, vision_result
        ))
        
        confidence = self._calculate_confidence(
            ocr_result, detection_result, nsfw_result, vision_result, total_score
        )
        
        final_score = min(100, max(0, total_score))
        label, severity = self._get_label(final_score)
        
        return {
            'score': round(final_score, 2),
            'label': label,
            'severity': severity,
            'confidence': confidence,
            'signals': signals[:20],
            'details': {
                'ocr_score': round(ocr_score, 2),
                'detection_score': round(detection_score, 2),
                'nsfw_score': round(nsfw_score, 2),
                'vision_score': round(vision_score, 2),
                'weights': self.weights
            },
            'is_early_exit': final_score >= self.config.early_exit_threshold
        }
    
    def _evaluate_ocr(self, result: Dict[str, Any]) -> Tuple[float, List[Dict[str, Any]]]:
        score = 0.0
        signals = []
        
        if result.get('error'):
            return 0.0, signals
        
        text = result.get('full_text', '').lower()
        if not text:
            return 0.0, signals
        
        text_list = result.get('text', [])
        if not text_list:
            return 0.0, signals
        
        avg_conf = result.get('avg_confidence', 0)
        
        for keyword in self.banned_keywords.get('high_risk', []):
            if keyword in text:
                score += self.keyword_risk_scores['high']
                signals.append({
                    'type': 'ocr',
                    'risk': 'high',
                    'source': keyword,
                    'confidence': avg_conf,
                    'message': f"Banned keyword in text: {keyword} ({avg_conf:.0%})"
                })
        
        for keyword in self.banned_keywords.get('medium_risk', []):
            if keyword in text:
                score += self.keyword_risk_scores['medium']
                signals.append({
                    'type': 'ocr',
                    'risk': 'medium',
                    'source': keyword,
                    'confidence': avg_conf,
                    'message': f"Risky keyword in text: {keyword} ({avg_conf:.0%})"
                })
        
        return min(score, 60), signals
    
    def _evaluate_detection(self, result: Dict[str, Any]) -> Tuple[float, List[Dict[str, Any]]]:
        score = 0.0
        signals = []
        
        if result.get('error'):
            return 0.0, signals
        
        detections = result.get('detections', [])
        for det in detections:
            risk = det.get('risk_level')
            label = det.get('label', '')
            
            confidence = det.get('confidence', 0)
            if risk == 'high':
                score += self.object_risk_scores['high']
                signals.append({
                    'type': 'detection',
                    'risk': 'high',
                    'source': label,
                    'confidence': confidence,
                    'message': f"High-risk object detected: {label} ({confidence:.0%})"
                })
            elif risk == 'medium':
                score += self.object_risk_scores['medium']
                signals.append({
                    'type': 'detection',
                    'risk': 'medium',
                    'source': label,
                    'confidence': confidence,
                    'message': f"Medium-risk object detected: {label} ({confidence:.0%})"
                })
        
        risky_count = result.get('risky_count', 0)
        if risky_count > 1:
            score += 10
            signals.append({
                'type': 'detection',
                'risk': 'medium',
                'source': 'multiple',
                'message': f"Multiple risky objects detected ({risky_count})"
            })
        
        return min(score, 70), signals
    
    def _evaluate_nsfw(self, result: Dict[str, Any]) -> Tuple[float, List[Dict[str, Any]]]:
        score = 0.0
        signals = []
        
        if result.get('error'):
            return 0.0, signals
        
        nsfw_score = result.get('nsfw_score', 0.0)
        reasons = result.get('reasons', [])
        detections = result.get('detections', [])
        
        max_conf = max((d.get('score', 0) for d in detections), default=0)
        
        for reason in reasons:
            signals.append({
                'type': 'nsfw',
                'risk': 'high',
                'source': 'nudenet',
                'confidence': max_conf,
                'message': f"NSFW content detected: {reason}"
            })
        
        if nsfw_score >= self.nsfw_levels['extreme']:
            score = 100
            if not reasons:
                signals.append({
                    'type': 'nsfw',
                    'risk': 'high',
                'source': 'nudenet',
                    'message': f"High NSFW probability: {nsfw_score:.2f}"
            })
        elif nsfw_score >= self.nsfw_levels['high']:
            score = 75
            signals.append({
                'type': 'nsfw',
                'risk': 'high',
                'source': 'nudenet',
                'message': f"Moderate NSFW probability: {nsfw_score:.2f}"
            })
        elif nsfw_score >= self.nsfw_levels['medium']:
            score = 50
            signals.append({
                'type': 'nsfw',
                'risk': 'medium',
                'source': 'nudenet',
                'message': f"Low NSFW probability: {nsfw_score:.2f}"
            })
        elif nsfw_score >= self.nsfw_levels['low']:
            score = 20
            signals.append({
                'type': 'nsfw',
                'risk': 'low',
                'source': 'nudenet',
                'message': f"Slight NSFW detection: {nsfw_score:.2f}"
            })
        
        return score, signals
    
    def _evaluate_vision(self, result: Dict[str, Any]) -> Tuple[float, List[Dict[str, Any]]]:
        score = 0.0
        signals = []
        
        if result.get('error'):
            return 0.0, signals
        
        description = result.get('description', '')
        analysis = result.get('analysis', '')
        
        verdict = result.get('verdict', '')
        moondream_score = result.get('score', 0)
        reasons = result.get('reasons', '')
        
        if verdict:
            if verdict.upper() == 'HIGH_RISK':
                score = 100
                signals.append({
                    'type': 'vision',
                    'risk': 'high',
                    'source': 'moondream',
                    'message': f"Moondream: HIGH_RISK ({moondream_score})"
                })
            elif verdict.upper() == 'HARAM':
                score = 75
                signals.append({
                    'type': 'vision',
                    'risk': 'high',
                    'source': 'moondream',
                    'message': f"Moondream: HARAM ({moondream_score})"
                })
            elif verdict.upper() == 'QUESTIONABLE':
                score = 50
                signals.append({
                    'type': 'vision',
                    'risk': 'medium',
                    'source': 'moondream',
                    'message': f"Moondream: QUESTIONABLE ({moondream_score})"
                })
            else:
                score = 0
                
            if reasons:
                for reason in reasons.split(','):
                    reason = reason.strip()
                    if reason:
                        signals.append({
                            'type': 'vision',
                            'risk': 'medium',
                            'source': 'moondream',
                            'message': f"Reason: {reason}"
                        })
        else:
            full_text = (description + ' ' + analysis).lower()
            
            for trigger in self.context_triggers.get('high_risk', []):
                if trigger.lower() in full_text:
                    score += 40
                    signals.append({
                        'type': 'vision',
                        'risk': 'high',
                        'source': 'moondream',
                        'message': f"High-risk context detected: {trigger}"
                    })
            
            for trigger in self.context_triggers.get('medium_risk', []):
                if trigger.lower() in full_text:
                    score += 20
                    signals.append({
                        'type': 'vision',
                        'risk': 'medium',
                        'source': 'moondream',
                        'message': f"Medium-risk context: {trigger}"
                    })
        
        return min(max(score, 0), 80), signals
    
    def _check_combinations(
        self,
        ocr_result: Dict[str, Any],
        detection_result: Dict[str, Any],
        nsfw_result: Dict[str, Any],
        vision_result: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        signals = []
        
        nsfw_score = nsfw_result.get('nsfw_score', 0.0)
        detection_count = detection_result.get('risky_count', 0)
        
        if nsfw_score > 0.3 and detection_count > 0:
            signals.append({
                'type': 'combination',
                'risk': 'high',
                'source': 'multi_signal',
                'message': "NSFW content + risky objects detected"
            })
        
        ocr_text = ocr_result.get('full_text', '').lower()
        if any(k in ocr_text for k in ['nude', 'naked', 'porn']) and nsfw_score > 0.2:
            signals.append({
                'type': 'combination',
                'risk': 'high',
                'source': 'multi_signal',
                'message': "Explicit text + NSFW content"
            })
        
        return signals
    
    def _calculate_confidence(
        self,
        ocr_result: Dict[str, Any],
        detection_result: Dict[str, Any],
        nsfw_result: Dict[str, Any],
        vision_result: Dict[str, Any],
        score: float
    ) -> str:
        signal_count = 0
        
        if ocr_result.get('text'):
            signal_count += 1
        if detection_result.get('detections'):
            signal_count += 1
        if nsfw_result.get('nsfw_score', 0) > 0:
            signal_count += 1
        if vision_result.get('has_reasoning'):
            signal_count += 1
        
        if score > 75 and signal_count >= 3:
            return 'high'
        elif score > 50 and signal_count >= 2:
            return 'medium'
        elif score > 25:
            return 'medium'
        else:
            return 'low'
    
    def _get_label(self, score: float) -> Tuple[str, str]:
        if score <= self.thresholds['safe_max']:
            return 'SAFE', 'low'
        elif score <= self.thresholds['questionable_max']:
            return 'QUESTIONABLE', 'medium'
        elif score <= self.thresholds['haram_max']:
            return 'HARAM', 'high'
        else:
            return 'HIGH RISK', 'critical'


def create_rule_engine(config) -> RuleEngine:
    return RuleEngine(config)