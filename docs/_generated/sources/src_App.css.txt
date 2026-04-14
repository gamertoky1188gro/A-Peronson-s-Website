    1 | @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Sora:wght@400;500;600;700&display=swap");
    2 | @import "tailwindcss";
    3 | 
    4 | /* Tailwind v4: make `dark:` respond to the `.dark` class (not OS media). */
    5 | @custom-variant dark (&:where(.dark, .dark *));
    6 | 
    7 | @layer base {
    8 |   :root {
    9 |     --bg: #f8fafc;
   10 |     --surface: #ffffff;
   11 |     --text: #1e293b;
   12 |     --muted: #475569;
   13 |     --border: #cbd5e1;
   14 |     --accent: #10b981;
   15 |     /* GarTex brand primary (locked): LinkedIn-style professional blue */
   16 |     --gt-blue: #0a66c2;
   17 |     --gt-blue-hover: #004182;
   18 |   }
   19 | 
   20 |   :root.dark {
   21 |     --bg: #0b1220;
   22 |     --surface: #111827;
   23 |     --text: #e5e7eb;
   24 |     --muted: #9ca3af;
   25 |     --border: #374151;
   26 |     --accent: #10b981;
   27 |     /* Keep the same primary blue in dark mode for brand consistency */
   28 |     --gt-blue: #0a66c2;
   29 |     --gt-blue-hover: #004182;
   30 |   }
   31 | 
   32 |   body {
   33 |     margin: 0;
   34 |     background: var(--bg);
   35 |     color: var(--text);
   36 |     font-family: Inter, system-ui, sans-serif;
   37 |   }
   38 | 
   39 |   button { cursor: pointer; }
   40 |   ul { padding-left: 1rem; }
   41 |   li { margin: 0.35rem 0; }
   42 | 
   43 |   /* Base polish (utilities can override these) */
   44 |   .card,
   45 |   .bg-white,
   46 |   .bg-gray-50,
   47 |   .bg-gray-100,
   48 |   section,
   49 |   article,
   50 |   aside,
   51 |   dialog {
   52 |     box-shadow:
   53 |       inset 0 1px 0 rgba(255, 255, 255, 0.62),
   54 |       0 14px 32px rgba(15, 23, 42, 0.1);
   55 |     transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease, filter 220ms ease;
   56 |   }
   57 | 
   58 |   button,
   59 |   .btn,
   60 |   a[class*='px-'],
   61 |   a[class*='py-'],
   62 |   a[class*='btn'] {
   63 |     border: none;
   64 |     border-radius: 12px;
   65 |     box-shadow:
   66 |       inset 0 1px 0 rgba(255, 255, 255, 0.58),
   67 |       0 10px 20px rgba(15, 23, 42, 0.12);
   68 |     transition: transform 160ms ease, box-shadow 180ms ease, filter 180ms ease, background 180ms ease;
   69 |   }
   70 | 
   71 |   button:hover,
   72 |   .btn:hover,
   73 |   a:hover {
   74 |     transform: translateY(-2px);
   75 |   }
   76 | 
   77 |   input, select, textarea {
   78 |     border: none;
   79 |     background: color-mix(in srgb, var(--surface) 95%, transparent);
   80 |     color: var(--text);
   81 |     padding: 0.6rem 0.75rem;
   82 |     border-radius: 12px;
   83 |     box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45), 0 8px 18px rgba(15, 23, 42, 0.06);
   84 |   }
   85 | 
   86 |   input:focus,
   87 |   select:focus,
   88 |   textarea:focus {
   89 |     outline: none;
   90 |     /* Brand-consistent focus ring (blue) */
   91 |     box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.18), 0 10px 28px rgba(10, 102, 194, 0.14);
   92 |   }
   93 | 
   94 |   img,
   95 |   video,
   96 |   canvas {
   97 |     border-radius: 14px;
   98 |     box-shadow: 0 14px 30px rgba(15, 23, 42, 0.2);
   99 |   }
  100 | 
  101 |   table,
  102 |   thead,
  103 |   tbody,
  104 |   tr,
  105 |   th,
  106 |   td {
  107 |     border: none;
  108 |   }
  109 | 
  110 |   /* Shared modern dark styling across every page */
  111 |   :root.dark body {
  112 |     background: #0b1220;
  113 |   }
  114 | 
  115 |   :root.dark .neo-page::before,
  116 |   :root.dark .cyberpunk-page::before,
  117 |   :root.dark .cyberpunk-card::after {
  118 |     opacity: 0;
  119 |     background: none;
  120 |     filter: none;
  121 |   }
  122 | 
  123 |   :root.dark .neo-panel,
  124 |   :root.dark .cyberpunk-card,
  125 |   :root.dark .card,
  126 |   :root.dark .bg-white,
  127 |   :root.dark .bg-gray-50,
  128 |   :root.dark .bg-gray-100,
  129 |   :root.dark .bg-slate-900,
  130 |   :root.dark nav,
  131 |   :root.dark header,
  132 |   :root.dark footer,
  133 |   :root.dark section,
  134 |   :root.dark article,
  135 |   :root.dark aside {
  136 |     background: var(--surface);
  137 |     border-color: transparent;
  138 |     box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
  139 |   }
  140 | }
  141 | 
  142 | @layer components {
  143 |   .page {
  144 |     max-width: 1200px;
  145 |     margin: 0 auto;
  146 |     padding: 1rem;
  147 |   }
  148 | 
  149 |   .neo-page {
  150 |     position: relative;
  151 |     isolation: isolate;
  152 |   }
  153 | 
  154 |   .neo-page::before {
  155 |     content: '';
  156 |     position: fixed;
  157 |     inset: -20% -10% auto -10%;
  158 |     height: 65vh;
  159 |     pointer-events: none;
  160 |     z-index: -1;
  161 |     opacity: 0;
  162 |     background:
  163 |       conic-gradient(from 140deg at 30% 40%, rgba(139, 92, 246, 0.3), rgba(34, 211, 238, 0.24), rgba(236, 72, 153, 0.22), rgba(139, 92, 246, 0.3));
  164 |     filter: blur(38px);
  165 |     transition: opacity 240ms ease;
  166 |   }
  167 | 
  168 |   .neo-panel {
  169 |     border-radius: 14px;
  170 |   }
  171 | 
  172 |   .cyberpunk-page {
  173 |     position: relative;
  174 |   }
  175 | 
  176 |   .cyberpunk-card {
  177 |     position: relative;
  178 |     overflow: hidden;
  179 |   }
  180 | 
  181 |   .cyberpunk-card::after {
  182 |     content: '';
  183 |     position: absolute;
  184 |     inset: 0;
  185 |     pointer-events: none;
  186 |     opacity: 0;
  187 |     background:
  188 |       linear-gradient(120deg, transparent 0%, rgba(196, 181, 253, 0.12) 28%, transparent 62%),
  189 |       radial-gradient(circle at 92% 8%, rgba(34, 211, 238, 0.2), transparent 46%);
  190 |     transition: opacity 220ms ease;
  191 |   }
  192 | 
  193 |   .topbar {
  194 |     display: flex;
  195 |     justify-content: space-between;
  196 |     align-items: center;
  197 |     gap: 1rem;
  198 |     flex-wrap: wrap;
  199 |   }
  200 | 
  201 |   .top-actions { display: flex; gap: 0.5rem; }
  202 |   .feedback { color: var(--muted); }
  203 | 
  204 |   .grid { display: grid; gap: 1rem; }
  205 |   .two-col { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  206 |   .full { grid-column: 1 / -1; }
  207 | 
  208 |   .card {
  209 |     background: var(--surface);
  210 |     border: none;
  211 |     border-radius: 12px;
  212 |     padding: 1rem;
  213 |   }
  214 | 
  215 |   .stack { display: grid; gap: 0.5rem; }
  216 | }
  217 | 
  218 | @layer base {
  219 |   :root.dark button,
  220 |   :root.dark .btn,
  221 |   :root.dark [role='button'],
  222 |   :root.dark a[class*='px-'],
  223 |   :root.dark a[class*='py-'] {
  224 |     background: #1f2937;
  225 |     color: #e5e7eb;
  226 |     border-color: transparent;
  227 |     box-shadow: 0 6px 16px rgba(0, 0, 0, 0.24);
  228 |   }
  229 | 
  230 |   :root.dark button:hover,
  231 |   :root.dark .btn:hover,
  232 |   :root.dark a:hover {
  233 |     transform: translateY(-1px);
  234 |     filter: none;
  235 |     box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3);
  236 |   }
  237 | 
  238 |   :root.dark input,
  239 |   :root.dark select,
  240 |   :root.dark textarea {
  241 |     background: #0f172a;
  242 |     color: #e5e7eb;
  243 |     border-color: transparent;
  244 |     box-shadow: none;
  245 |   }
  246 | 
  247 |   :root.dark input:focus,
  248 |   :root.dark select:focus,
  249 |   :root.dark textarea:focus {
  250 |     border-color: transparent;
  251 |     box-shadow: none;
  252 |   }
  253 | 
  254 |   :root.dark h1,
  255 |   :root.dark h2,
  256 |   :root.dark h3,
  257 |   :root.dark h4,
  258 |   :root.dark h5,
  259 |   :root.dark h6 {
  260 |     color: #f3f4f6;
  261 |     text-shadow: none;
  262 |   }
  263 | 
  264 |   :root.dark .text-purple-600,
  265 |   :root.dark .text-purple-700,
  266 |   :root.dark .text-violet-600,
  267 |   :root.dark .text-fuchsia-600 {
  268 |     color: #c4b5fd !important;
  269 |     text-shadow: none;
  270 |   }
  271 | 
  272 |   .admin-shell {
  273 |     --admin-bg: #03070D;
  274 |     --admin-panel: #13171E;
  275 |     --admin-panel-strong: #13171E;
  276 |     --admin-border: rgba(75, 157, 251, 0.35);
  277 |     --admin-glow: rgba(75, 157, 251, 0.55);
  278 |     --admin-glow-soft: rgba(75, 157, 251, 0.22);
  279 |     position: relative;
  280 |     background: var(--admin-bg);
  281 |     background-image: none;
  282 |     color: #f8fafc;
  283 |     overflow: hidden;
  284 |     font-family: "Space Grotesk", "Sora", Inter, system-ui, sans-serif;
  285 |   }
  286 | 
  287 |   :root:not(.dark) .admin-shell {
  288 |     --admin-bg: #E0E0E0;
  289 |     --admin-panel: #FFFFFF;
  290 |     --admin-panel-strong: #FFFFFF;
  291 |     --admin-border: rgba(75, 157, 251, 0.22);
  292 |     --admin-glow: rgba(75, 157, 251, 0.35);
  293 |     --admin-glow-soft: rgba(75, 157, 251, 0.16);
  294 |     color: #0f172a;
  295 |     background-image: none;
  296 |   }
  297 | 
  298 |   .admin-plasma {
  299 |     position: absolute;
  300 |     inset: 10% -20% auto -20%;
  301 |     height: 220px;
  302 |     background: linear-gradient(90deg, transparent 0%, rgba(75, 157, 251, 0.08) 30%, rgba(129, 140, 248, 0.22) 50%, rgba(75, 157, 251, 0.08) 70%, transparent 100%);
  303 |     filter: blur(28px);
  304 |     opacity: 0;
  305 |     animation: plasmaFlow 18s linear infinite;
  306 |     pointer-events: none;
  307 |   }
  308 | 
  309 |   .admin-current {
  310 |     position: absolute;
  311 |     inset: 22% -30% auto -30%;
  312 |     height: 120px;
  313 |     background: linear-gradient(90deg, transparent 0%, rgba(75, 157, 251, 0.12) 25%, rgba(129, 140, 248, 0.35) 55%, rgba(75, 157, 251, 0.12) 75%, transparent 100%);
  314 |     filter: blur(18px);
  315 |     opacity: 0;
  316 |     animation: currentFlow 12s linear infinite;
  317 |     pointer-events: none;
  318 |   }
  319 | 
  320 |   .admin-noise {
  321 |     position: absolute;
  322 |     inset: 0;
  323 |     pointer-events: none;
  324 |     background-image: none;
  325 |     opacity: 0;
  326 |   }
  327 | 
  328 |   .admin-panel {
  329 |     background: var(--admin-panel);
  330 |     border: none;
  331 |     box-shadow: none;
  332 |     backdrop-filter: blur(18px);
  333 |     border-radius: 24px;
  334 |     position: relative;
  335 |     overflow: hidden;
  336 |   }
  337 | 
  338 |   .admin-sidebar {
  339 |     background: var(--admin-panel);
  340 |     box-shadow:
  341 |       0 24px 50px rgba(0, 0, 0, 0.55);
  342 |   }
  343 | 
  344 |   :root:not(.dark) .admin-sidebar {
  345 |     background: var(--admin-panel);
  346 |     box-shadow:
  347 |       0 22px 40px rgba(15, 23, 42, 0.12);
  348 |   }
  349 | 
  350 |   .admin-sidebar-item {
  351 |     display: flex;
  352 |     align-items: center;
  353 |     gap: 0.6rem;
  354 |     width: 100%;
  355 |     padding: 0.55rem 0.75rem;
  356 |     border-radius: 14px;
  357 |     font-size: 0.78rem;
  358 |     font-weight: 600;
  359 |     border: none;
  360 |     color: rgba(226, 232, 240, 0.78);
  361 |     background: transparent !important;
  362 |     background-color: transparent !important;
  363 |     border: none;
  364 |     box-shadow: none !important;
  365 |     white-space: nowrap;
  366 |     overflow: hidden;
  367 |     text-overflow: ellipsis;
  368 |     transition: background 180ms ease, color 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  369 |   }
  370 | 
  371 |   .admin-sidebar-label {
  372 |     display: block;
  373 |     min-width: 0;
  374 |     overflow: hidden;
  375 |     text-overflow: ellipsis;
  376 |   }
  377 | 
  378 |   .admin-sidebar-item:hover {
  379 |     background: transparent !important;
  380 |     color: #f8fafc;
  381 |     box-shadow: none !important;
  382 |   }
  383 | 
  384 |   .admin-sidebar-item.is-active {
  385 |     background: transparent !important;
  386 |     color: #4B9DFB;
  387 |     border-color: transparent;
  388 |     box-shadow: 0 12px 26px rgba(15, 23, 42, 0.35);
  389 |   }
  390 | 
  391 |   .admin-sidebar-rail {
  392 |     width: 6px;
  393 |     height: 22px;
  394 |     border-radius: 999px;
  395 |     background: transparent;
  396 |     box-shadow: none;
  397 |   }
  398 | 
  399 |   .admin-sidebar-item.is-active .admin-sidebar-rail {
  400 |     background: #4B9DFB;
  401 |     box-shadow: 0 0 16px rgba(75, 157, 251, 0.65);
  402 |   }
  403 | 
  404 |   :root:not(.dark) .admin-sidebar-item {
  405 |     color: #0f172a;
  406 |   }
  407 | 
  408 |   :root:not(.dark) .admin-sidebar-item:hover {
  409 |     background: transparent !important;
  410 |     color: #0f172a;
  411 |   }
  412 | 
  413 |   :root:not(.dark) .admin-sidebar-item.is-active {
  414 |     background: transparent !important;
  415 |     border-color: transparent;
  416 |     color: #4B9DFB;
  417 |   }
  418 | 
  419 |   .admin-sidebar-item.is-active svg {
  420 |     color: #4B9DFB;
  421 |   }
  422 | 
  423 |   .admin-shell .admin-sidebar-item,
  424 |   :root.dark .admin-shell .admin-sidebar-item,
  425 |   :root.dark .admin-sidebar-item:hover,
  426 |   :root.dark .admin-sidebar-item.is-active {
  427 |     background: transparent !important;
  428 |     background-color: transparent !important;
  429 |     box-shadow: none !important;
  430 |   }
  431 | 
  432 |   .admin-card {
  433 |     background: var(--admin-panel-strong);
  434 |     border: none;
  435 |     box-shadow: none;
  436 |     transition: transform 220ms ease, box-shadow 240ms ease, border-color 240ms ease;
  437 |     border-radius: 22px;
  438 |     position: relative;
  439 |     overflow: hidden;
  440 |   }
  441 | 
  442 |   .admin-card::before,
  443 |   .admin-panel::before {
  444 |     content: '';
  445 |     position: absolute;
  446 |     inset: 0;
  447 |     pointer-events: none;
  448 |     background: transparent;
  449 |     opacity: 0;
  450 |   }
  451 | 
  452 |   .admin-card:hover {
  453 |     transform: translateY(-4px);
  454 |     box-shadow: none;
  455 |   }
  456 | 
  457 |   .admin-glow {
  458 |     box-shadow: 0 0 20px var(--admin-glow-soft), 0 0 45px var(--admin-glow);
  459 |   }
  460 | 
  461 |   .admin-float {
  462 |     animation: floatSlow 6s ease-in-out infinite;
  463 |   }
  464 | 
  465 |   .admin-sweep {
  466 |     position: relative;
  467 |     overflow: hidden;
  468 |   }
  469 | 
  470 |   .admin-sweep::after {
  471 |     content: '';
  472 |     position: absolute;
  473 |     inset: 0;
  474 |     background: linear-gradient(120deg, transparent 0%, rgba(99, 179, 237, 0.18) 45%, transparent 70%);
  475 |     transform: translateX(-120%);
  476 |     transition: transform 600ms ease;
  477 |   }
  478 | 
  479 |   .admin-sweep:hover::after {
  480 |     transform: translateX(120%);
  481 |   }
  482 | 
  483 |   .admin-shell input,
  484 |   .admin-shell select,
  485 |   .admin-shell textarea {
  486 |     background: rgba(8, 8, 10, 0.72);
  487 |     border: none;
  488 |     color: inherit;
  489 |     box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 18px rgba(255, 140, 30, 0.12);
  490 |     backdrop-filter: blur(10px);
  491 |   }
  492 | 
  493 |   :root:not(.dark) .admin-shell input,
  494 |   :root:not(.dark) .admin-shell select,
  495 |   :root:not(.dark) .admin-shell textarea {
  496 |     background: rgba(255, 255, 255, 0.9);
  497 |     color: #0f172a;
  498 |     box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65), 0 10px 24px rgba(15, 23, 42, 0.08);
  499 |   }
  500 | 
  501 |   :root.dark .admin-shell [class~="bg-white"] {
  502 |     background: var(--admin-panel-strong) !important;
  503 |   }
  504 | 
  505 |   :root.dark .admin-shell [class~="bg-slate-100"] {
  506 |     background: transparent !important;
  507 |     color: #e2e8f0 !important;
  508 |   }
  509 | 
  510 |   :root.dark .admin-shell [class~="bg-slate-900"] {
  511 |     background: rgba(10, 10, 12, 0.9) !important;
  512 |   }
  513 | 
  514 |   :root.dark .admin-shell [class~="border-slate-200"] {
  515 |     border-color: var(--admin-border) !important;
  516 |   }
  517 | 
  518 |   .admin-shell [class~="border-slate-200"],
  519 |   .admin-shell [class~="border-slate-700"],
  520 |   .admin-shell [class~="border-slate-800"],
  521 |   .admin-shell [class~="border-rose-500/40"] {
  522 |     border: none !important;
  523 |   }
  524 | 
  525 |   :root.dark .admin-shell [class~="text-slate-500"] {
  526 |     color: rgba(226, 232, 240, 0.58) !important;
  527 |   }
  528 | 
  529 |   :root.dark .admin-shell [class~="text-slate-600"] {
  530 |     color: rgba(226, 232, 240, 0.72) !important;
  531 |   }
  532 | }
  533 | 
  534 | @keyframes plasmaFlow {
  535 |   0% { transform: translateX(-15%) }
  536 |   100% { transform: translateX(15%) }
  537 | }
  538 | 
  539 | @keyframes currentFlow {
  540 |   0% { transform: translateX(-20%); }
  541 |   100% { transform: translateX(20%); }
  542 | }
  543 | 
  544 | @keyframes floatSlow {
  545 |   0%, 100% { transform: translateY(0px) }
  546 |   50% { transform: translateY(-6px) }
  547 | }
  548 | 
  549 | @layer components {
  550 |   .spotlight-card {
  551 |     position: relative;
  552 |     overflow: hidden;
  553 |     --spotlight-x: 50%;
  554 |     --spotlight-y: 50%;
  555 |   }
  556 | 
  557 |   .spotlight-card::before {
  558 |     content: '';
  559 |     position: absolute;
  560 |     inset: -1px;
  561 |     pointer-events: none;
  562 |     opacity: 0;
  563 |     transition: opacity 220ms ease;
  564 |     background: radial-gradient(520px circle at var(--spotlight-x) var(--spotlight-y), rgba(15, 23, 42, 0.06), transparent 42%);
  565 |   }
  566 | 
  567 |   :root.dark .spotlight-card::before {
  568 |     background: radial-gradient(620px circle at var(--spotlight-x) var(--spotlight-y), rgba(16, 185, 129, 0.10), transparent 45%);
  569 |     mix-blend-mode: screen;
  570 |   }
  571 | 
  572 |   .spotlight-card:hover::before {
  573 |     opacity: 1;
  574 |   }
  575 | 
  576 |   .verified-pulse {
  577 |     animation: verifiedPulse 1.5s ease-in-out infinite;
  578 |   }
  579 | 
  580 |   @keyframes verifiedPulse {
  581 |     0%, 100% { transform: scale(1); filter: saturate(1); }
  582 |     50% { transform: scale(1.03); filter: saturate(1.15); }
  583 |   }
  584 | 
  585 |   .conic-beam {
  586 |     position: relative;
  587 |   }
  588 | 
  589 |   .conic-beam::before {
  590 |     content: '';
  591 |     position: absolute;
  592 |     inset: -1px;
  593 |     border-radius: inherit;
  594 |     padding: 1px;
  595 |     pointer-events: none;
  596 |     background: conic-gradient(
  597 |       from 180deg,
  598 |       transparent 0deg,
  599 |       rgba(45, 212, 191, 0.0) 40deg,
  600 |       rgba(45, 212, 191, 0.55) 110deg,
  601 |       rgba(59, 130, 246, 0.55) 170deg,
  602 |       rgba(245, 158, 11, 0.55) 230deg,
  603 |       rgba(45, 212, 191, 0.0) 300deg,
  604 |       transparent 360deg
  605 |     );
  606 |     -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  607 |     -webkit-mask-composite: xor;
  608 |     mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  609 |     mask-composite: exclude;
  610 |     opacity: 0.85;
  611 |     animation: conicSpin 12s linear infinite;
  612 |   }
  613 | 
  614 |   @keyframes conicSpin {
  615 |     to { transform: rotate(360deg); }
  616 |   }
  617 | 
  618 |   @media (prefers-reduced-motion: reduce) {
  619 |     .verified-pulse { animation: none; }
  620 |     .conic-beam::before { animation: none; }
  621 |   }
  622 | 
  623 |   .weave-bg {
  624 |     position: relative;
  625 |     isolation: isolate;
  626 |   }
  627 | 
  628 |   .weave-bg::before {
  629 |     content: '';
  630 |     position: absolute;
  631 |     inset: 0;
  632 |     pointer-events: none;
  633 |     z-index: -1;
  634 |     opacity: 0.06;
  635 |     background-image:
  636 |       repeating-linear-gradient(0deg, rgba(15, 23, 42, 0.08) 0px, rgba(15, 23, 42, 0.08) 1px, transparent 1px, transparent 14px),
  637 |       repeating-linear-gradient(90deg, rgba(15, 23, 42, 0.06) 0px, rgba(15, 23, 42, 0.06) 1px, transparent 1px, transparent 14px);
  638 |     mix-blend-mode: multiply;
  639 |   }
  640 | 
  641 |   :root.dark .weave-bg::before {
  642 |     opacity: 0.10;
  643 |     background-image:
  644 |       repeating-linear-gradient(0deg, rgba(56, 189, 248, 0.10) 0px, rgba(56, 189, 248, 0.10) 1px, transparent 1px, transparent 16px),
  645 |       repeating-linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0px, rgba(16, 185, 129, 0.08) 1px, transparent 1px, transparent 16px);
  646 |     mix-blend-mode: screen;
  647 |   }
  648 | 
  649 |   .legal-weave {
  650 |     position: relative;
  651 |     isolation: isolate;
  652 |   }
  653 | 
  654 |   .legal-weave::before {
  655 |     content: '';
  656 |     position: absolute;
  657 |     inset: 0;
  658 |     pointer-events: none;
  659 |     z-index: -1;
  660 |     opacity: 0.035;
  661 |     background-image:
  662 |       repeating-linear-gradient(0deg, rgba(15, 23, 42, 0.08) 0px, rgba(15, 23, 42, 0.08) 1px, transparent 1px, transparent 16px),
  663 |       repeating-linear-gradient(90deg, rgba(15, 23, 42, 0.06) 0px, rgba(15, 23, 42, 0.06) 1px, transparent 1px, transparent 16px);
  664 |     mix-blend-mode: multiply;
  665 |   }
  666 | 
  667 |   :root.dark .legal-weave::before {
  668 |     opacity: 0.06;
  669 |     background-image:
  670 |       repeating-linear-gradient(0deg, rgba(99, 102, 241, 0.10) 0px, rgba(99, 102, 241, 0.10) 1px, transparent 1px, transparent 18px),
  671 |       repeating-linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0px, rgba(16, 185, 129, 0.08) 1px, transparent 1px, transparent 18px);
  672 |     mix-blend-mode: screen;
  673 |   }
  674 | 
  675 |   .breath-verified {
  676 |     animation: breathVerified 3s ease-in-out infinite;
  677 |   }
  678 | 
  679 |   @keyframes breathVerified {
  680 |     0%, 100% { opacity: 0.7; transform: translateZ(0); }
  681 |     50% { opacity: 1; transform: translateZ(0); }
  682 |   }
  683 | 
  684 |   .signature-draw {
  685 |     --sig-len: 220;
  686 |   }
  687 | 
  688 |   .signature-draw path {
  689 |     stroke-dasharray: var(--sig-len);
  690 |     stroke-dashoffset: var(--sig-len);
  691 |     transition: stroke-dashoffset 520ms cubic-bezier(0.4, 0, 0.2, 1);
  692 |   }
  693 | 
  694 |   .signature-draw:hover path {
  695 |     stroke-dashoffset: 0;
  696 |   }
  697 | 
  698 |   .liquid-btn {
  699 |     position: relative;
  700 |     overflow: hidden;
  701 |   }
  702 | 
  703 |   .liquid-btn::before {
  704 |     content: '';
  705 |     position: absolute;
  706 |     inset: 0;
  707 |     transform: translateX(-110%);
  708 |     background: linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.22) 35%, rgba(16, 185, 129, 0.18) 65%, transparent 100%);
  709 |     transition: transform 420ms cubic-bezier(0.4, 0, 0.2, 1);
  710 |     pointer-events: none;
  711 |   }
  712 | 
  713 |   .liquid-btn:hover::before {
  714 |     transform: translateX(110%);
  715 |   }
  716 | 
  717 |   .verified-shimmer {
  718 |     position: relative;
  719 |     overflow: hidden;
  720 |   }
  721 | 
  722 |   .verified-shimmer::after {
  723 |     content: '';
  724 |     position: absolute;
  725 |     inset: 0;
  726 |     transform: translateX(-140%);
  727 |     background: linear-gradient(115deg, transparent 0%, rgba(255, 255, 255, 0.22) 45%, transparent 70%);
  728 |     animation: shimmer 4s ease-in-out infinite;
  729 |     opacity: 0.55;
  730 |     pointer-events: none;
  731 |   }
  732 | 
  733 |   :root.dark .verified-shimmer::after {
  734 |     background: linear-gradient(115deg, transparent 0%, rgba(16, 185, 129, 0.22) 45%, transparent 70%);
  735 |     opacity: 0.45;
  736 |     mix-blend-mode: screen;
  737 |   }
  738 | 
  739 |   .needle-area {
  740 |     position: relative;
  741 |     cursor: crosshair;
  742 |     --needle-x: 50%;
  743 |     --needle-y: 50%;
  744 |   }
  745 | 
  746 |   .needle-area .needle-cursor {
  747 |     position: absolute;
  748 |     left: 0;
  749 |     top: 0;
  750 |     width: 2px;
  751 |     height: 2px;
  752 |     transform: translate3d(calc(var(--needle-x) - 1px), calc(var(--needle-y) - 1px), 0);
  753 |     opacity: 0;
  754 |     transition: opacity 180ms ease;
  755 |     pointer-events: none;
  756 |     z-index: 5;
  757 |   }
  758 | 
  759 |   .needle-area:hover .needle-cursor {
  760 |     opacity: 1;
  761 |   }
  762 | 
  763 |   .needle-area .needle-cursor::before {
  764 |     content: '';
  765 |     position: absolute;
  766 |     width: 6px;
  767 |     height: 6px;
  768 |     left: -2px;
  769 |     top: -2px;
  770 |     border-radius: 999px;
  771 |     background: rgba(5, 150, 105, 0.9);
  772 |     box-shadow: 0 0 18px rgba(5, 150, 105, 0.35);
  773 |   }
  774 | 
  775 |   .needle-area .needle-cursor::after {
  776 |     content: '';
  777 |     position: absolute;
  778 |     width: 22px;
  779 |     height: 1px;
  780 |     left: 10px;
  781 |     top: 1px;
  782 |     background: linear-gradient(90deg, rgba(5, 150, 105, 0.65), transparent);
  783 |     box-shadow: 0 0 14px rgba(5, 150, 105, 0.22);
  784 |   }
  785 | 
  786 |   :root.dark .needle-area .needle-cursor::before {
  787 |     background: rgba(16, 185, 129, 0.95);
  788 |     box-shadow: 0 0 22px rgba(16, 185, 129, 0.35);
  789 |   }
  790 | 
  791 |   :root.dark .needle-area .needle-cursor::after {
  792 |     background: linear-gradient(90deg, rgba(16, 185, 129, 0.70), transparent);
  793 |     box-shadow: 0 0 16px rgba(16, 185, 129, 0.26);
  794 |   }
  795 | 
  796 |   @media (prefers-reduced-motion: reduce) {
  797 |     .liquid-btn::before { transition: none; }
  798 |     .breath-verified { animation: none; }
  799 |     .signature-draw path { transition: none; stroke-dashoffset: 0; }
  800 |     .needle-area .needle-cursor { display: none; }
  801 |     .assistant-orb-btn::before { animation: none; }
  802 |   }
  803 | 
  804 |   .assistant-orb-btn {
  805 |     position: relative;
  806 |     overflow: hidden;
  807 |     backdrop-filter: blur(18px);
  808 |     background: rgba(255, 255, 255, 0.18);
  809 |     border: none;
  810 |     box-shadow:
  811 |       0 18px 44px rgba(2, 6, 23, 0.20),
  812 |       inset 0 1px 0 rgba(255, 255, 255, 0.35);
  813 |   }
  814 | 
  815 |   :root.dark .assistant-orb-btn {
  816 |     background: rgba(15, 23, 42, 0.55);
  817 |     box-shadow:
  818 |       0 22px 60px rgba(0, 0, 0, 0.55),
  819 |       inset 0 1px 0 rgba(255, 255, 255, 0.10);
  820 |   }
  821 | 
  822 |   :root.dark .assistant-orb-btn::before {
  823 |     content: '';
  824 |     position: absolute;
  825 |     inset: -1px;
  826 |     border-radius: inherit;
  827 |     padding: 1px;
  828 |     pointer-events: none;
  829 |     background: conic-gradient(
  830 |       from 180deg,
  831 |       rgba(56, 189, 248, 0.0) 0deg,
  832 |       rgba(56, 189, 248, 0.55) 120deg,
  833 |       rgba(16, 185, 129, 0.45) 210deg,
  834 |       rgba(56, 189, 248, 0.0) 360deg
  835 |     );
  836 |     -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  837 |     -webkit-mask-composite: xor;
  838 |     mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  839 |     mask-composite: exclude;
  840 |     opacity: 0.95;
  841 |     animation: conicSpin 9s linear infinite;
  842 |   }
  843 | 
  844 |   .shimmer-btn {
  845 |     position: relative;
  846 |     overflow: hidden;
  847 |   }
  848 | 
  849 |   .shimmer-btn::after {
  850 |     content: '';
  851 |     position: absolute;
  852 |     inset: 0;
  853 |     transform: translateX(-140%);
  854 |     background: linear-gradient(115deg, transparent 0%, rgba(255, 255, 255, 0.14) 45%, transparent 70%);
  855 |     animation: shimmer 3s ease-in-out infinite;
  856 |     pointer-events: none;
  857 |   }
  858 | 
  859 |   @keyframes shimmer {
  860 |     0%, 55% { transform: translateX(-140%); opacity: 0; }
  861 |     65% { opacity: 1; }
  862 |     100% { transform: translateX(140%); opacity: 0; }
  863 |   }
  864 | 
  865 |   .skeleton {
  866 |     position: relative;
  867 |     overflow: hidden;
  868 |     border-radius: inherit;
  869 |     background: rgba(15, 23, 42, 0.06);
  870 |   }
  871 | 
  872 |   :root.dark .skeleton {
  873 |     background: rgba(255, 255, 255, 0.06);
  874 |   }
  875 | 
  876 |   .skeleton::after {
  877 |     content: '';
  878 |     position: absolute;
  879 |     inset: 0;
  880 |     transform: translateX(-140%);
  881 |     background: linear-gradient(115deg, transparent 0%, rgba(255, 255, 255, 0.28) 45%, transparent 70%);
  882 |     animation: skeletonShimmer 1.4s linear infinite;
  883 |     pointer-events: none;
  884 |     opacity: 0.7;
  885 |   }
  886 | 
  887 |   :root.dark .skeleton::after {
  888 |     background: linear-gradient(115deg, transparent 0%, rgba(255, 255, 255, 0.16) 45%, transparent 70%);
  889 |     opacity: 0.9;
  890 |   }
  891 | 
  892 |   @keyframes skeletonShimmer {
  893 |     0% { transform: translateX(-140%); }
  894 |     100% { transform: translateX(140%); }
  895 |   }
  896 | 
  897 |   .nav-glass {
  898 |     background: rgba(255, 255, 255, 0.80) !important;
  899 |     border-bottom-color: rgba(226, 232, 240, 0.60) !important;
  900 |     backdrop-filter: blur(12px);
  901 |   }
  902 | 
  903 |   :root.dark .nav-glass {
  904 |     background: rgba(2, 6, 23, 0.78) !important;
  905 |     border-bottom-color: rgba(30, 41, 59, 0.55) !important;
  906 |     backdrop-filter: blur(14px);
  907 |   }
  908 | 
  909 |   .secure-grid {
  910 |     position: relative;
  911 |     isolation: isolate;
  912 |   }
  913 | 
  914 |   .secure-grid::before {
  915 |     content: '';
  916 |     position: absolute;
  917 |     inset: 0;
  918 |     pointer-events: none;
  919 |     z-index: 0;
  920 |     opacity: 0.06;
  921 |     background-image:
  922 |       linear-gradient(rgba(15, 23, 42, 0.10) 1px, transparent 1px),
  923 |       linear-gradient(90deg, rgba(15, 23, 42, 0.08) 1px, transparent 1px);
  924 |     background-size: 28px 28px;
  925 |     mask-image: radial-gradient(circle at 30% 30%, rgba(0, 0, 0, 1), transparent 68%);
  926 |   }
  927 | 
  928 |   :root.dark .secure-grid::before {
  929 |     opacity: 0.10;
  930 |     background-image:
  931 |       linear-gradient(rgba(255, 255, 255, 0.10) 1px, transparent 1px),
  932 |       linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  933 |     background-size: 28px 28px;
  934 |     mix-blend-mode: screen;
  935 |   }
  936 | }
  937 | 
  938 | @media (max-width: 900px) {
  939 |   .two-col { grid-template-columns: 1fr; }
  940 | }
  941 | 
  942 | @keyframes callFloat {
  943 |   0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  944 |   50% { transform: translate3d(18px, -14px, 0) scale(1.04); }
  945 | }
  946 | 
  947 | .chat-markdown {
  948 |   font-size: 13px;
  949 |   line-height: 1.45;
  950 |   color: inherit;
  951 |   word-break: break-word;
  952 | }
  953 | 
  954 | .chat-markdown > :first-child { margin-top: 0; }
  955 | .chat-markdown > :last-child { margin-bottom: 0; }
  956 | .chat-markdown p { margin: 0.25rem 0; }
  957 | 
  958 | .chat-markdown code {
  959 |   font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  960 |   font-size: 0.92em;
  961 |   padding: 0.12rem 0.28rem;
  962 |   border-radius: 0.35rem;
  963 |   background: rgba(15, 23, 42, 0.08);
  964 | }
  965 | 
  966 | :root.dark .chat-markdown code {
  967 |   background: rgba(0, 0, 0, 0.35);
  968 | }
  969 | 
  970 | .chat-markdown pre {
  971 |   margin: 0.35rem 0;
  972 |   padding: 0.75rem;
  973 |   border-radius: 0.85rem;
  974 |   overflow-x: auto;
  975 |   background: #0b1020;
  976 |   color: #e2e8f0;
  977 | }
  978 | 
  979 | :root.dark .chat-markdown pre {
  980 |   background: rgba(0, 0, 0, 0.35);
  981 | }
  982 | 
  983 | .chat-markdown pre code {
  984 |   padding: 0;
  985 |   background: transparent;
  986 | }
  987 | 
  988 |   .chat-markdown blockquote {
  989 |     margin: 0.35rem 0;
  990 |     padding-left: 0.75rem;
  991 |     border: none;
  992 |     box-shadow: inset 3px 0 0 rgba(148, 163, 184, 0.75);
  993 |     opacity: 0.95;
  994 |   }
  995 | 
  996 |   :root.dark .chat-markdown blockquote {
  997 |     box-shadow: inset 3px 0 0 rgba(255, 255, 255, 0.12);
  998 |   }
  999 | 
 1000 | .chat-markdown table {
 1001 |   width: 100%;
 1002 |   border-collapse: collapse;
 1003 |   margin: 0.4rem 0;
 1004 |   font-size: 12px;
 1005 | }
 1006 | 
 1007 |   .chat-markdown th,
 1008 |   .chat-markdown td {
 1009 |     border: none;
 1010 |     box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.35);
 1011 |     padding: 0.35rem 0.5rem;
 1012 |   }
 1013 | 
 1014 |   :root.dark .chat-markdown th,
 1015 |   :root.dark .chat-markdown td {
 1016 |     box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
 1017 |   }
 1018 | 
 1019 | .chat-markdown th {
 1020 |   background: rgba(15, 23, 42, 0.06);
 1021 |   font-weight: 700;
 1022 | }
 1023 | 
 1024 | :root.dark .chat-markdown th {
 1025 |   background: rgba(255, 255, 255, 0.06);
 1026 | }
 1027 | 