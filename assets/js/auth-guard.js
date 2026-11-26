import { supabase } from './supabaseClient.js'

// Protege las páginas del dashboard: sin sesión -> login (index raíz)
const { data: { session } } = await supabase.auth.getSession()

if (!session) {
   window.location.replace('/index.html')
} else {

   // Cargar el perfil del empleado (tabla empleados, id = auth.users.id)
   const { data: emp } = await supabase
      .from('empleados')
      .select('nombre, correo, numero_empleado')
      .eq('id', session.user.id)
      .maybeSingle()

   const nombre = emp?.nombre || session.user.email
   const greeting = document.querySelector('#greeting')
if (greeting) greeting.textContent = `Good morning, ${nombre}`
   const correo = emp?.correo || session.user.email
   const numero = emp?.numero_empleado

   const iniciales = nombre.split(/\s+/).filter(Boolean).slice(0, 2)
      .map((p) => p[0].toUpperCase()).join('')

   // Avatar de la barra superior (en todas las páginas)
   document.querySelectorAll('a.av[href="profile.html"]').forEach((a) => {
      a.textContent = iniciales
      a.title = nombre
   })

   // Página de perfil
   const set = (sel, fn) => {
      const el = document.querySelector(sel)
      if (el) fn(el)
   }

   set('#fn', (el) => {
      el.value = nombre
      el.readOnly = true
   })

   set('#pe', (el) => {
      el.value = correo
      el.readOnly = true
   })

   set('#jt', (el) => {
      el.value = numero ? `Empleado #${numero}` : ''
      el.readOnly = true
   })

   set('#ph', (el) => {
      el.value = ''
   })

   set('.card .row .av[style*="64px"]', (el) => {
      el.textContent = iniciales
   })

   set('.card .row b[style*="16px"]', (el) => {
      el.textContent = nombre
   })

   set('.card .row b[style*="16px"] + br + span', (el) => {
      el.textContent = numero ? `Empleado #${numero}` : ''
   })

}