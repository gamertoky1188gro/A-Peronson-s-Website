import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

export default function BuyerRequestManagement(){
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ category:'', subcategory:'', quantity:'', price:'', deadline:'', fabric:'', gsm:'', cert:'', notes:'' })

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      
      {/* Shared global NavBar */}


      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Post New Buyer Request</h1>
          <div className="text-sm text-[#5A5A5A]">Step {step} of 3</div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
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
              <button onClick={()=>setStep(3)} className="px-4 py-2 bg-[#0A66C2] text-white rounded">Continue</button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <label className="block text-sm">Additional Notes</label>
              <textarea className="w-full border px-3 py-2 rounded" value={form.notes} onChange={(e)=>setForm({...form, notes:e.target.value})} />
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-[#0A66C2] text-white rounded">Post Request</button>
                <button className="px-4 py-2 border rounded" onClick={()=>setStep(1)}>Back</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <FloatingAssistant />
    </div>
  )
}
