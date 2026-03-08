import React, { useCallback, useMemo, useState, useEffect } from 'react'
import AccessDeniedState from '../components/AccessDeniedState'
import { apiRequest, getCurrentUser, getToken } from '../lib/auth'

const HELP_SECTIONS = [
  {
    id: 'quick-start',
    title: '1. Quick Start Guide',
    content: [
      'Step 1: Create an Account (Buyer, Factory, or Buying House).',
      'Step 2: Complete your basic profile setup (Organization Name, Category, Profile Image).',
      'Step 3: Explore the Main Feed or Search for relevant posts.',
      'Step 4: Start conversations or post Buyer Requests / Products.',
      'Step 5: Upgrade to Premium if advanced visibility and analytics are required.'
    ]
  },
  {
    id: 'account-types',
    title: '2. Account Types',
    subsections: [
      {
        name: 'Buyer Account',
        points: ['Post detailed Buyer Requests.', 'Search and filter factories.', 'Send direct messages.', 'Schedule calls.']
      },
      {
        name: 'Factory Account',
        points: ['Upload product posts and videos.', 'Respond to Buyer Requests.', 'Accept connection requests from Buying Houses.', 'Manage sub-accounts (Agents).']
      },
      {
        name: 'Buying House Account',
        points: ['Manage multiple agents.', 'Connect with multiple factories.', 'Assign Buyer Requests to specific agents.', 'Monitor deals and analytics (Premium).']
      }
    ]
  },
  {
    id: 'verification',
    title: '3. Verification Process',
    description: 'Verification is document-based and requires backend approval.',
    roles: [
      {
        role: 'Factories must submit',
        docs: ['Company Registration', 'Trade License', 'TIN', 'Authorized Person NID', 'Company Bank Proof', 'ERC (Export Registration Certificate)']
      },
      {
        role: 'Buying Houses must submit',
        docs: ['Company Registration', 'Trade License', 'TIN', 'Authorized Person NID', 'Company Bank Proof']
      },
      {
        role: 'International Buyers (EU / USA) must submit',
        docs: ['Business Registration', 'VAT (EU) or EIN (USA)', 'EORI (EU) or IOR (USA)', 'Bank Proof']
      }
    ],
    footer: 'Verification status is subscription-based and must be renewed monthly. The more verified documentation a company provides, the stronger its credibility.'
  },
  {
    id: 'messaging',
    title: '4. Messaging & Conversation Rules',
    sections: [
      { title: 'Verified Users', text: 'Messages go directly to inbox.' },
      { title: 'Unverified Users', text: 'Messages appear in "Message Requests."' },
      { title: 'Buying House Conversation Lock', points: [
        'When an Agent starts a conversation, it is assigned to that Agent.',
        'Other Agents cannot message unless permission is granted.',
        'This prevents internal conflict.'
      ]}
    ]
  },
  {
    id: 'subscriptions',
    title: '5. Subscription Plans',
    description: 'Two Plans Available: Free and Premium.',
    points: [
      'Increased profile visibility',
      'Advanced analytics (for eligible accounts)',
      'Extended management capabilities'
    ],
    footer: 'Feature visibility varies depending on account type.'
  },
  {
    id: 'calls',
    title: '6. Video & Audio Calls',
    points: [
      'Calls can be initiated directly from chat.',
      'Optional scheduling feature available.',
      'All calls may be recorded for security and compliance.',
      'Users are notified before recording begins.'
    ]
  },
  {
    id: 'contracts',
    title: '7. Contracts & Legal Vault',
    points: [
      'Digital contracts can be signed through the platform.',
      'PDF copies are stored securely in the Legal Vault.',
      'Both parties can access their contract history.'
    ],
    footer: 'GarTexHub does not process direct financial transactions.'
  },
  {
    id: 'security',
    title: '8. Security & Data Protection',
    points: [
      'Uploaded documents are securely stored.',
      'Verification requires backend approval.',
      'Expired licenses may remove verified status.',
      'Financial details are protected through encrypted systems.'
    ]
  },
  {
    id: 'assistant',
    title: '9. Floating AI Assistant',
    description: 'The Floating Assistant helps users with:',
    points: ['Understand settings', 'Navigate dashboards', 'Access help articles', 'Connect to support'],
    footer: 'It does not handle negotiations.'
  }
]

