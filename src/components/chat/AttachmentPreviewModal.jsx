import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Download, File, X } from 'lucide-react'
import MarkdownMessage from './MarkdownMessage'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

const IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'gif', 'apng', 'webp', 'avif', 'svg', 'ico', 'bmp', 'tif', 'tiff'])
const VIDEO_EXTS = new Set(['mp4', 'mov', 'avi', 'wmv', 'webm', 'mkv', 'flv', '3gp', 'mpg', 'mpeg', 'm4v', 'amv'])
const MARKDOWN_EXTS = new Set(['md', 'markdown'])
const OFFICE_EXTS = new Set(['doc', 'docx'])
const SPREADSHEET_EXTS = new Set(['xls', 'xlsx', 'csv'])
const PRESENTATION_EXTS = new Set(['ppt', 'pptx'])
const RTF_EXTS = new Set(['rtf'])
const ODT_EXTS = new Set(['odt'])
const HTML_EXTS = new Set(['html', 'htm'])
const XML_EXTS = new Set(['xml'])
const CODE_EXTS = new Set([
  'c', 'cpp', 'h', 'hpp',
  'java', 'py',
  'js', 'jsx', 'ts', 'tsx',
  'cs', 'php', 'go', 'rb',
  'sql', 'sh', 'asm',
  'css', 'json', 'jsonc',
  'yml', 'yaml',
  'kt', 'ps1', 'bat',
])
const TEXT_EXTS = new Set([
  'txt', 'log', 'csv', 'tsv', 'json', 'jsonc', 'xml', 'sln', 'cbp',
  'html', 'htm', 'css',
  'js', 'jsx', 'ts', 'tsx',
  'py', 'java', 'c', 'cpp', 'h', 'hpp', 'sql',
  'yml', 'yaml',
  ...MARKDOWN_EXTS,
])

function safeExt(value = '') {
  const raw = String(value || '').trim()
  if (!raw) return ''
  const cleaned = raw.split('?')[0].split('#')[0]
  const tail = cleaned.split('/').pop() || cleaned
  const match = tail.match(/\.([a-z0-9]+)$/i)
  return match ? match[1].toLowerCase() : ''
}

function classifyAttachment(file) {
  const mime = String(file?.mimeType || file?.mime_type || '').trim().toLowerCase()
  const ext = safeExt(file?.name) || safeExt(file?.url)

  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime === 'application/pdf' || ext === 'pdf') return 'pdf'
  if (OFFICE_EXTS.has(ext)) return 'office'
  if (SPREADSHEET_EXTS.has(ext)) return 'spreadsheet'
  if (PRESENTATION_EXTS.has(ext)) return 'presentation'
  if (RTF_EXTS.has(ext)) return 'rtf'
  if (ODT_EXTS.has(ext)) return 'odt'
  if (HTML_EXTS.has(ext)) return 'html'
  if (XML_EXTS.has(ext)) return 'xml'
  if (mime.includes('markdown') || MARKDOWN_EXTS.has(ext)) return 'markdown'
  if (CODE_EXTS.has(ext)) return 'code'
  if (mime.startsWith('text/')) return 'text'
  if (IMAGE_EXTS.has(ext)) return 'image'
  if (VIDEO_EXTS.has(ext)) return 'video'
  if (TEXT_EXTS.has(ext)) return MARKDOWN_EXTS.has(ext) ? 'markdown' : 'text'
  return 'file'
}

