import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { join } from 'path'

export async function POST() {
  try {
    // Start import in background
    const scriptPath = join(process.cwd(), 'scripts/wordpress-importer/import.ts')
    
    const child = spawn('tsx', [scriptPath], {
      detached: true,
      stdio: 'ignore',
      cwd: process.cwd(),
      env: {
        ...process.env,
        NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
        SANITY_API_TOKEN: process.env.SANITY_API_TOKEN
      }
    })

    child.unref()

    return NextResponse.json({ 
      success: true, 
      message: 'Importação iniciada em background',
      pid: child.pid 
    })
  } catch (error) {
    console.error('Error starting import:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Falha ao iniciar importação' 
    }, { status: 500 })
  }
}
