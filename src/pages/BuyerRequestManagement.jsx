import React, { useCallback, useEffect, useState } from 'react'
import { apiRequest, getToken } from '../lib/auth'

const EMPTY_FORM = {
  category: '',
  subcategory: '',
  quantity: '',
  price: '',
  deadline: '',
  fabric: '',
  gsm: '',
  cert: '',
  shippingTerms: '',
  notes: '',
}

function formToRequirementPayload(form) {
  const certifications = String(form.cert || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  const descriptionParts = [
    form.subcategory ? `Subcategory: ${form.subcategory}` : '',
    form.gsm ? `GSM: ${form.gsm}` : '',
    form.notes || '',
  ].filter(Boolean)

  return {
    category: form.category,
    quantity: form.quantity,
    price_range: form.price,
    material: form.fabric,
    timeline_days: form.deadline,
    certifications_required: certifications,
    shipping_terms: form.shippingTerms,
    custom_description: descriptionParts.join('\n'),
  }
}

function requirementToForm(requirement) {
  const extra = String(requirement.custom_description || '')
  const subcategoryMatch = extra.match(/Subcategory:\s*(.*)/i)
  const gsmMatch = extra.match(/GSM:\s*(.*)/i)

  return {
    category: requirement.category || '',
    subcategory: subcategoryMatch?.[1]?.trim() || '',
    quantity: requirement.quantity || '',
    price: requirement.price_range || '',
    deadline: requirement.timeline_days || '',
    fabric: requirement.material || '',
    gsm: gsmMatch?.[1]?.trim() || '',
    cert: Array.isArray(requirement.certifications_required) ? requirement.certifications_required.join(', ') : '',
    shippingTerms: requirement.shipping_terms || '',
    notes: extra
      .split('\n')
      .filter((line) => !/^Subcategory:/i.test(line) && !/^GSM:/i.test(line))
      .join('\n'),
  }
}

export default function BuyerRequestManagement(){
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(EMPTY_FORM)
  const [requests, setRequests] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState('')
  const [editForm, setEditForm] = useState(EMPTY_FORM)
  const [actionLoadingId, setActionLoadingId] = useState('')
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const loadRequests = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setFeedback({ type: 'error', message: 'You are not authenticated. Please sign in again.' })
      return
    }

    setLoadingRequests(true)
    try {
      const data = await apiRequest('/requirements', { token })
      setRequests(Array.isArray(data) ? data : [])
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load requests.' })
    } finally {
      setLoadingRequests(false)
    }
  }, [])

  useEffect(() => {
    loadRequests()
  }, [loadRequests])

  async function createRequest() {
    const token = getToken()
    if (!token) {
      setFeedback({ type: 'error', message: 'You are not authenticated. Please sign in again.' })
      return
    }

    setSaving(true)
    setFeedback({ type: '', message: '' })
    try {
      await apiRequest('/requirements', {
        method: 'POST',
        token,
        body: formToRequirementPayload(form),
      })
      setForm(EMPTY_FORM)
      setStep(1)
      setFeedback({ type: 'success', message: 'Request posted successfully.' })
      await loadRequests()
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to post request.' })
    } finally {
      setSaving(false)
    }
  }

  function startEditing(request) {
    setEditingId(request.id)
    setEditForm(requirementToForm(request))
    setFeedback({ type: '', message: '' })
  }

  async function saveEdit() {
    if (!editingId) return
    const token = getToken()
    if (!token) {
      setFeedback({ type: 'error', message: 'You are not authenticated. Please sign in again.' })
      return
    }

    setActionLoadingId(editingId)
    setFeedback({ type: '', message: '' })
    try {
      await apiRequest(`/requirements/${editingId}`, {
        method: 'PATCH',
        token,
        body: formToRequirementPayload(editForm),
      })
      setEditingId('')
      setEditForm(EMPTY_FORM)
      setFeedback({ type: 'success', message: 'Request updated successfully.' })
      await loadRequests()
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update request.' })
    } finally {
      setActionLoadingId('')
    }
  }

  async function deleteRequest(requestId) {
    const token = getToken()
    if (!token) {
      setFeedback({ type: 'error', message: 'You are not authenticated. Please sign in again.' })
      return
    }

    setActionLoadingId(requestId)
    setFeedback({ type: '', message: '' })
    try {
      await apiRequest(`/requirements/${requestId}`, { method: 'DELETE', token })
      setFeedback({ type: 'success', message: 'Request deleted successfully.' })
      if (editingId === requestId) {
        setEditingId('')
        setEditForm(EMPTY_FORM)
      }
      await loadRequests()
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete request.' })
    } finally {
      setActionLoadingId('')
    }
  }

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card text-[#1A1A1A]">
      
      {/* Shared global NavBar */}


      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Post New Buyer Request</h1>
          <div className="text-sm text-[#5A5A5A]">Step {step} of 3</div>
        </div>

        <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow p-6">
          {step === 1 && (
            <div className="space-y-3">
              <label className="block text-sm">Category</label>
              <input className="w-full border px-3 py-2 rounded" value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})} />
              <label className="block text-sm">Subcategory</label>
              <input className="w-full border px-3 py-2 rounded" value={form.subcategory} onChange={(e)=>setForm({...form, subcategory:e.target.value})} />
              <label className="block text-sm">Quantity</label>
              <input className="w-full border px-3 py-2 rounded" value={form.quantity} onChange={(e)=>setForm({...form, quantity:e.target.value})} />
              <label className="block text-sm">Target Price</label>
              <input className="w-full border px-3 py-2 rounded" value={form.price} onChange={(e)=>setForm({...form, price:e.target.value})} />
              <button onClick={()=>setStep(2)} className="px-4 py-2 bg-[#0A66C2] text-white rounded">Continue</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <label className="block text-sm">Fabric Type</label>
              <input className="w-full border px-3 py-2 rounded" value={form.fabric} onChange={(e)=>setForm({...form, fabric:e.target.value})} />
              <label className="block text-sm">GSM</label>
              <input className="w-full border px-3 py-2 rounded" value={form.gsm} onChange={(e)=>setForm({...form, gsm:e.target.value})} />
              <label className="block text-sm">Certification Required</label>
              <input className="w-full border px-3 py-2 rounded" value={form.cert} onChange={(e)=>setForm({...form, cert:e.target.value})} />
              <label className="block text-sm">Shipping Terms</label>
              <input className="w-full border px-3 py-2 rounded" value={form.shippingTerms} onChange={(e)=>setForm({...form, shippingTerms:e.target.value})} />
              <button onClick={()=>setStep(3)} className="px-4 py-2 bg-[#0A66C2] text-white rounded">Continue</button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <label className="block text-sm">Additional Notes</label>
              <textarea className="w-full border px-3 py-2 rounded" value={form.notes} onChange={(e)=>setForm({...form, notes:e.target.value})} />
              <div className="flex gap-2">
                <button onClick={createRequest} disabled={saving} className="px-4 py-2 bg-[#0A66C2] text-white rounded disabled:opacity-60">{saving ? 'Posting...' : 'Post Request'}</button>
                <button className="px-4 py-2 border rounded" onClick={()=>setStep(1)}>Back</button>
              </div>
            </div>
          )}

          {feedback.message && (
            <p className={`mt-4 text-sm ${feedback.type === 'error' ? 'text-red-600' : 'text-green-700'}`}>
              {feedback.message}
            </p>
          )}
        </div>

        <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">My Requests</h2>
            <button className="px-3 py-2 border rounded" onClick={loadRequests} disabled={loadingRequests}>{loadingRequests ? 'Refreshing...' : 'Refresh'}</button>
          </div>

          {loadingRequests ? (
            <p className="text-sm text-[#5A5A5A]">Loading your requests...</p>
          ) : !requests.length ? (
            <p className="text-sm text-[#5A5A5A]">No requests found.</p>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="border rounded p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{request.category || 'Untitled request'}</p>
                      <p className="text-sm text-[#5A5A5A]">Quantity: {request.quantity || '-'}</p>
                      <p className="text-sm text-[#5A5A5A]">Price Range: {request.price_range || '-'}</p>
                      <p className="text-sm text-[#5A5A5A]">Material: {request.material || '-'}</p>
                      <p className="text-sm text-[#5A5A5A]">Status: <span className="font-medium">{request.status || 'open'}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditing(request)} className="px-3 py-1 border rounded text-sm" disabled={actionLoadingId === request.id}>Edit</button>
                      <button onClick={() => deleteRequest(request.id)} className="px-3 py-1 border rounded text-sm text-red-600" disabled={actionLoadingId === request.id}>{actionLoadingId === request.id ? 'Deleting...' : 'Delete'}</button>
                    </div>
                  </div>

                  {editingId === request.id && (
                    <div className="mt-3 border-t pt-3 space-y-2">
                      <input className="w-full border px-3 py-2 rounded" placeholder="Category" value={editForm.category} onChange={(e)=>setEditForm({...editForm, category:e.target.value})} />
                      <input className="w-full border px-3 py-2 rounded" placeholder="Subcategory" value={editForm.subcategory} onChange={(e)=>setEditForm({...editForm, subcategory:e.target.value})} />
                      <input className="w-full border px-3 py-2 rounded" placeholder="Quantity" value={editForm.quantity} onChange={(e)=>setEditForm({...editForm, quantity:e.target.value})} />
                      <input className="w-full border px-3 py-2 rounded" placeholder="Target Price" value={editForm.price} onChange={(e)=>setEditForm({...editForm, price:e.target.value})} />
                      <input className="w-full border px-3 py-2 rounded" placeholder="Timeline (days)" value={editForm.deadline} onChange={(e)=>setEditForm({...editForm, deadline:e.target.value})} />
                      <input className="w-full border px-3 py-2 rounded" placeholder="Fabric Type" value={editForm.fabric} onChange={(e)=>setEditForm({...editForm, fabric:e.target.value})} />
                      <input className="w-full border px-3 py-2 rounded" placeholder="GSM" value={editForm.gsm} onChange={(e)=>setEditForm({...editForm, gsm:e.target.value})} />
                      <input className="w-full border px-3 py-2 rounded" placeholder="Certifications (comma separated)" value={editForm.cert} onChange={(e)=>setEditForm({...editForm, cert:e.target.value})} />
                      <input className="w-full border px-3 py-2 rounded" placeholder="Shipping Terms" value={editForm.shippingTerms} onChange={(e)=>setEditForm({...editForm, shippingTerms:e.target.value})} />
                      <textarea className="w-full border px-3 py-2 rounded" placeholder="Additional Notes" value={editForm.notes} onChange={(e)=>setEditForm({...editForm, notes:e.target.value})} />
                      <div className="flex gap-2">
                        <button onClick={saveEdit} disabled={actionLoadingId === request.id} className="px-3 py-1 bg-[#0A66C2] text-white rounded text-sm disabled:opacity-60">{actionLoadingId === request.id ? 'Saving...' : 'Save'}</button>
                        <button onClick={() => setEditingId('')} className="px-3 py-1 border rounded text-sm">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
