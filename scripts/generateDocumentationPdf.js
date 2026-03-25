import fs from 'fs'
import path from 'path'

const root = process.cwd()
const inputPath = path.join(root, 'docs', 'GarTexHub-Documentation.md')
const outputPath = path.join(root, 'docs', 'GarTexHub-Documentation.pdf')

function escapePdfText(text = '') {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
}

function buildSimplePdf(lines = []) {
  const sanitized = lines.filter(Boolean).slice(0, 34)
  const contentLines = sanitized
    .map((line, idx) => `BT /F1 12 Tf 50 ${760 - (idx * 20)} Td (${escapePdfText(line)}) Tj ET`)
    .join('\n')
  const contentStream = `${contentLines}\n`

  const objects = []
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n')
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n')
  objects.push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n')
  objects.push('4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n')
  objects.push(`5 0 obj\n<< /Length ${Buffer.byteLength(contentStream, 'utf8')} >>\nstream\n${contentStream}endstream\nendobj\n`)

  let offset = 0
  let pdf = '%PDF-1.4\n'
  offset = Buffer.byteLength(pdf, 'utf8')
  const xrefOffsets = [0]

  for (const object of objects) {
    xrefOffsets.push(offset)
    pdf += object
    offset = Buffer.byteLength(pdf, 'utf8')
  }

  const xrefStart = offset
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  for (const objOffset of xrefOffsets.slice(1)) {
    pdf += `${String(objOffset).padStart(10, '0')} 00000 n \n`
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`
  return Buffer.from(pdf, 'utf8')
}

const md = fs.readFileSync(inputPath, 'utf8')
const lines = md
  .split(/\r?\n/)
  .map((line) => line.replace(/^#+\s*/, '').replace(/^[-*]\s*/, '').trim())
  .filter((line) => line)

const pdfBuffer = buildSimplePdf(lines)
fs.writeFileSync(outputPath, pdfBuffer)
console.log(`PDF generated at ${outputPath}`)
