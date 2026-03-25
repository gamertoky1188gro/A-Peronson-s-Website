/*
  Route: /support
  Access: Protected (login required)

  Purpose:
    - Collect bug reports, feature requests, account issues, and general feedback.
    - Store submissions in the reports queue for admin review.
*/
import React, { useMemo, useState } from 'react'
import { apiRequest, API_BASE, getToken } from '../lib/auth'

const CATEGORY_OPTIONS = [
  'Bug Report',
  'Feature Request',
  'Account Problem',
  'Payment / Verification Issue',
  'Report a User',
  'Content Report',
  'General Feedback',
  'Other',
]

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Urgent']

export default function SupportReports() {
  const token = useMemo(() => getToken(), [])
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('Bug Report')
  const [description, setDescription] = useState('')
  const [pageUrl, setPageUrl] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [contactEmail, setContactEmail] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [reportId, setReportId] = useState('')

  async function submitReport(e) {
    e.preventDefault()
    if (!token) {
      setFeedback('Please login again to submit a report.')
      return
    }
    setLoading(true)
    setFeedback('')
    setReportId('')
    try {
      const report = await apiRequest('/support/reports', {
        method: 'POST',
        token,
        body: {
          subject,
          category,
          description,
          page_url: pageUrl,
          priority,
          contact_email: contactEmail,
        },
      })

      if (attachment && report?.id) {
        const formData = new FormData()
        formData.append('file', attachment)
        formData.append('entity_type', 'support_report')
        formData.append('entity_id', report.id)
        formData.append('type', 'screenshot')

        const res = await fetch(`${API_BASE}/documents`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        })
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || 'Attachment upload failed')
        }
      }

      setReportId(report?.id || '')
      setFeedback('Report submitted successfully.')
      setSubject('')
      setDescription('')
      setPageUrl('')
      setPriority('Medium')
      setContactEmail('')
      setAttachment(null)
    } catch (err) {
      setFeedback(err.message || 'Unable to submit report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
          <h1 className="text-2xl font-bold">Support & Reports</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Report bugs, request features, or share any issue. We collect everything in one place so it can be tracked and resolved.
          </p>
        </div>

        <form onSubmit={submitReport} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800 space-y-4">
          <div>
            <label className="block text-sm font-medium">Subject</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Short summary of the issue"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Priority</label>
              <select className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={priority} onChange={(e) => setPriority(e.target.value)}>
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="mt-1 w-full min-h-[140px] rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write the full details here"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Page URL (optional)</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={pageUrl}
                onChange={(e) => setPageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Contact Email (optional)</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Screenshot / File (optional)</label>
            <input
              type="file"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              onChange={(e) => setAttachment(e.target.files?.[0] || null)}
            />
          </div>

          {feedback ? (
            <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200/60">
              {feedback} {reportId ? `Reference ID: ${reportId}` : ''}
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[var(--gt-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--gt-blue-hover)] disabled:opacity-70"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
