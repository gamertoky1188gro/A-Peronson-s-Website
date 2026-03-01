import React from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

export default function CallInterface(){
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-white neo-panel cyberpunk-card rounded-lg w-full max-w-4xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-semibold">Meeting: Supplier Intro</div>
            <div className="text-sm text-[#5A5A5A]">00:12:34 • Recording</div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded">Mute</button>
            <button className="px-3 py-1 border rounded">Camera</button>
            <button className="px-3 py-1 border rounded">Share</button>
            <button className="px-3 py-1 bg-red-600 text-white rounded">End Call</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-900 h-64 rounded"></div>
          <div className="bg-gray-900 h-64 rounded"></div>
        </div>

        <div className="mt-3 flex justify-between">
          <div className="text-sm text-[#5A5A5A]">Notes • Shared Files</div>
          <Link to="/" className="text-sm text-[#0A66C2]">Close</Link>
        </div>
      </div>

      <FloatingAssistant />
    </div>
  )
}
