import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const CHECKPOINT_PATH = join(process.cwd(), 'scripts/wordpress-importer/checkpoint.json')
const TOTAL_PROPERTIES = 761

export async function GET() {
  try {
    let checkpoint = {
      lastProcessedId: 0,
      totalProcessed: 0,
      totalFailed: 0,
      errors: [],
      completedBatches: [],
      startedAt: '',
      lastUpdatedAt: ''
    }

    if (existsSync(CHECKPOINT_PATH)) {
      const data = readFileSync(CHECKPOINT_PATH, 'utf-8')
      checkpoint = JSON.parse(data)
    }

    const stats = {
      totalProperties: TOTAL_PROPERTIES,
      processed: checkpoint.totalProcessed,
      failed: checkpoint.totalFailed,
      remaining: TOTAL_PROPERTIES - checkpoint.totalProcessed,
      progress: (checkpoint.totalProcessed / TOTAL_PROPERTIES) * 100,
      isRunning: false, // You can track this with a separate state file
      errors: checkpoint.errors || [],
      lastUpdatedAt: checkpoint.lastUpdatedAt,
      completedBatches: checkpoint.completedBatches || []
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error loading checkpoint:', error)
    return NextResponse.json({
      totalProperties: TOTAL_PROPERTIES,
      processed: 0,
      failed: 0,
      remaining: TOTAL_PROPERTIES,
      progress: 0,
      isRunning: false,
      errors: []
    })
  }
}
