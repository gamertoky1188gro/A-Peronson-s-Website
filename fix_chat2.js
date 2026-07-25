const fs = require('fs');
const f = 'src/pages/ChatInterface.jsx';
const c = fs.readFileSync(f, 'utf8');
const searchA = function(offset) {
  const pat = '<a' + String.fromCharCode(10) +
    '\t\t\t\t\t\thref={attachmentUrl}' + String.fromCharCode(10) +
    '\t\t\t\t\t\tdownload={message?.attachment?.name || undefined}' + String.fromCharCode(10) +
    '\t\t\t\t\t\ttarget=' + String.fromCharCode(34) + '_blank' + String.fromCharCode(34) + String.fromCharCode(10) +
    '\t\t\t\t\t\trel=' + String.fromCharCode(34) + 'noreferrer' + String.fromCharCode(34) + String.fromCharCode(10) +
    '\t\t\t\t\t\tclass=' + String.fromCharCode(34) + 'inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 underline underline-offset-2 dark:text-blue-200' + String.fromCharCode(34) + String.fromCharCode(10) +
    '\t\t\t\t\t>' + String.fromCharCode(10) +
    '\t\t\t\t\t\t<Download size={12} />' + String.fromCharCode(10) +
    '\t\t\t\t\t\tDownload' + String.fromCharCode(10) +
    '\t\t\t\t\t</a>';
  const idx = c.indexOf(pat, offset);
  return idx;
};
const rep = '<button' + String.fromCharCode(10) +
  '\t\t\t\t\t\ttype=' + String.fromCharCode(34) + 'button' + String.fromCharCode(34) + String.fromCharCode(10) +
  '\t\t\t\t\t\tonClick={() => handleDownloadWithMetadata(message)}' + String.fromCharCode(10) +
  '\t\t\t\t\t\tclass=' + String.fromCharCode(34) + 'inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 underline underline-offset-2 dark:text-blue-200' + String.fromCharCode(34) + String.fromCharCode(10) +
  '\t\t\t\t\t>' + String.fromCharCode(10) +
  '\t\t\t\t\t\t<Download size={12} />' + String.fromCharCode(10) +
  '\t\t\t\t\t\tDownload' + String.fromCharCode(10) +
  '\t\t\t\t\t</button>';
const first = searchA(0);
let count = 0;
if (first >= 0) {
  const second = searchA(first + 1);
  const positions = second >= 0 ? [second, first] : [first];
  let out = c;
  for (const pos of positions) {
    out = out.substring(0, pos) + rep + out.substring(pos + (searchA(pos) > -1 ? c.substring(pos).indexOf('</a>') + 20 : 0));
  }
  fs.writeFileSync(f, out);
  count = positions.length;
}
console.log('replaced_count=' + count);