function safeDownloadName(name = '') {
  const cleaned = String(name || '').trim()
  if (!cleaned) return undefined
  return cleaned.replace(/[\\/:*?"<>|]+/g, '_')
}

function asAbsoluteUrl(url = '') {
  const raw = String(url || '').trim()
  if (!raw) return ''
  try {
    return new URL(raw, window.location.origin).toString()
  } catch {
    return raw
  }
}

function isPrivateHostname(hostname = '') {
  const lower = String(hostname || '').trim().toLowerCase()
  if (!lower) return true
  if (lower === 'localhost' || lower === '127.0.0.1') return true
  if (lower.endsWith('.local')) return true

  // Private IPv4 ranges
  if (/^\\d+\\.\\d+\\.\\d+\\.\\d+$/.test(lower)) {
    const parts = lower.split('.').map((v) => Number(v))
    if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
      if (parts[0] === 10) return true
      if (parts[0] === 192 && parts[1] === 168) return true
      if (parts[0] === 169 && parts[1] === 254) return true
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true
    }
  }
  return false
}

function officeViewerEmbedUrl(fileUrl = '') {
  const absolute = asAbsoluteUrl(fileUrl)
  if (!absolute) return ''
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absolute)}`
}

function prismLanguageForExt(ext = '') {
  const normalized = String(ext || '').trim().toLowerCase()
  if (!normalized) return ''
  if (normalized === 'js') return 'javascript'
  if (normalized === 'jsx') return 'jsx'
  if (normalized === 'ts') return 'typescript'
  if (normalized === 'tsx') return 'tsx'
  if (normalized === 'py') return 'python'
  if (normalized === 'rb') return 'ruby'
  if (normalized === 'kt') return 'kotlin'
  if (normalized === 'json' || normalized === 'jsonc') return 'json'
  if (normalized === 'yml' || normalized === 'yaml') return 'yaml'
  if (normalized === 'sh') return 'bash'
  if (normalized === 'ps1') return 'powershell'
  if (normalized === 'bat') return 'batch'
  if (normalized === 'asm') return 'nasm'
  if (normalized === 'h' || normalized === 'hpp' || normalized === 'cpp') return 'cpp'
  if (normalized === 'c') return 'c'
  if (normalized === 'cs') return 'csharp'
  return normalized
}

const PRISM_LOADERS = {
  markup: async () => {
    await import('prismjs/components/prism-markup.js')
  },
  css: async () => {
    await import('prismjs/components/prism-css.js')
  },
  clike: async () => {
    await import('prismjs/components/prism-clike.js')
  },
  javascript: async () => {
    await PRISM_LOADERS.clike()
    await import('prismjs/components/prism-javascript.js')
  },
  jsx: async () => {
    await PRISM_LOADERS.javascript()
    await import('prismjs/components/prism-jsx.js')
  },
  typescript: async () => {
    await PRISM_LOADERS.javascript()
    await import('prismjs/components/prism-typescript.js')
  },
  tsx: async () => {
    await PRISM_LOADERS.typescript()
    await import('prismjs/components/prism-tsx.js')
  },
  json: async () => {
    await import('prismjs/components/prism-json.js')
  },
  yaml: async () => {
    await import('prismjs/components/prism-yaml.js')
  },
  python: async () => {
    await import('prismjs/components/prism-python.js')
  },
  java: async () => {
    await PRISM_LOADERS.clike()
    await import('prismjs/components/prism-java.js')
  },
  c: async () => {
    await PRISM_LOADERS.clike()
    await import('prismjs/components/prism-c.js')
  },
  cpp: async () => {
    await PRISM_LOADERS.clike()
    await import('prismjs/components/prism-cpp.js')
  },
  csharp: async () => {
    await PRISM_LOADERS.clike()
    await import('prismjs/components/prism-csharp.js')
  },
  php: async () => {
    await PRISM_LOADERS.clike()
    await PRISM_LOADERS.javascript()
    await import('prismjs/components/prism-php.js')
  },
  go: async () => {
    await import('prismjs/components/prism-go.js')
  },
  ruby: async () => {
    await import('prismjs/components/prism-ruby.js')
  },
  sql: async () => {
    await import('prismjs/components/prism-sql.js')
  },
  bash: async () => {
    await import('prismjs/components/prism-bash.js')
  },
  powershell: async () => {
    await import('prismjs/components/prism-powershell.js')
  },
  batch: async () => {
    await import('prismjs/components/prism-batch.js')
  },
  kotlin: async () => {
    await PRISM_LOADERS.clike()
    await import('prismjs/components/prism-kotlin.js')
  },
  nasm: async () => {
    await import('prismjs/components/prism-nasm.js')
  },
}

async function ensurePrismLanguage(lang = '') {
  const normalized = String(lang || '').trim().toLowerCase()
  if (!normalized) return ''
  if (normalized === 'xml' || normalized === 'html') return ensurePrismLanguage('markup')
  if (Prism?.languages?.[normalized]) return normalized
  const loader = PRISM_LOADERS[normalized]
  if (!loader) return normalized
  try {
    await loader()
  } catch {
    // Ignore missing/failed language chunks.
  }
  return normalized
}

function escapeHtml(value = '') {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatXml(xmlText = '') {
  const raw = String(xmlText || '').trim()
  if (!raw) return ''
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(raw, 'text/xml')
    const parseError = xmlDoc.getElementsByTagName('parsererror')?.[0]
    if (parseError) return raw

    const serializer = new XMLSerializer()
    const serialized = serializer.serializeToString(xmlDoc)

    const withLines = serialized.replace(/(>)(<)(\/?)/g, '$1\n$2$3')
    const lines = withLines.split('\n').map((line) => line.trim()).filter(Boolean)

    let indent = 0
    const formatted = lines.map((line) => {
      const isClosing = /^<\//.test(line)
      const isSelfClosing = /\/>$/.test(line) || /^<\?xml/.test(line) || /^<!/.test(line)
      if (isClosing) indent = Math.max(indent - 1, 0)
      const pad = '  '.repeat(indent)
      if (!isClosing && !isSelfClosing && /^<[^!?/][^>]*>$/.test(line)) indent += 1
      return `${pad}${line}`
    }).join('\n')

    return formatted
  } catch {
    return raw
  }
}

export default function AttachmentPreviewModal({ open = false, attachment = null, onClose = null }) {
  const file = attachment || null
  const kind = classifyAttachment(file)
  const fileExt = useMemo(() => safeExt(file?.name) || safeExt(file?.url), [file?.name, file?.url])
  const [textState, setTextState] = useState({ loading: false, error: '', content: '' })
  const [highlightState, setHighlightState] = useState({ loading: false, error: '', html: '', language: '', content: '' })
  const workbookRef = useRef(null)
  const xlsxUtilsRef = useRef(null)
  const [spreadsheetState, setSpreadsheetState] = useState({ loading: false, error: '', sheetNames: [], activeSheet: '', rows: [] })
  const [rtfState, setRtfState] = useState({ loading: false, error: '', html: '', meta: null })
  const [videoError, setVideoError] = useState(false)
  const [pdfState, setPdfState] = useState({ loading: false, error: '', blobUrl: '' })

  useEffect(() => {
    if (!open) return undefined
    const handler = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    setVideoError(false)
  }, [file?.url, kind])

  useEffect(() => {
    if (!open || !file?.url || (kind !== 'text' && kind !== 'markdown' && kind !== 'code' && kind !== 'xml' && kind !== 'html')) {
      setTextState({ loading: false, error: '', content: '' })
      return undefined
    }

    let alive = true
    const controller = new AbortController()

    async function load() {
      setTextState({ loading: true, error: '', content: '' })
      try {
        const response = await fetch(file.url, { signal: controller.signal })
        if (!response.ok) throw new Error(`Unable to load preview (${response.status})`)

        const len = Number(response.headers.get('content-length') || '0')
        if (len && len > 600_000) {
          setTextState({ loading: false, error: 'File is too large to preview. Please download it.', content: '' })
          return
        }

        const content = await response.text()
        const clipped = content.length > 200_000 ? `${content.slice(0, 200_000)}\n\n...(truncated)` : content
        if (!alive) return
        setTextState({ loading: false, error: '', content: clipped })
      } catch (error) {
        if (!alive) return
        if (error?.name === 'AbortError') return
        setTextState({ loading: false, error: error?.message || 'Unable to load preview', content: '' })
      }
    }

    load()

    return () => {
      alive = false
      controller.abort()
    }
  }, [open, file?.url, kind])

  useEffect(() => {
    if (!open || !file?.url || (kind !== 'code' && kind !== 'xml')) {
      setHighlightState({ loading: false, error: '', html: '', language: '', content: '' })
      return undefined
    }

    if (textState.loading) {
      setHighlightState({ loading: true, error: '', html: '', language: '', content: '' })
      return undefined
    }

    if (textState.error) {
      setHighlightState({ loading: false, error: textState.error, html: '', language: '', content: '' })
      return undefined
    }

    const raw = String(textState.content || '')
    if (!raw.trim()) {
      setHighlightState({ loading: false, error: '', html: '', language: '', content: '' })
      return undefined
    }

    let alive = true

    async function highlight() {
      setHighlightState({ loading: true, error: '', html: '', language: '', content: '' })
      try {
        const source = kind === 'xml' ? formatXml(raw) : raw
        const targetLang = kind === 'xml' ? 'markup' : (prismLanguageForExt(fileExt) || 'markup')
        const lang = await ensurePrismLanguage(targetLang)
        const grammar = Prism?.languages?.[lang] || Prism?.languages?.markup
        const html = grammar ? Prism.highlight(source, grammar, lang) : escapeHtml(source)
        if (!alive) return
        setHighlightState({ loading: false, error: '', html, language: lang, content: source })
      } catch (error) {
        if (!alive) return
        setHighlightState({
          loading: false,
          error: error?.message || 'Unable to highlight preview',
          html: escapeHtml(kind === 'xml' ? formatXml(raw) : raw),
          language: '',
          content: kind === 'xml' ? formatXml(raw) : raw,
        })
      }
    }

    highlight()

    return () => {
      alive = false
    }
  }, [open, file?.url, kind, fileExt, textState.loading, textState.error, textState.content])

  useEffect(() => {
    if (!open || !file?.url || kind !== 'spreadsheet') {
      workbookRef.current = null
      xlsxUtilsRef.current = null
      setSpreadsheetState({ loading: false, error: '', sheetNames: [], activeSheet: '', rows: [] })
      return undefined
    }

    let alive = true
    const controller = new AbortController()

    function sheetToRows(sheet, utils) {
      if (!sheet || !utils) return []
      const rawRows = utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' }) || []
      const limitedRows = rawRows.slice(0, 200).map((row) => Array.isArray(row) ? row.slice(0, 40) : [])
      return limitedRows
    }

    async function loadSpreadsheet() {
      setSpreadsheetState({ loading: true, error: '', sheetNames: [], activeSheet: '', rows: [] })
      try {
        const response = await fetch(file.url, { signal: controller.signal })
        if (!response.ok) throw new Error(`Unable to load spreadsheet (${response.status})`)

        const len = Number(response.headers.get('content-length') || '0')
        if (len && len > 25_000_000) {
          setSpreadsheetState({ loading: false, error: 'Spreadsheet is too large to preview. Please download it.', sheetNames: [], activeSheet: '', rows: [] })
          return
        }

        const buffer = await response.arrayBuffer()
        const xlsx = await import('xlsx')
        const workbook = xlsx.read(buffer, { type: 'array' })
        const utils = xlsx.utils

        workbookRef.current = workbook
        xlsxUtilsRef.current = utils

        const sheetNames = workbook?.SheetNames || []
        const activeSheet = sheetNames[0] || ''
        const sheet = activeSheet ? workbook?.Sheets?.[activeSheet] : null
        const rows = sheetToRows(sheet, utils)

        if (!alive) return
        setSpreadsheetState({ loading: false, error: '', sheetNames, activeSheet, rows })
      } catch (error) {
        if (!alive) return
        if (error?.name === 'AbortError') return
        setSpreadsheetState({ loading: false, error: error?.message || 'Unable to preview spreadsheet', sheetNames: [], activeSheet: '', rows: [] })
      }
    }

    loadSpreadsheet()

    return () => {
      alive = false
      controller.abort()
      workbookRef.current = null
      xlsxUtilsRef.current = null
    }
  }, [open, file?.url, kind])

  useEffect(() => {
    if (!open || !file?.url || kind !== 'rtf') {
      setRtfState({ loading: false, error: '', html: '', meta: null })
      return undefined
    }

    let alive = true
    const controller = new AbortController()

    async function loadRtf() {
      setRtfState({ loading: true, error: '', html: '', meta: null })
      try {
        const response = await fetch(file.url, { signal: controller.signal })
        if (!response.ok) throw new Error(`Unable to load RTF (${response.status})`)

        const len = Number(response.headers.get('content-length') || '0')
        if (len && len > 5_000_000) {
          setRtfState({ loading: false, error: 'RTF file is too large to preview. Please download it.', html: '', meta: null })
          return
        }

        const buffer = await response.arrayBuffer()
        const { EMFJS, RTFJS, WMFJS } = await import('rtf.js')

        // Disable noisy logging in production.
        try { RTFJS.loggingEnabled(false) } catch { /* noop */ }
        try { WMFJS.loggingEnabled(false) } catch { /* noop */ }
        try { EMFJS.loggingEnabled(false) } catch { /* noop */ }

        const doc = new RTFJS.Document(buffer)
        const meta = doc.metadata?.() || null
        const htmlElements = await doc.render()

        const wrapper = document.createElement('div')
        ;(htmlElements || []).forEach((el) => {
          try { wrapper.appendChild(el) } catch { /* noop */ }
        })

        if (!alive) return
        setRtfState({ loading: false, error: '', html: wrapper.innerHTML, meta })
      } catch (error) {
        if (!alive) return
        if (error?.name === 'AbortError') return
        setRtfState({ loading: false, error: error?.message || 'Unable to preview RTF', html: '', meta: null })
      }
    }

    loadRtf()

    return () => {
      alive = false
      controller.abort()
    }
  }, [open, file?.url, kind])

  useEffect(() => {
    if (!open || !file?.url || kind !== 'pdf') {
      setPdfState({ loading: false, error: '', blobUrl: '' })
      return undefined
    }

    let alive = true
    const controller = new AbortController()
    let blobUrl = ''

    async function loadPdf() {
      setPdfState({ loading: true, error: '', blobUrl: '' })
      try {
        const response = await fetch(file.url, { signal: controller.signal })
        if (!response.ok) throw new Error(`Unable to load PDF (${response.status})`)

        const len = Number(response.headers.get('content-length') || '0')
        if (len && len > 25_000_000) {
          setPdfState({ loading: false, error: 'PDF is too large to preview. Please download it.', blobUrl: '' })
          return
        }

        const blob = await response.blob()
        blobUrl = URL.createObjectURL(blob)
        if (!alive) {
          URL.revokeObjectURL(blobUrl)
          return
        }
        setPdfState({ loading: false, error: '', blobUrl })
      } catch (error) {
        if (!alive) return
        if (error?.name === 'AbortError') return
        setPdfState({ loading: false, error: error?.message || 'Unable to load PDF preview', blobUrl: '' })
      }
    }

    loadPdf()

    return () => {
      alive = false
      controller.abort()
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [open, file?.url, kind])

  if (!open || !file?.url) return null

  const downloadName = safeDownloadName(file.name)
  const title = String(file.name || 'Attachment')
  const subtitle = String(file.mimeType || file.mime_type || '').trim()
  const absoluteFileUrl = asAbsoluteUrl(file.url)
  const officeEmbed = (kind === 'office' || kind === 'presentation') ? officeViewerEmbedUrl(file.url) : ''
  const officeIsPrivate = (() => {
    if (kind !== 'office' && kind !== 'presentation') return false
    try {
      const host = new URL(absoluteFileUrl).hostname
      return isPrivateHostname(host)
    } catch {
      return true
    }
  })()

  function selectSpreadsheetSheet(nextSheet) {
    const wb = workbookRef.current
    const utils = xlsxUtilsRef.current
    if (!wb || !utils) return
    const sheet = wb?.Sheets?.[nextSheet]
    const rawRows = utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' }) || []
    const rows = rawRows.slice(0, 200).map((row) => Array.isArray(row) ? row.slice(0, 40) : [])
    setSpreadsheetState((prev) => ({ ...prev, activeSheet: nextSheet, rows }))
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.()
      }}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0f0d22] shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-white">{title}</div>
            {subtitle ? <div className="truncate text-[11px] text-slate-400">{subtitle}</div> : null}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={file.url}
              download={downloadName}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
              title="Download"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Download</span>
            </a>
            <button
              type="button"
              onClick={() => onClose?.()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="max-h-[75vh] overflow-auto p-4">
          {kind === 'image' ? (
            <div className="flex justify-center">
              <img
                src={file.url}
                alt={file.name || 'Preview'}
                className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain"
                loading="lazy"
              />
            </div>
          ) : null}

          {kind === 'video' ? (
            <div className="space-y-3">
              {!videoError ? (
                <video
                  src={file.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full max-h-[70vh] rounded-xl bg-black"
                  onError={() => setVideoError(true)}
                />
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                  This video format can't be previewed in your browser. Please download the file to play it.
                </div>
              )}
            </div>
          ) : null}

          {kind === 'pdf' ? (
            <div className="space-y-3">
              {pdfState.loading ? <div className="text-sm text-slate-300">Loading preview...</div> : null}
              {pdfState.error ? (
                <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {pdfState.error}
                </div>
              ) : null}
              {!pdfState.loading && !pdfState.error ? (
                <div className="h-[70vh] overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <iframe
                    src={pdfState.blobUrl || file.url}
                    title={file.name || 'PDF Preview'}
                    className="h-full w-full"
                  />
                </div>
              ) : null}
              <a
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-xs font-semibold text-blue-200 underline underline-offset-2 hover:text-blue-100"
              >
                Open in new tab
              </a>
            </div>
          ) : null}

          {(kind === 'office' || kind === 'presentation') ? (
            <div className="space-y-3">
              {officeIsPrivate ? (
                <div className="rounded-xl border border-yellow-400/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">
                  Microsoft Office Web Viewer needs a publicly reachable URL. Your file URL looks local/private ({absoluteFileUrl}).
                  Please use Cloudflare Tunnel / a public domain, or download the file.
                </div>
              ) : null}
              {!officeIsPrivate && officeEmbed ? (
                <div className="h-[70vh] overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <iframe
                    src={officeEmbed}
                    title={file.name || 'Office Preview'}
                    className="h-full w-full"
                  />
                </div>
              ) : null}
              <a
                href={officeIsPrivate ? absoluteFileUrl : (officeEmbed || absoluteFileUrl)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-xs font-semibold text-blue-200 underline underline-offset-2 hover:text-blue-100"
              >
                Open in new tab
              </a>
            </div>
          ) : null}

          {kind === 'spreadsheet' ? (
            <div className="space-y-3">
              {spreadsheetState.loading ? <div className="text-sm text-slate-300">Loading preview...</div> : null}
              {spreadsheetState.error ? (
                <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {spreadsheetState.error}
                </div>
              ) : null}

              {!spreadsheetState.loading && !spreadsheetState.error ? (
                <div className="space-y-3">
                  {spreadsheetState.sheetNames.length > 1 ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="text-[11px] font-semibold text-slate-300">Sheet</label>
                      <select
                        value={spreadsheetState.activeSheet}
                        onChange={(event) => selectSpreadsheetSheet(event.target.value)}
                        className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white outline-none"
                      >
                        {spreadsheetState.sheetNames.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                      <div className="text-[11px] text-slate-400">Showing up to 200 rows × 40 columns</div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400">Showing up to 200 rows × 40 columns</div>
                  )}

                  <div className="max-h-[70vh] overflow-auto rounded-xl border border-white/10 bg-black/40">
                    <table className="min-w-full border-collapse text-[12px] text-slate-100">
                      <tbody>
                        {(spreadsheetState.rows || []).map((row, rowIndex) => (
                          <tr key={rowIndex} className={rowIndex === 0 ? 'bg-white/5' : ''}>
                            {(row || []).map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="border border-white/10 px-2 py-1 align-top"
                              >
                                {String(cell ?? '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {kind === 'rtf' ? (
            <div className="space-y-3">
              {rtfState.loading ? <div className="text-sm text-slate-300">Loading preview...</div> : null}
              {rtfState.error ? (
                <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {rtfState.error}
                </div>
              ) : null}
              {!rtfState.loading && !rtfState.error ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-100">
                  <div className="prose prose-invert max-w-none text-[13px] leading-relaxed" dangerouslySetInnerHTML={{ __html: rtfState.html || '' }} />
                </div>
              ) : null}
            </div>
          ) : null}

          {kind === 'odt' ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
              ODT preview isn't available in this build yet (WebODF isn't bundled). Please download the file for now.
            </div>
          ) : null}

          {kind === 'html' ? (
            <div className="space-y-3">
              {textState.loading ? <div className="text-sm text-slate-300">Loading preview...</div> : null}
              {textState.error ? (
                <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {textState.error}
                </div>
              ) : null}
              {!textState.loading && !textState.error ? (
                <div className="h-[70vh] overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <iframe
                    title={file.name || 'HTML Preview'}
                    sandbox=""
                    referrerPolicy="no-referrer"
                    className="h-full w-full bg-white"
                    srcDoc={String(textState.content || '')}
                  />
                </div>
              ) : null}
              <a
                href={absoluteFileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-xs font-semibold text-blue-200 underline underline-offset-2 hover:text-blue-100"
              >
                Open file URL in new tab
              </a>
            </div>
          ) : null}

          {kind === 'xml' ? (
            <div className="space-y-3">
              {textState.loading ? <div className="text-sm text-slate-300">Loading preview...</div> : null}
              {textState.error ? (
                <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {textState.error}
                </div>
              ) : null}
              {highlightState.loading ? <div className="text-sm text-slate-300">Formatting and highlighting...</div> : null}
              {highlightState.error ? (
                <div className="rounded-xl border border-yellow-400/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">
                  {highlightState.error}
                </div>
              ) : null}
              {!textState.loading && !textState.error && !highlightState.loading ? (
                <pre className="language-markup overflow-auto rounded-xl border border-white/10 bg-black/40 p-4 text-[12px] leading-relaxed text-slate-100">
                  <code dangerouslySetInnerHTML={{ __html: highlightState.html || escapeHtml(formatXml(textState.content || '')) }} />
                </pre>
              ) : null}
            </div>
          ) : null}

          {kind === 'code' ? (
            <div className="space-y-3">
              {textState.loading ? <div className="text-sm text-slate-300">Loading preview...</div> : null}
              {textState.error ? (
                <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {textState.error}
                </div>
              ) : null}
              {highlightState.loading ? <div className="text-sm text-slate-300">Highlighting...</div> : null}
              {highlightState.error ? (
                <div className="rounded-xl border border-yellow-400/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">
                  {highlightState.error}
                </div>
              ) : null}
              {!textState.loading && !textState.error && !highlightState.loading ? (
                <pre className={`language-${highlightState.language || prismLanguageForExt(fileExt) || 'markup'} overflow-auto rounded-xl border border-white/10 bg-black/40 p-4 text-[12px] leading-relaxed text-slate-100`}>
                  <code dangerouslySetInnerHTML={{ __html: highlightState.html || escapeHtml(textState.content || '') }} />
                </pre>
              ) : null}
            </div>
          ) : null}

          {kind === 'markdown' ? (
            <div className="space-y-3">
              {textState.loading ? <div className="text-sm text-slate-300">Loading preview...</div> : null}
              {textState.error ? (
                <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {textState.error}
                </div>
              ) : null}
              {!textState.loading && !textState.error ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <MarkdownMessage text={textState.content} />
                </div>
              ) : null}
            </div>
          ) : null}

          {kind === 'text' ? (
            <div className="space-y-3">
              {textState.loading ? <div className="text-sm text-slate-300">Loading preview...</div> : null}
              {textState.error ? (
                <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {textState.error}
                </div>
              ) : null}
              {!textState.loading && !textState.error ? (
                <pre className="whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-black/40 p-4 text-[12px] leading-relaxed text-slate-100">
                  {textState.content}
                </pre>
              ) : null}
            </div>
          ) : null}

          {kind === 'file' ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                <File size={26} />
              </div>
              <div className="max-w-lg text-sm text-slate-200">
                Preview isn't available for this file type. You can still download it.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
