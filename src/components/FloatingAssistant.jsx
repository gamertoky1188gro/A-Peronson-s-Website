import React, { useState } from 'react'

export default function FloatingAssistant() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="fixed right-6 bottom-6 z-50">
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] shadow-lg flex items-center justify-center text-white text-2xl"
          aria-label="Open assistant"
        >
          🤖
        </button>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[420px] bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] flex items-center justify-center text-white font-bold">AI</div>
            <div>
              <p className="font-semibold text-[#1A1A1A]">GarTex Assistant</p>
              <p className="text-sm text-[#5A5A5A]">How can I help with sourcing today?</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <input
              placeholder="Ask me about suppliers, MOQs, pricing, or audits"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            <div className="bg-[#F4F9FF] p-3 rounded-lg">Suggestions: "Find sustainable knitwear suppliers"</div>
            <div className="bg-[#F4F9FF] p-3 rounded-lg">"Create sourcing brief"</div>
            <div className="bg-[#F4F9FF] p-3 rounded-lg">"Estimate lead time for 1000 shirts"</div>
          </div>
        </div>
      </div>
    </>
  )
}