export default function HelpCenter() {
  const [q, setQ] = useState('')
  const [entries, setEntries] = useState([])
  const [feedback, setFeedback] = useState('')
  const [form, setForm] = useState({ question: '', answer: '', keywords: '' })
  const [editingId, setEditingId] = useState('')
  const currentUser = useMemo(() => getCurrentUser(), [])
  const isOwnerAdmin = currentUser?.role === 'owner' || currentUser?.role === 'admin'

  const staticFaqs = [
    { q: 'Can I buy verification without documents?', a: 'No. Verification requires mandatory document submission and approval.' },
    { q: 'Can I create multiple sub-accounts?', a: 'Yes. Buying Houses and Factories can create limited sub-accounts under Free plans.' },
    { q: 'Does GarTexHub handle payments?', a: 'No. The platform facilitates communication and contracts only.' },
    { q: 'Can I increase my visibility?', a: 'Premium plans may provide improved reach.' },
  ]

  const loadFaqs = useCallback(async () => {
    try {
      const token = getToken()
      if (!token) return
      const data = await apiRequest('/assistant/knowledge', { token })
      setEntries((data.entries || []).filter((entry) => (entry.type || 'faq') === 'faq'))
    } catch (err) {
      setFeedback(err.status === 403 ? 'Access denied' : err.message)
    }
  }, [])

  useEffect(() => {
    if (!isOwnerAdmin) return

    const timeoutId = setTimeout(() => {
      loadFaqs()
    }, 0)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isOwnerAdmin, loadFaqs])

  function selectForEdit(entry) {
    setEditingId(entry.id)
    setForm({
      question: entry.question || '',
      answer: entry.answer || '',
      keywords: Array.isArray(entry.keywords) ? entry.keywords.join(', ') : '',
    })
  }

  function resetForm() {
    setEditingId('')
    setForm({ question: '', answer: '', keywords: '' })
  }

  async function saveFaq(e) {
    e.preventDefault()
    const token = getToken()
    if (!token) return
    const payload = {
      type: 'faq',
      question: form.question,
      answer: form.answer,
      keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
    }
    try {
      if (editingId) {
        await apiRequest(`/assistant/knowledge/${editingId}`, { method: 'PUT', token, body: payload })
      } else {
        await apiRequest('/assistant/knowledge', { method: 'POST', token, body: payload })
      }
      resetForm()
      loadFaqs()
      setFeedback('FAQ updated')
    } catch (err) {
      setFeedback(err.message)
    }
  }

  async function removeFaq(entryId) {
    const token = getToken()
    if (!token) return
    try {
      await apiRequest(`/assistant/knowledge/${entryId}`, { method: 'DELETE', token })
      loadFaqs()
    } catch (err) {
      setFeedback(err.message)
    }
  }

  const allFaqs = [...entries.map(e => ({ q: e.question, a: e.answer, id: e.id, managed: true })), ...staticFaqs]
  const filteredFaqs = allFaqs.filter(f => f.q.toLowerCase().includes(q.toLowerCase()) || f.a.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-[#F4F7F9] p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0A192F]">HELP CENTER – GarTexHub</h1>
          <p className="text-[#5A5A5A] mt-2">Professional operational manual and platform guidance.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {HELP_SECTIONS.map(section => (
              <section 
                key={section.id} 
                id={section.id} 
                className="bg-white neo-panel cyberpunk-card p-6 border rounded-lg shadow-sm scroll-mt-6"
              >
                <h2 className="text-xl font-bold text-[#0A192F] mb-4 pb-2 border-b">{section.title}</h2>
                
                {section.description && <p className="mb-4 text-[#333]">{section.description}</p>}
                
                {section.content && (
                  <ul className="space-y-2">
                    {section.content.map((item, i) => <li key={i} className="text-[#5A5A5A] flex gap-2"><span>•</span> {item}</li>)}
                  </ul>
                )}

                {section.subsections && (
                  <div className="space-y-4">
                    {section.subsections.map((sub, i) => (
                      <div key={i}>
                        <h3 className="font-bold text-[#0A192F] mb-1">{sub.name}:</h3>
                        <ul className="list-disc ml-5 text-[#5A5A5A]">
                          {sub.points.map((p, j) => <li key={j}>{p}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {section.roles && (
                  <div className="space-y-4">
                    {section.roles.map((r, i) => (
                      <div key={i}>
                        <h3 className="font-bold text-[#0A192F] mb-1">{r.role}:</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 ml-5 list-disc text-[#5A5A5A]">
                          {r.docs.map((d, j) => <li key={j}>{d}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {section.sections && (
                  <div className="space-y-4">
                    {section.sections.map((s, i) => (
                      <div key={i}>
                        <h3 className="font-bold text-[#0A192F] mb-1">{s.title}:</h3>
                        {s.text && <p className="text-[#5A5A5A] ml-2">{s.text}</p>}
                        {s.points && (
                          <ul className="list-disc ml-5 text-[#5A5A5A]">
                            {s.points.map((p, j) => <li key={j}>{p}</li>)}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {section.points && !section.subsections && !section.sections && (
                  <ul className="list-disc ml-5 text-[#5A5A5A] space-y-1">
                    {section.points.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                )}

                {section.footer && <p className="mt-4 text-sm italic text-[#5A5A5A] border-t pt-2">{section.footer}</p>}
              </section>
            ))}

            {/* FAQ Section */}
            <section id="faq" className="bg-white neo-panel cyberpunk-card p-6 border rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-[#0A192F] mb-4 pb-2 border-b">10. Frequently Asked Questions (FAQ)</h2>
              <div className="mb-4">
                <input 
                  placeholder="Search FAQs..." 
                  value={q} 
                  onChange={(e) => setQ(e.target.value)} 
                  className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A66C2]" 
                />
              </div>
              <div className="space-y-4">
                {filteredFaqs.map((f, i) => (
                  <details key={i} className="group border rounded-md p-3 bg-[#F8F9FA]">
                    <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-[#0A192F]">
                      Q: {f.q}
                      <span className="group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="mt-3 text-[#5A5A5A] pl-4 border-l-2 border-[#0A66C2]">A: {f.a}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* Admin FAQ Management */}
            {isOwnerAdmin && (
              <section className="bg-[#E9F0F7] p-6 border-2 border-[#0A66C2] rounded-lg">
                <h2 className="text-lg font-bold mb-4">Admin: Manage Knowledge Base FAQ</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <form onSubmit={saveFaq} className="space-y-3">
                    <input 
                      placeholder="Question" 
                      value={form.question} 
                      onChange={(e) => setForm({...form, question: e.target.value})} 
                      className="w-full border p-2 rounded" 
                      required 
                    />
                    <textarea 
                      placeholder="Answer" 
                      value={form.answer} 
                      onChange={(e) => setForm({...form, answer: e.target.value})} 
                      className="w-full border p-2 rounded min-h-24" 
                      required 
                    />
                    <input 
                      placeholder="Keywords (comma separated)" 
                      value={form.keywords} 
                      onChange={(e) => setForm({...form, keywords: e.target.value})} 
                      className="w-full border p-2 rounded" 
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="bg-[#0A66C2] text-white px-4 py-2 rounded">{editingId ? 'Update' : 'Add'} FAQ</button>
                      {editingId && <button type="button" onClick={resetForm} className="border px-4 py-2 rounded">Cancel</button>}
                    </div>
                  </form>
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                    {entries.map(e => (
                      <div key={e.id} className="text-xs border p-2 bg-white rounded flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-bold">{e.question}</p>
                          <p className="text-[#5A5A5A] truncate">{e.answer}</p>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button onClick={() => selectForEdit(e)} className="text-blue-600">Edit</button>
                          <button onClick={() => removeFaq(e.id)} className="text-red-600">Del</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {feedback && <p className="mt-2 text-xs text-blue-800">{feedback}</p>}
              </section>
            )}

            {/* Contact Section */}
            <section className="bg-[#0A192F] text-white p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">11. Contact Support</h2>
              <p className="mb-6 opacity-90">If your issue is not resolved, you may use the Floating Assistant, submit a support ticket, or contact the GarTexHub Support Team.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-[#0A66C2] hover:bg-[#004182] px-6 py-2 rounded-full font-bold transition-colors">Open Support Ticket</button>
                <button className="border border-white hover:bg-white hover:text-[#0A192F] px-6 py-2 rounded-full font-bold transition-colors">Live Chat</button>
              </div>
              <p className="mt-4 text-xs opacity-70">Response time may vary depending on subscription level.</p>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white p-5 border rounded-lg shadow-sm">
                <h3 className="font-bold text-[#0A192F] mb-3">Quick Navigation</h3>
                <nav className="space-y-2 text-sm text-[#0A66C2]">
                  {HELP_SECTIONS.map(s => (
                    <a key={s.id} href={`#${s.id}`} className="block hover:underline">{s.title}</a>
                  ))}
                  <a href="#faq" className="block hover:underline">10. FAQ</a>
                </nav>
              </div>

              <div className="bg-[#F0F7FF] p-5 border border-[#BEE3F8] rounded-lg">
                <h3 className="font-bold text-[#0A192F] mb-2 text-sm">Floating Assistant</h3>
                <p className="text-xs text-[#5A5A5A] leading-relaxed">Available on all pages to help with setup, navigation, and support. It does not handle negotiations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
