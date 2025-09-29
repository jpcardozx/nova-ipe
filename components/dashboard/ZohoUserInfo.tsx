// components/dashboard/ZohoUserInfo.tsx
'use client'

import { useZohoUser } from '@/hooks/use-zoho-user'
import { User, Building, Mail, LogOut } from 'lucide-react'

export function ZohoUserInfo() {
  const { user, logout, isAuthenticated } = useZohoUser()

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Usuário Zoho Mail360
        </h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {user.provider}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-gray-500" />
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Building className="h-4 w-4 text-gray-500" />
          <p className="text-sm text-gray-600">{user.organization}</p>
        </div>
      </div>
      
      <button
        onClick={logout}
        className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Sair
      </button>
    </div>
  )
}