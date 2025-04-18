
import { createClient } from '@supabase/supabase-js'

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { user_id, horario, type = 'check-in', device = 'web', location = null } = req.body

  if (!user_id || !horario) {
    return res.status(400).json({ error: 'user_id e horario são obrigatórios' })
  }

  try {
    const { data, error } = await supabase
      .from('time_records')
      .insert([{ 
        user_id, 
        timestamp: horario,
        type,
        device,
        location,
        synced: true 
      }])

    if (error) {
      console.error("Error registering time record:", error);
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ 
      message: 'Ponto registrado com sucesso!', 
      data 
    })
  } catch (err) {
    console.error("Exception registering time record:", err);
    return res.status(500).json({ 
      error: 'Erro interno ao registrar ponto' 
    })
  }
}
