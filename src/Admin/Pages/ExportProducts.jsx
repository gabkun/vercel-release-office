import React from 'react'
import Sidenavbar from '../../Admin Utilities/sidenavbar'

export const ExportProducts = () => {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-64 min-w-[16rem] border-r border-gray-200 bg-white">
        <Sidenavbar />
      </div>

      {/* Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Export Products Monitoring</h1>
        </div>
         </div>
  )
}
