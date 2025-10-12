'use client'

import { useState } from 'react'
import { EducationalView } from '../components/EducationalView'

export default function EducationalPage() {
    const [selectedArticle, setSelectedArticle] = useState<string | null>(null)

    return (
        <div className="min-h-screen bg-background dark:bg-background">
            <div className="max-w-7xl mx-auto py-8">
                <EducationalView 
                    selectedArticle={selectedArticle}
                    onSelectArticle={setSelectedArticle}
                    onBack={() => setSelectedArticle(null)}
                />
            </div>
        </div>
    )
}