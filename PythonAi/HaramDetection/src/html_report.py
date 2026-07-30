import json
from datetime import datetime


def generate(result):
    t = THEME
    score = result.get("score", 0)
    label = result.get("label", "UNKNOWN")
    severity = result.get("severity", "unknown")
    confidence = result.get("confidence", "unknown")
    timing = result.get("timing", {})
    total = timing.get("total", 0)
    signals = result.get("signals", [])
    details = result.get("details", {})
    early_exit = result.get("is_early_exit", False)
    lc = LABEL_COLORS.get(label, "#e0e0ff")

    signal_rows = ""
    for s in signals:
        sc = SEV_COLORS.get(s.get("risk", "low"), "#555577")
        signal_rows += f"""<tr><td class="sig-type">{s.get("type","")}</td><td class="sig-risk" style="color:{sc}">{s.get("risk","").upper()}</td><td class="sig-src">{s.get("source","")}</td><td class="sig-msg">{s.get("message","")}</td></tr>"""

    nsfw = details.get("nsfw", {})
    nsfw_rows = ""
    for d in nsfw.get("detections", []):
        sc2 = d.get("score", 0)
        c = "#00ff88" if sc2 < 0.3 else "#ffcc00" if sc2 < 0.6 else "#ff4466"
        nsfw_rows += f"""<tr><td>{d.get("class","")}</td><td style="color:{c};font-weight:bold">{sc2*100:.0f}%</td><td>{d.get("description","")}</td></tr>"""

    nsfw_reason_rows = ""
    for r in nsfw.get("reasons", []):
        nsfw_reason_rows += f"<li>{r}</li>"

    ocr = details.get("ocr", {})
    ocr_rows = ""
    for t in ocr.get("text", []):
        ocr_rows += f"""<tr><td>{t.get("text","")}</td><td>{t.get("confidence",0)*100:.0f}%</td></tr>"""

    det = details.get("detection", {})
    det_rows = ""
    for d in det.get("detections", []):
        rl = d.get("risk_level") or ""
        rc = "#00ff88" if rl == "low" else "#ffcc00" if rl == "medium" else "#ff4466"
        det_rows += f"""<tr><td>{d.get("label","")}</td><td>{d.get("confidence",0)*100:.0f}%</td><td style="color:{rc}">{rl.upper() if rl else "NONE"}</td></tr>"""

    vis = details.get("vision", {})
    desc = vis.get("description", "")
    analysis = vis.get("analysis", "")
    verdict = vis.get("verdict", "")

    timing_rows = ""
    for k, v in sorted(timing.items()):
        timing_rows += f"""<tr><td>{k.upper()}</td><td>{v:.1f}s</td></tr>"""

    wt = details.get("weights", {})
    weight_rows = ""
    for k in ["ocr", "yolo", "nsfw", "moondream"]:
        w = wt.get(k, 0)
        w = (w * 100) if isinstance(w, (int, float)) and w <= 1 else w
        weight_rows += f"""<tr><td>{k.upper()}</td><td>{w}%</td></tr>"""

    ocr_s = details.get("ocr_score", 0)
    det_s = details.get("detection_score", 0)
    nsfw_s = details.get("nsfw_score", 0)
    vis_s = details.get("vision_score", 0)

    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    html = f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Haram Detection Report</title>
