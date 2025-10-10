import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

async function checkDataStructure() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await supabase
    .from('wordpress_properties')
    .select('wp_id, data, photo_count')
    .eq('wp_id', 78)
    .single()

  console.log('Property wp_id 78:')
  console.log('photo_count:', data!.photo_count)
  console.log('\nCampos do data com photo/image/pic/gallery:')
  const fields = Object.keys(data!.data).filter(
    (k) =>
      k.includes('photo') ||
      k.includes('image') ||
      k.includes('pic') ||
      k.includes('gallery')
  )
  console.log(fields)
  console.log('\nValores:')
  console.log('pic_numb:', data!.data.pic_numb)
  fields.forEach((f) => {
    console.log(`${f}:`, data!.data[f])
  })
}

checkDataStructure()
