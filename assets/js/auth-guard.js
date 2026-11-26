import { supabase } from './supabaseClient.js'

// Protege las páginas del dashboard: sin sesión -> login (index raíz)
const { data: { session } } = await supabase.auth.getSession()
if (!session) window.location.replace('/index.html')
