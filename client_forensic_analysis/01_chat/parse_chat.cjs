const fs = require('fs');
const path = require('path');

const CHAT_FILE = 'D:/A-Peronson-s-Website/whatsapp-chats/Cyber Code Master Mira Dev/WhatsApp Chat with Cyber Code Master Mira Dev.txt';
const OUTPUT_DIR = 'D:/A-Peronson-s-Website/client_forensic_analysis/01_chat';

const lines = fs.readFileSync(CHAT_FILE, 'utf-8').split('\n');

// The line format is: "M/D/YY, H:MM AM/PM - SenderName: message text"
// OR for system messages: "M/D/YY, H:MM AM/PM - System message text"
// The key insight: sender names do NOT contain ": " followed by message text
// We split on " - " first, then split sender from text on ": "

const TS_PREFIX_RE = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+(\d{1,2}:\d{2}\s+[AP]M)\s+-\s+/;

const senders = new Map();
const messages = [];
let current = null;
let msgIdx = 0;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  const tsMatch = line.match(TS_PREFIX_RE);

  if (tsMatch) {
    if (current) messages.push(current);
    msgIdx++;

    const timestamp = tsMatch[1] + ', ' + tsMatch[2];
    const rest = line.substring(tsMatch[0].length);

    // Check for system messages (no colon separator with known senders)
    let sender, text, systemMessage = false;

    // Known senders
    const knownSenders = ['Shakibul hasan Shaun', 'Cyber Code Master Mira Dev'];
    let foundSender = false;
    for (const ks of knownSenders) {
      if (rest.startsWith(ks + ': ')) {
        sender = ks;
        text = rest.substring(ks.length + 3);
        foundSender = true;
        break;
      } else if (rest === ks) {
        sender = ks;
        text = '';
        foundSender = true;
        break;
      }
    }

    if (!foundSender) {
      // System message
      systemMessage = true;
      sender = 'SYSTEM';
      text = rest;
    }

    // Process text for attachments and edited markers
    let attachments = [];
    let edited = false;

    if (text.includes('<This message was edited>')) {
      edited = true;
      text = text.replace('<This message was edited>', '').trim();
    }

    const attMatch = text.match(/^(.+?)\s*\(file attached\)\s*$/);
    if (attMatch) {
      attachments.push(attMatch[1].trim());
      text = '';
    }

    if (!systemMessage) {
      senders.set(sender, (senders.get(sender) || 0) + 1);
    }

    const trimmedText = text.trim();
    current = { idx: msgIdx, timestamp, sender, systemMessage, text: trimmedText, attachments, edited, hasBangla: /[\u0980-\u09FF]/.test(trimmedText) };
  } else if (current) {
    // Continuation line
    let edited = false;
    if (line.includes('<This message was edited>')) {
      edited = true;
      line = line.replace('<This message was edited>', '').trim();
    }
    if (edited) current.edited = true;

    const attMatch = line.match(/^(.+?)\s*\(file attached\)\s*$/);
    if (attMatch) {
      current.attachments.push(attMatch[1].trim());
    } else if (line.trim()) {
      current.text = current.text ? current.text + '\n' + line : line;
    }
  }
}
if (current) messages.push(current);

console.log('Total messages: ' + messages.length);
console.log('Senders:', JSON.stringify(Object.fromEntries(senders)));

// Build sender map
const senderMap = {};
let si = 1;
for (const [name, count] of senders) {
  senderMap[name] = {
    id: 'SENDER-' + String(si).padStart(3, '0'),
    name: name,
    displayName: name,
    role: name === 'Shakibul hasan Shaun' ? 'client' :
          name === 'Cyber Code Master Mira Dev' ? 'developer' : 'system',
    messageCount: count
  };
  si++;
}

fs.writeFileSync(path.join(OUTPUT_DIR, 'sender_map.json'), JSON.stringify(senderMap, null, 2));

// Build message index JSONL
const jsonlLines = messages.map(m => JSON.stringify({
  msgId: 'MSG-' + String(m.idx).padStart(6, '0'),
  timestamp: m.timestamp,
  senderId: senderMap[m.sender] ? senderMap[m.sender].id : 'SYSTEM',
  senderName: m.sender,
  text: m.text,
  attachments: m.attachments,
  edited: m.edited,
  systemMessage: m.systemMessage,
  hasBangla: /[\u0980-\u09FF]/.test(m.text)
}));
fs.writeFileSync(path.join(OUTPUT_DIR, 'message_index.jsonl'), jsonlLines.join('\n'));

// Parse timestamps for chronology
const parseTs = (ts) => {
  const parts = ts.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4}),\s+(\d{1,2}):(\d{2})\s+([AP]M)/);
  if (!parts) return null;
  const [, mo, d, y, hr, min, ampm] = parts;
  const year = y.length === 2 ? '20' + y : y;
  let hour = parseInt(hr);
  if (ampm === 'PM' && hour !== 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  return new Date(parseInt(year), parseInt(mo) - 1, parseInt(d), hour, parseInt(min));
};

