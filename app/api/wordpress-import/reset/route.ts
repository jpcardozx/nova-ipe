import { NextResponse } from 'next/server'
import { unlinkSync, existsSync } from 'fs'
import { join } from 'path'

const CHECKPOINT_PATH = join(process.cwd(), 'scripts/wordpress-importer/checkpoint.json')

export async function POST() {
  try {
    if (existsSync(CHECKPOINT_PATH)) {
      unlinkSync(CHECKPOINT_PATH)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Checkpoint resetado com sucesso' 
    })
  } catch (error) {
    console.error('Error resetting checkpoint:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Falha ao resetar checkpoint' 
    }, { status: 500 })
  }
}
