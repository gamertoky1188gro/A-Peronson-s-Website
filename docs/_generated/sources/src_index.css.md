    1 | @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    2 | 
    3 | html,
    4 | body,
    5 | #root {
    6 |   min-height: 100%;
    7 | }
    8 | 
    9 | :root {
   10 |   color-scheme: light;
   11 | }
   12 | 
   13 | :root.dark {
   14 |   color-scheme: dark;
   15 | }
   16 | 
   17 | * {
   18 |   box-sizing: border-box;
   19 | }
   20 | 
   21 | /* Global dark neon layer: blue + purple + pink + cyan */
   22 | :root.dark body {
   23 |   background:
   24 |     radial-gradient(circle at 12% 10%, rgba(6, 182, 212, 0.2) 0%, transparent 35%),
   25 |     radial-gradient(circle at 88% 16%, rgba(217, 70, 239, 0.22) 0%, transparent 36%),
   26 |     radial-gradient(circle at 52% 84%, rgba(236, 72, 153, 0.18) 0%, transparent 34%),
   27 |     linear-gradient(145deg, #050816 0%, #0b1022 44%, #120726 100%);
   28 |   color: #e6edf8;
   29 | }
   30 | 
   31 | :root.dark .bg-white,
   32 | :root.dark .bg-gray-50,
   33 | :root.dark .bg-gray-100,
   34 | :root.dark .bg-slate-50,
   35 | :root.dark .bg-slate-100 {
   36 |   background-color: rgba(9, 16, 35, 0.82) !important;
   37 | }
   38 | 
   39 | :root.dark .bg-blue-50,
   40 | :root.dark .bg-indigo-50,
   41 | :root.dark .bg-purple-50 {
   42 |   background-color: rgba(17, 27, 57, 0.75) !important;
   43 | }
   44 | 
   45 | :root.dark .bg-blue-600,
   46 | :root.dark .bg-blue-700,
   47 | :root.dark .bg-indigo-600,
   48 | :root.dark .bg-purple-600,
   49 | :root.dark .bg-cyan-600,
   50 | :root.dark .bg-pink-600,
   51 | :root.dark .bg-\[\#0A66C2\] {
   52 |   background-image: linear-gradient(120deg, #0A66C2 0%, #2E8BFF 100%) !important;
   53 |   background-color: #0A66C2 !important;
   54 | }
   55 | 
   56 | :root.dark .enterprise-gradient,
   57 | :root.dark .bg-gradient-to-r,
   58 | :root.dark .bg-gradient-to-br,
   59 | :root.dark [class*='from-'][class*='to-'] {
   60 |   filter: saturate(1.15) brightness(1.08);
   61 | }
   62 | 
   63 | :root.dark .text-gray-900,
   64 | :root.dark .text-gray-800,
   65 | :root.dark .text-gray-700,
   66 | :root.dark .text-slate-900,
   67 | :root.dark .text-slate-800,
   68 | :root.dark .text-\[\#1A1A1A\] {
   69 |   color: #e8eeff !important;
   70 | }
   71 | 
   72 | :root.dark .text-gray-600,
   73 | :root.dark .text-gray-500,
   74 | :root.dark .text-slate-600,
   75 | :root.dark .text-slate-500,
   76 | :root.dark .text-\[\#5A5A5A\] {
   77 |   color: #a9b8d6 !important;
   78 | }
   79 | 
   80 | :root.dark .text-blue-600,
   81 | :root.dark .text-blue-700,
   82 | :root.dark .text-indigo-600,
   83 | :root.dark .text-purple-600,
   84 | :root.dark .text-cyan-600,
   85 | :root.dark .text-pink-600,
   86 | :root.dark .text-\[\#0A66C2\] {
   87 |   color: var(--gt-blue) !important;
   88 | }
   89 | 
   90 | :root.dark .border,
   91 | :root.dark .border-t,
   92 | :root.dark .border-b,
   93 | :root.dark .border-gray-200,
   94 | :root.dark .border-gray-300,
   95 | :root.dark .border-slate-200,
   96 | :root.dark .border-slate-300 {
   97 |   border-color: transparent !important;
   98 | }
   99 | 
  100 | :root.dark .rounded,
  101 | :root.dark .rounded-md,
  102 | :root.dark .rounded-lg,
  103 | :root.dark .rounded-xl,
  104 | :root.dark [class*='rounded-'] {
  105 |   backdrop-filter: blur(4px);
  106 | }
  107 | 
  108 | :root.dark .shadow,
  109 | :root.dark .shadow-sm,
  110 | :root.dark .shadow-md,
  111 | :root.dark .shadow-lg,
  112 | :root.dark .shadow-inner {
  113 |   box-shadow:
  114 |     0 8px 24px rgba(6, 182, 212, 0.14),
  115 |     0 12px 34px rgba(139, 92, 246, 0.2),
  116 |     0 0 26px rgba(236, 72, 153, 0.15) !important;
  117 | }
  118 | 
  119 | :root.dark button,
  120 | :root.dark .btn,
  121 | :root.dark [role='button'] {
  122 |   border-color: transparent !important;
  123 | }
  124 | 
  125 | :root.dark button:hover,
  126 | :root.dark .btn:hover,
  127 | :root.dark a:hover {
  128 |   box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  129 | }
  130 | 
  131 | :root.dark input,
  132 | :root.dark select,
  133 | :root.dark textarea {
  134 |   background: rgba(10, 19, 42, 0.85) !important;
  135 |   color: #e8eeff !important;
  136 |   border-color: transparent !important;
  137 | }
  138 | 
  139 | :root.dark input:focus,
  140 | :root.dark select:focus,
  141 | :root.dark textarea:focus {
  142 |   outline: none;
  143 |   box-shadow: 0 0 0 2px rgba(20, 30, 60, 0.8);
  144 | }
  145 | 
  146 | :root.dark .sticky,
  147 | :root.dark nav,
  148 | :root.dark header {
  149 |   background-color: rgba(7, 14, 31, 0.85) !important;
  150 | }
  151 | 
  152 | /* Borderless UI: replace borders with shadows */
  153 | :root {
  154 |   --borderless-shadow: 0 1px 2px rgba(15, 23, 42, 0.06), 0 12px 28px rgba(15, 23, 42, 0.10);
  155 |   --borderless-divider: inset 0 -1px 0 rgba(15, 23, 42, 0.12);
  156 |   --borderless-divider-top: inset 0 1px 0 rgba(15, 23, 42, 0.12);
  157 |   --borderless-divider-left: inset 1px 0 0 rgba(15, 23, 42, 0.12);
  158 |   --borderless-divider-right: inset -1px 0 0 rgba(15, 23, 42, 0.12);
  159 |   --borderless-divider-x: inset 1px 0 0 rgba(15, 23, 42, 0.12), inset -1px 0 0 rgba(15, 23, 42, 0.12);
  160 |   --borderless-divider-y: inset 0 1px 0 rgba(15, 23, 42, 0.12), inset 0 -1px 0 rgba(15, 23, 42, 0.12);
  161 | }
  162 | 
  163 | :root.dark {
  164 |   --borderless-shadow: 0 10px 26px rgba(0, 0, 0, 0.45), 0 22px 50px rgba(0, 0, 0, 0.55);
  165 |   --borderless-divider: inset 0 -1px 0 rgba(255, 255, 255, 0.08);
  166 |   --borderless-divider-top: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  167 |   --borderless-divider-left: inset 1px 0 0 rgba(255, 255, 255, 0.08);
  168 |   --borderless-divider-right: inset -1px 0 0 rgba(255, 255, 255, 0.08);
  169 |   --borderless-divider-x: inset 1px 0 0 rgba(255, 255, 255, 0.08), inset -1px 0 0 rgba(255, 255, 255, 0.08);
  170 |   --borderless-divider-y: inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 -1px 0 rgba(255, 255, 255, 0.08);
  171 | }
  172 | 
  173 | .borderless-shadow {
  174 |   box-shadow: var(--borderless-shadow);
  175 | }
  176 | 
  177 | .borderless-divider-b {
  178 |   box-shadow: var(--borderless-divider);
  179 | }
  180 | 
  181 | .borderless-divider-t {
  182 |   box-shadow: var(--borderless-divider-top);
  183 | }
  184 | 
  185 | .borderless-divider-l {
  186 |   box-shadow: var(--borderless-divider-left);
  187 | }
  188 | 
  189 | .borderless-divider-r {
  190 |   box-shadow: var(--borderless-divider-right);
  191 | }
  192 | 
  193 | .borderless-divider-x {
  194 |   box-shadow: var(--borderless-divider-x);
  195 | }
  196 | 
  197 | .borderless-divider-y {
  198 |   box-shadow: var(--borderless-divider-y);
  199 | }
  200 | 
  201 | :where(
  202 |   .border,
  203 |   .border-0,
  204 |   .border-2,
  205 |   .border-4,
  206 |   .border-8,
  207 |   .border-x,
  208 |   .border-y,
  209 |   .border-t,
  210 |   .border-b,
  211 |   .border-l,
  212 |   .border-r,
  213 |   [class*='border-'],
  214 |   [class~='border']
  215 | ) {
  216 |   border: none !important;
  217 | }
  218 | 
  219 | :where([class~='border'], [class*='border-']):not([class~='shadow']):not([class^='shadow-']):not([class*=' shadow-']):not([class*='border-none']):not([class*='border-0']) {
  220 |   --tw-shadow: var(--borderless-shadow);
  221 |   box-shadow:
  222 |     var(--tw-ring-offset-shadow, 0 0 #0000),
  223 |     var(--tw-ring-shadow, 0 0 #0000),
  224 |     var(--tw-shadow);
  225 | }
  226 | 
  227 | :where([class*='border-b']):not([class~='shadow']):not([class^='shadow-']):not([class*=' shadow-']):not([class*='border-none']):not([class*='border-0']) {
  228 |   --tw-shadow: var(--borderless-divider);
  229 |   box-shadow:
  230 |     var(--tw-ring-offset-shadow, 0 0 #0000),
  231 |     var(--tw-ring-shadow, 0 0 #0000),
  232 |     var(--tw-shadow);
  233 | }
  234 | 
  235 | :where([class*='border-t']):not([class~='shadow']):not([class^='shadow-']):not([class*=' shadow-']):not([class*='border-none']):not([class*='border-0']) {
  236 |   --tw-shadow: var(--borderless-divider-top);
  237 |   box-shadow:
  238 |     var(--tw-ring-offset-shadow, 0 0 #0000),
  239 |     var(--tw-ring-shadow, 0 0 #0000),
  240 |     var(--tw-shadow);
  241 | }
  242 | 
  243 | :where([class*='border-l']):not([class~='shadow']):not([class^='shadow-']):not([class*=' shadow-']):not([class*='border-none']):not([class*='border-0']) {
  244 |   --tw-shadow: var(--borderless-divider-left);
  245 |   box-shadow:
  246 |     var(--tw-ring-offset-shadow, 0 0 #0000),
  247 |     var(--tw-ring-shadow, 0 0 #0000),
  248 |     var(--tw-shadow);
  249 | }
  250 | 
  251 | :where([class*='border-r']):not([class~='shadow']):not([class^='shadow-']):not([class*=' shadow-']):not([class*='border-none']):not([class*='border-0']) {
  252 |   --tw-shadow: var(--borderless-divider-right);
  253 |   box-shadow:
  254 |     var(--tw-ring-offset-shadow, 0 0 #0000),
  255 |     var(--tw-ring-shadow, 0 0 #0000),
  256 |     var(--tw-shadow);
  257 | }
  258 | 
  259 | :where([class*='border-x']):not([class~='shadow']):not([class^='shadow-']):not([class*=' shadow-']):not([class*='border-none']):not([class*='border-0']) {
  260 |   --tw-shadow: var(--borderless-divider-x);
  261 |   box-shadow:
  262 |     var(--tw-ring-offset-shadow, 0 0 #0000),
  263 |     var(--tw-ring-shadow, 0 0 #0000),
  264 |     var(--tw-shadow);
  265 | }
  266 | 
  267 | :where([class*='border-y']):not([class~='shadow']):not([class^='shadow-']):not([class*=' shadow-']):not([class*='border-none']):not([class*='border-0']) {
  268 |   --tw-shadow: var(--borderless-divider-y);
  269 |   box-shadow:
  270 |     var(--tw-ring-offset-shadow, 0 0 #0000),
  271 |     var(--tw-ring-shadow, 0 0 #0000),
  272 |     var(--tw-shadow);
  273 | }
  274 | 