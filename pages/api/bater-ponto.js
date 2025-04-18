
// pages/api/bater-ponto.js

import { createClient } from '@supabase/supabase-js'

// Cria conexão com Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
)

export default async function handler(req, res) {
  // Permite só POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  // Dados esperados no body
  const { user_id, horario } = req.body

  if (!user_id || !horario) {
    return res.status(400).json({ error: 'user_id e horario são obrigatórios' })
  }

  // Tenta inserir no Supabase
  const { data, error } = await supabase
    .from('time_records')
    .insert([{ 
      user_id, 
      timestamp: horario,
      type: 'check-in',
      device: 'web' 
    }])

  if (error) {
    console.error("Error registering time record:", error);
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ message: 'Ponto registrado com sucesso!', data })
}