<style>
* {{ margin:0; padding:0; box-sizing:border-box; }}
body {{ background:#0a0a1a; font-family:'Segoe UI','Cascadia Code',monospace; color:#e0e0ff; padding:24px; min-height:100vh; }}
.container {{ max-width:1200px; margin:0 auto; }}

@keyframes glow {{ 0%,100% {{ filter:drop-shadow(0 0 8px {t['cyan']}); }} 50% {{ filter:drop-shadow(0 0 16px {t['pink']}); }} }}
@keyframes pulse {{ 0%,100% {{ opacity:1; }} 50% {{ opacity:0.6; }} }}

.header {{ text-align:center; padding:24px 0; margin-bottom:32px; border:2px solid {t['cyan']}; border-radius:12px; background:linear-gradient(135deg,#0a0a1a 0%,#1a0a2a 50%,#0a1a2a 100%); animation:glow 3s infinite; }}
.header h1 {{ font-size:2rem; background:linear-gradient(90deg,{t['purple']},{t['cyan']},{t['pink']},{t['purple']}); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }}
.header p {{ color:#555577; font-style:italic; }}

.top-row {{ display:grid; grid-template-columns:auto 1fr; gap:24px; margin-bottom:32px; }}

.score-card {{ padding:24px 48px; border:2px solid {lc}; border-radius:12px; text-align:center; animation:pulse 2s infinite; }}
.score-card .score {{ font-size:4rem; font-weight:bold; color:{lc}; }}
.score-card .label {{ font-size:1.5rem; font-weight:bold; color:{lc}; }}
.score-card .severity {{ font-size:1rem; color:{SEV_COLORS.get(severity, '#555577')}; font-style:italic; }}

.meta-card {{ padding:24px; border:1px solid {t['purple']}; border-radius:12px; }}
.meta-card table {{ width:100%; }}
.meta-card td {{ padding:4px 12px; }}
.meta-card td:first-child {{ color:#555577; }}
.meta-card td:last-child {{ color:#e0e0ff; }}

.section {{ margin-bottom:24px; padding:20px; border:1px solid; border-radius:12px; }}
.section h2 {{ font-size:1.1rem; margin-bottom:12px; text-transform:uppercase; letter-spacing:1px; }}

.signal-section {{ border-color:{t['pink']}; }}
.signal-section h2 {{ color:{t['pink']}; }}

.split {{ display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:24px; }}
@media (max-width:768px) {{ .split {{ grid-template-columns:1fr; }} }}

table {{ width:100%; border-collapse:collapse; }}
th {{ text-align:left; padding:6px 8px; color:{t['cyan']}; font-size:0.8rem; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #333; }}
td {{ padding:5px 8px; border-bottom:1px solid #1a1a2a; font-size:0.9rem; }}

.sig-type {{ color:{t['pink']}; }}
.sig-src {{ color:{t['dim']}; }}
.sig-msg {{ color:#e0e0ff; }}

.vision-section {{ border-color:{t['pink']}; }}
.vision-section h2 {{ color:{t['pink']}; }}
.vision-section .block {{ margin-bottom:12px; }}
.vision-section .block-title {{ color:{t['cyan']}; font-weight:bold; margin-bottom:4px; }}
.vision-section .block-content {{ color:#e0e0ff; font-size:0.9rem; line-height:1.5; }}

.nsfw-section {{ border-color:{t['red']}; }}
.nsfw-section h2 {{ color:{t['red']}; }}

.ocr-section {{ border-color:{t['cyan']}; }}
.ocr-section h2 {{ color:{t['cyan']}; }}

.yolo-section {{ border-color:{t['orange']}; }}
.yolo-section h2 {{ color:{t['orange']}; }}

.timing-section {{ border-color:{t['blue']}; }}
.timing-section h2 {{ color:{t['blue']}; }}

.score-section {{ border-color:{t['blue']}; }}
.score-section h2 {{ color:{t['blue']}; }}

.footer {{ text-align:center; padding:16px; border:2px solid {t['purple']}; border-radius:12px; color:{t['dim']}; font-size:0.9rem; }}
.footer span {{ background:linear-gradient(90deg,{t['purple']},{t['cyan']},{t['pink']}); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-weight:bold; }}
</style></head>
<body><div class="container">
<div class="header"><h1>⚡ HARAM DETECTION ⚡</h1><p>AI Content Moderation Pipeline</p></div>
<div class="top-row">
<div class="score-card"><div class="score">{score}</div><div class="label">{label}</div><div class="severity">{severity.upper()}</div></div>
<div class="meta-card"><table><tr><td>Confidence</td><td>{confidence.upper()}</td></tr><tr><td>Total Time</td><td>{total:.1f}s</td></tr><tr><td>Timestamp</td><td>{ts}</td></tr><tr><td>Early Exit</td><td>{str(early_exit)}</td></tr></table></div>
</div>
"""

    if signals:
        html += f"""<div class="section signal-section"><h2>⚡ Signals</h2><table><tr><th>Signal</th><th>Risk</th><th>Source</th><th>Message</th></tr>{signal_rows}</table></div>"""

    html += f"""<div class="split">
<div class="section score-section"><h2>📊 Score Breakdown</h2><table><tr><th>Engine</th><th>Score</th></tr><tr><td>OCR</td><td>{ocr_s}</td></tr><tr><td>YOLO</td><td>{det_s}</td></tr><tr><td>NSFW</td><td>{nsfw_s}</td></tr><tr><td>Vision</td><td>{vis_s}</td></tr></table></div>
<div class="section score-section"><h2>⚖️ Weights</h2><table><tr><th>Engine</th><th>Weight</th></tr>{weight_rows}</table></div>
</div>"""

    if desc or analysis or verdict:
        html += """<div class="section vision-section"><h2>🧠 Vision (Moondream)</h2>"""
        if desc:
            html += f"""<div class="block"><div class="block-title">Description</div><div class="block-content">{desc}</div></div>"""
        if analysis:
            html += f"""<div class="block"><div class="block-title">Analysis</div><div class="block-content">{analysis.replace(chr(10),"<br>")}</div></div>"""
        if verdict:
            html += f"""<div class="block"><div class="block-title">Verdict</div><div class="block-content" style="color:{LABEL_COLORS.get(verdict.upper().replace(' ','_'),t['orange'])}">{verdict}</div></div>"""
        html += "</div>"

    if nsfw_rows:
        html += f"""<div class="section nsfw-section"><h2>🔞 NSFW Detections</h2><table><tr><th>Class</th><th>Score</th><th>Description</th></tr>{nsfw_rows}</table></div>"""
    if nsfw_reason_rows:
        html += f"""<div class="section nsfw-section"><h2>⚠️ NSFW Reasons</h2><ul style="color:{t['red']};padding-left:24px">{nsfw_reason_rows}</ul></div>"""

    if ocr_rows:
        html += f"""<div class="section ocr-section"><h2>📝 OCR Text</h2><table><tr><th>Text</th><th>Confidence</th></tr>{ocr_rows}</table></div>"""

    if det_rows:
        html += f"""<div class="section yolo-section"><h2>🔍 YOLO Detections</h2><table><tr><th>Object</th><th>Confidence</th><th>Risk</th></tr>{det_rows}</table></div>"""

    html += f"""<div class="section timing-section"><h2>⏱️ Engine Timing</h2><table><tr><th>Engine</th><th>Time</th></tr>{timing_rows}</table></div>"""

    html += f"""<div class="footer"><span>⚡ Haram Detection ⚡</span> &nbsp; [ {total:.1f}s ]</div></div></body></html>"""
    return html


THEME = {"bg":"#0a0a1a","purple":"#b366ff","cyan":"#00d4ff","pink":"#ff66cc","blue":"#6677ff","green":"#00ff88","yellow":"#ffcc00","red":"#ff4466","orange":"#ff8833","dim":"#555577","white":"#e0e0ff"}
SEV_COLORS = {"critical":"#ff4466","high":"#ff8833","medium":"#ffcc00","low":"#00ff88"}
LABEL_COLORS = {"HIGH RISK":"#ff4466","HARAM":"#ff8833","QUESTIONABLE":"#ffcc00","SAFE":"#00ff88"}
