from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.layout import Layout
from rich.text import Text
from rich.columns import Columns
from rich import box
from rich.style import Style
from datetime import datetime
import os

THEME = {
    "bg": "#0a0a1a",
    "purple": "#b366ff",
    "cyan": "#00d4ff",
    "pink": "#ff66cc",
    "blue": "#6677ff",
    "green": "#00ff88",
    "yellow": "#ffcc00",
    "red": "#ff4466",
    "orange": "#ff8833",
    "dim": "#555577",
    "white": "#e0e0ff",
}

SEVERITY_COLORS = {
    "critical": THEME["red"],
    "high": THEME["orange"],
    "medium": THEME["yellow"],
    "low": THEME["green"],
}

LABEL_COLORS = {
    "HIGH RISK": THEME["red"],
    "HARAM": THEME["orange"],
    "QUESTIONABLE": THEME["yellow"],
    "SAFE": THEME["green"],
}

console = Console()


def _gradient_text(text, colors):
    result = Text()
    n = len(text)
    for i, ch in enumerate(text):
        t = i / max(n - 1, 1)
        idx = min(int(t * (len(colors) - 1)), len(colors) - 2)
        local_t = (t * (len(colors) - 1)) - idx
        result.append(ch, style=colors[idx])
    return result


def display(result):
    theme = THEME
    console.clear()
    width = console.width
    try:
        import sys, io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    except:
        pass

    header = _gradient_text("  >> HARAM DETECTION <<  ", [theme["purple"], theme["cyan"], theme["pink"], theme["purple"]])
    sub = Text(f"  AI Content Moderation Pipeline  ", style=f"{theme['dim']} italic")
    console.print(Panel(Text.assemble(header, "\n", sub), box=box.DOUBLE_EDGE, border_style=theme["cyan"]))

    score = result.get("score", 0)
    label = result.get("label", "UNKNOWN")
    severity = result.get("severity", "unknown")
    label_color = LABEL_COLORS.get(label, theme["white"])
    sev_color = SEVERITY_COLORS.get(severity, theme["dim"])

    score_panel = Panel(
        Text.assemble(
            (f"\n  {score}\n", f"bold {label_color}"),
            (f"  {label}\n", f"bold {label_color} size=18"),
            (f"  {severity.upper()}\n", f"{sev_color} italic"),
        ),
        box=box.HEAVY,
        border_style=label_color,
        width=30,
    )

    timing = result.get("timing", {})
    total_time = timing.get("total", 0)
    confidence = result.get("confidence", "unknown")

    meta = Table.grid(padding=(0, 2))
    meta.add_column(style=theme["dim"])
    meta.add_column(style=theme["white"])
    meta.add_row("Confidence", confidence.upper())
    meta.add_row("Total Time", f"{total_time:.1f}s")
    meta.add_row("Timestamp", datetime.now().strftime("%H:%M:%S"))
    meta.add_row("Early Exit", str(result.get("is_early_exit", False)))

    console.print(Columns([score_panel, Panel(meta, box=box.ROUNDED, border_style=theme["purple"])]))

    signals = result.get("signals", [])
    if signals:
        sig_table = Table(box=box.SIMPLE, border_style=theme["dim"], header_style=f"bold {theme['cyan']}")
        sig_table.add_column("Signal", style=theme["pink"], width=10)
        sig_table.add_column("Risk", width=8)
        sig_table.add_column("Source", width=10)
        sig_table.add_column("Message")
        for s in signals:
            sig_table.add_row(
                s.get("type", ""),
                Text(s.get("risk", "").upper(), style=SEVERITY_COLORS.get(s.get("risk", "low"), theme["dim"])),
                s.get("source", ""),
                s.get("message", ""),
            )
        console.print(Panel(sig_table, title="Signals", title_align="left", border_style=theme["pink"]))

    details = result.get("details", {})
    score_details = details.get("ocr_score", {})

    weights = score_details if isinstance(score_details, dict) else {}
    if "weights" in details:
        weights = details["weights"]
    elif isinstance(score_details, dict) and "weights" in score_details:
        weights = score_details["weights"]

    score_table = Table.grid(padding=(0, 2))
    score_table.add_column(style=theme["dim"])
    score_table.add_column(style=theme["white"])
    for k in ["ocr", "yolo", "nsfw", "moondream"]:
        w = weights.get(k, 0) * 100 if isinstance(weights.get(k), (int, float)) and weights.get(k) <= 1 else weights.get(k, 0)
        score_table.add_row(f"{k.upper()}", f"{w}%" if isinstance(w, (int, float)) else str(w))

    engine_timing = timing.copy()
    engine_timing.pop("total", None)
    time_table = Table.grid(padding=(0, 2))
    time_table.add_column(style=theme["dim"])
    time_table.add_column(style=theme["white"])
    for engine, t in sorted(engine_timing.items()):
        time_table.add_row(engine.upper(), f"{t:.1f}s")

    engine_info = Panel(
        time_table,
        box=box.ROUNDED,
        border_style=theme["blue"],
        title="Engine Timing",
        title_align="left",
    )

    vision_result = details.get("vision", {})
    vision_parts = []
    desc = vision_result.get("description", "")
    if desc:
        vision_parts.append(Text.assemble(
            ("Description\n", f"bold {theme['cyan']}"),
            (desc[:300], theme["white"]),
        ))
    analysis = vision_result.get("analysis", "")
    if analysis:
        vision_parts.append(Text.assemble(
            ("\n\nAnalysis\n", f"bold {theme['cyan']}"),
            (analysis[:300], theme["white"]),
        ))
    verdict = vision_result.get("verdict", "")
    if verdict:
        vision_parts.append(Text.assemble(
            ("\n\nVerdict\n", f"bold {theme['cyan']}"),
            (verdict, LABEL_COLORS.get(verdict.upper().replace(" ", "_"), theme["orange"])),
        ))

    score_breakdown = Table.grid(padding=(0, 2))
    score_breakdown.add_column(style=theme["dim"])
    score_breakdown.add_column(style=theme["white"])
    ocr_s = details.get("ocr_score", 0)
    det_s = details.get("detection_score", 0)
    nsfw_s = details.get("nsfw_score", 0)
    vis_s = details.get("vision_score", 0)
    score_breakdown.add_row("OCR", f"{ocr_s}")
    score_breakdown.add_row("YOLO", f"{det_s}")
    score_breakdown.add_row("NSFW", f"{nsfw_s}")
    score_breakdown.add_row("Vision", f"{vis_s}")
    engine_info = Panel(
        score_breakdown,
        box=box.ROUNDED,
        border_style=theme["blue"],
        title="Score Breakdown",
        title_align="left",
    )

    vision_panel = None
    if vision_parts:
        vision_text = Text("")
        for part in vision_parts:
            vision_text.append_text(part)
            vision_text.append("\n")
        vision_panel = Panel(vision_text, box=box.ROUNDED, border_style=theme["pink"], title="Vision (Moondream)", title_align="left")

    bottom = []
    bottom.append(engine_info)
    if vision_panel:
        bottom.append(vision_panel)

    if len(bottom) == 2:
        console.print(Columns(bottom, width=width // 2 - 2))
    else:
        for p in bottom:
            console.print(p)

    nsfw = details.get("nsfw", {})
    nsfw_detections = nsfw.get("detections", [])
    if nsfw_detections:
        ns = Table(box=box.SIMPLE, border_style=theme["dim"], header_style=f"bold {theme['pink']}")
        ns.add_column("Class", width=28)
        ns.add_column("Score")
        ns.add_column("Description", width=40)
        for d in nsfw_detections:
            sc = d.get("score", 0)
            sc_color = THEME["green"] if sc < 0.3 else THEME["yellow"] if sc < 0.6 else THEME["red"]
            ns.add_row(
                d.get("class", ""),
                Text(f"{sc*100:.0f}%", style=f"bold {sc_color}"),
                d.get("description", ""),
            )
        console.print(Panel(ns, title="NSFW Detections", title_align="left", border_style=theme["red"]))

    ocr = details.get("ocr", {})
    ocr_texts = ocr.get("text", [])
    if ocr_texts:
        ot = Table(box=box.SIMPLE, border_style=theme["dim"], header_style=f"bold {theme['cyan']}")
        ot.add_column("Text", width=24)
        ot.add_column("Confidence")
        for t in ocr_texts:
            ot.add_row(t.get("text", ""), f"{t.get('confidence', 0)*100:.0f}%")
        console.print(Panel(ot, title="OCR Text", title_align="left", border_style=theme["cyan"]))

    detection_data = details.get("detection", {})
    detections = detection_data.get("detections", [])
    if detections:
        dt = Table(box=box.SIMPLE, border_style=theme["dim"], header_style=f"bold {theme['orange']}")
        dt.add_column("Object", width=16)
        dt.add_column("Confidence")
        dt.add_column("Risk")
        for d in detections:
            rl = d.get("risk_level")
            rl_color = THEME["green"] if rl == "low" else THEME["yellow"] if rl == "medium" else THEME["red"]
            dt.add_row(d.get("label", ""), f"{d.get('confidence', 0)*100:.0f}%", Text((rl or "").upper(), style=rl_color))
        console.print(Panel(dt, title="YOLO Detections", title_align="left", border_style=theme["orange"]))

    reasons = nsfw.get("reasons", [])
    if reasons:
        rr = Table(box=box.SIMPLE, border_style=theme["dim"], header_style=f"bold {theme['red']}")
        rr.add_column("Reason")
        for r in reasons:
            rr.add_row(r)
        console.print(Panel(rr, title="NSFW Reasons", title_align="left", border_style=theme["red"]))

    console.print(Panel(time_table, box=box.ROUNDED, border_style=theme["blue"], title="Engine Timing", title_align="left"))

    console.print(Panel(
        Text.assemble(
            ("  >> ", theme["purple"]),
            ("Har", theme["cyan"]),
            ("am Detection", theme["pink"]),
            (" <<  ", theme["purple"]),
            (f"  [ {total_time:.1f}s ]", theme["dim"]),
        ),
        box=box.DOUBLE_EDGE,
        border_style=theme["purple"],
    ))
