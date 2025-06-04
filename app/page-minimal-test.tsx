'use client'

export default function MinimalHome() {
    return (
        <main className="min-h-screen flex flex-col">
            <div className="p-8">
                <h1 className="text-3xl font-bold">Minimal Test Page</h1>
                <p>If this loads without errors, the issue is with dynamic imports in the main page.</p>
            </div>
        </main>
    )
}
