import { supabase } from './supabaseClient.js'

/*=============== APP: LOGIN / REGISTRO ===============*/
class LoginRegisterApp {
   constructor() {
      this.loginForm = document.getElementById('login-form')
      this.registerForm = document.getElementById('register-form')
      this.successOverlay = document.getElementById('success-overlay')
      this.welcomeScreen = document.getElementById('welcome-screen')

      this.init()
   }

   init() {
      this.initPasswordToggle('login-pass', 'login-eye')
      this.initPasswordToggle('register-pass', 'register-eye')

      document.getElementById('show-register')
         .addEventListener('click', (e) => this.switchToRegister(e))

      document.getElementById('show-login')
         .addEventListener('click', (e) => this.switchToLogin(e))

      document.getElementById('success-accept')
         .addEventListener('click', () => this.acceptSuccessMessage())

      this.registerForm.addEventListener('submit', (e) => this.handleRegisterSubmit(e))
      this.loginForm.addEventListener('submit', (e) => this.handleLoginSubmit(e))

      document.getElementById('logout-btn')
         .addEventListener('click', () => this.handleLogout())

      this.restoreSession()
   }

   /*--------- Utilidades ---------*/
   setLoading(form, loading) {
      const btn = form.querySelector('button[type="submit"]')
      if (btn) btn.disabled = loading
   }

   showWelcome() {
      window.location.href = './escaparate-rapport-docker/rapport/index.html'
   }

   async restoreSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) this.showWelcome()
   }

   async handleLogout() {
      await supabase.auth.signOut()
      this.welcomeScreen.hidden = true
   }

   /*--------- Mostrar/ocultar contraseña ---------*/
   initPasswordToggle(inputId, eyeId) {
      const input = document.getElementById(inputId)
      const iconEye = document.getElementById(eyeId)
      if (!input || !iconEye) return

      iconEye.addEventListener('click', () => {
         const isPassword = input.type === 'password'
         input.type = isPassword ? 'text' : 'password'
         iconEye.classList.toggle('ri-eye-line', isPassword)
         iconEye.classList.toggle('ri-eye-off-line', !isPassword)
      })
   }

   /*--------- Alternar formularios ---------*/
   switchToRegister(event) {
      event.preventDefault()
      this.loginForm.hidden = true
      this.registerForm.hidden = false
   }

   switchToLogin(event) {
      if (event) event.preventDefault()
      this.registerForm.hidden = true
      this.loginForm.hidden = false
   }

   /*--------- Login ---------*/
   async handleLoginSubmit(event) {
      event.preventDefault()
      const correo = document.getElementById('login-email').value.trim()
      const contrasena = document.getElementById('login-pass').value

      this.setLoading(this.loginForm, true)
      const { data, error } = await supabase.auth.signInWithPassword({
         email: correo,
         password: contrasena
      })
      this.setLoading(this.loginForm, false)

      if (error) {
         console.error('Login:', error)
         alert('No se pudo iniciar sesión: ' + error.message)
         return
      }
      this.loginForm.reset()
      this.showWelcome()
   }

   /*--------- Registro ---------*/
   async handleRegisterSubmit(event) {
      event.preventDefault()

      const nuevoUsuario = {
         nombre: document.getElementById('register-name').value.trim(),
         correo: document.getElementById('register-email').value.trim(),
         contrasena: document.getElementById('register-pass').value,
         numeroEmpleado: document.getElementById('register-employee-number').value.trim()
      }

      if (!this.isValidRegistration(nuevoUsuario)) return

      this.setLoading(this.registerForm, true)

      // 1) Crear usuario en auth.users
      const { data, error } = await supabase.auth.signUp({
         email: nuevoUsuario.correo,
         password: nuevoUsuario.contrasena
      })

      if (error || !data.user) {
         this.setLoading(this.registerForm, false)
         console.error('Registro (auth):', error)
         alert('No se pudo crear la cuenta: ' + (error?.message || 'error desconocido'))
         return
      }

      // 2) Vincular con la tabla empleados (id = auth.users.id)
      const { error: dbError } = await supabase.from('empleados').insert({
         id: data.user.id,
         nombre: nuevoUsuario.nombre,
         numero_empleado: nuevoUsuario.numeroEmpleado,
         correo: nuevoUsuario.correo
      })
      this.setLoading(this.registerForm, false)

      if (dbError) {
         console.error('Registro (empleados):', dbError)
         alert('Usuario creado, pero falló el guardado en empleados: ' + dbError.message)
         return
      }

      // Cerrar la sesión automática para que el usuario inicie sesión manualmente
      await supabase.auth.signOut()

      this.registerForm.reset()
      this.successOverlay.hidden = false
   }

   isValidRegistration({ nombre, correo, contrasena, numeroEmpleado }) {
      return Boolean(nombre && correo && contrasena && numeroEmpleado)
   }

   acceptSuccessMessage() {
      this.successOverlay.hidden = true
      this.switchToLogin()
   }
}

document.addEventListener('DOMContentLoaded', () => new LoginRegisterApp())