const dates = messages.map(m => ({
  msgId: 'MSG-' + String(m.idx).padStart(6, '0'),
  ts: parseTs(m.timestamp)
})).filter(d => d.ts);

const firstMsg = dates.length ? dates[0].ts : null;
const lastMsg = dates.length ? dates[dates.length - 1].ts : null;

const dayCounts = {};
for (const d of dates) {
  const day = d.ts.toISOString().slice(0, 10);
  dayCounts[day] = (dayCounts[day] || 0) + 1;
}

const hourCounts = {};
for (const d of dates) {
  const h = d.ts.getHours();
  hourCounts[h] = (hourCounts[h] || 0) + 1;
}

const dayOfWeekCounts = {};
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
for (const d of dates) {
  const dn = dayNames[d.ts.getDay()];
  dayOfWeekCounts[dn] = (dayOfWeekCounts[dn] || 0) + 1;
}

const chronology = {
  chatName: 'Cyber Code Master Mira Dev',
  sourceFile: 'WhatsApp Chat with Cyber Code Master Mira Dev.txt',
  totalMessages: messages.length,
  dateRange: {
    first: firstMsg ? firstMsg.toISOString() : null,
    last: lastMsg ? lastMsg.toISOString() : null,
    spanDays: firstMsg && lastMsg ? Math.round((lastMsg - firstMsg) / 86400000) : 0
  },
  senderStats: {},
  messagesByDay: dayCounts,
  messagesByHour: hourCounts,
  messagesByDayOfWeek: dayOfWeekCounts,
  systemEvents: messages.filter(m => m.systemMessage).length,
  editedMessages: messages.filter(m => m.edited).length,
  attachmentMessages: messages.filter(m => m.attachments.length > 0).length,
  totalAttachments: messages.reduce((s, m) => s + m.attachments.length, 0),
  banglaMessages: messages.filter(m => m.hasBangla).length,
  emptyMessages: messages.filter(m => !m.text && m.attachments.length === 0 && !m.systemMessage).length
};

for (const [name, count] of senders) {
  chronology.senderStats[name] = {
    id: senderMap[name].id,
    role: senderMap[name].role,
    messageCount: count,
    percentage: Math.round(count / messages.length * 1000) / 10
  };
}

fs.writeFileSync(path.join(OUTPUT_DIR, 'chronology.json'), JSON.stringify(chronology, null, 2));

// Chat inventory
const allAttachments = [];
for (const m of messages) {
  for (const a of m.attachments) {
    allAttachments.push({
      filename: a,
      sender: m.sender,
      senderId: senderMap[m.sender] ? senderMap[m.sender].id : 'SYSTEM',
      timestamp: m.timestamp,
      msgId: 'MSG-' + String(m.idx).padStart(6, '0')
    });
  }
}

const fileTypes = {};
for (const a of allAttachments) {
  const ext = a.filename.split('.').pop().toLowerCase();
  fileTypes[ext] = (fileTypes[ext] || 0) + 1;
}

let codeMessages = 0;
let requirementMessages = 0;
let complaintMessages = 0;
let documentMessages = 0;
for (const m of messages) {
  if (!m.text) continue;
  const t = m.text.toLowerCase();
  if (t.includes('import ') || t.includes('export ') || t.includes('function ') ||
      t.includes('const ') || t.includes('server.') || t.includes('src/') ||
      t.includes('prisma') || t.includes('.jsx') || t.includes('.js ') ||
      t.includes('app.use') || t.includes('router.')) {
    codeMessages++;
  }
  if (t.includes('requirement') || t.includes('feature') || t.includes('implement') ||
      t.includes('complete') || t.includes('baki')) {
    requirementMessages++;
  }
  if (t.includes('problem') || t.includes('bug') || t.includes('issue') ||
      t.includes('error') || t.includes('fix') || t.includes('samossa')) {
    complaintMessages++;
  }
  if (t.includes('document') || t.includes('verification') ||
      t.includes('.pdf') || t.includes('.jpg')) {
    documentMessages++;
  }
}

const inventory = {
  totalAttachments: allAttachments.length,
  fileTypes: fileTypes,
  attachmentsBySender: {},
  attachments: allAttachments,
  contentBreakdown: {
    codeRelatedMessages: codeMessages,
    requirementMessages: requirementMessages,
    complaintBugMessages: complaintMessages,
    documentRelatedMessages: documentMessages,
    banglaMessages: chronology.banglaMessages,
    editedMessages: chronology.editedMessages,
    systemEvents: chronology.systemEvents,
    emptyMessages: chronology.emptyMessages
  }
};

for (const a of allAttachments) {
  if (!inventory.attachmentsBySender[a.sender]) inventory.attachmentsBySender[a.sender] = [];
  inventory.attachmentsBySender[a.sender].push(a.filename);
}

fs.writeFileSync(path.join(OUTPUT_DIR, 'chat_inventory.json'), JSON.stringify(inventory, null, 2));

console.log('\nChronology:');
console.log(JSON.stringify(chronology, null, 2));
console.log('\nAttachment types:', JSON.stringify(fileTypes, null, 2));
console.log('\nAll 4 files written to', OUTPUT_DIR);
