'use client'

import { useState } from 'react'
import EducationalView from '../components/EducationalView'

export default function EducationalPage() {
    return (
        <div className="min-h-screen bg-gray-50 rounded-lg p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto rounded-md">
                <EducationalView />
            </div>
        </div>
    )
}