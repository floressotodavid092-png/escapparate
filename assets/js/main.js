/*=============== APP: LOGIN / REGISTRO ===============*/
class LoginRegisterApp {
   constructor() {
      this.loginForm = document.getElementById('login-form')
      this.registerForm = document.getElementById('register-form')
      this.successOverlay = document.getElementById('success-overlay')

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

   /*--------- Login (placeholder, listo para conectar a BD) ---------*/
   handleLoginSubmit(event) {
      event.preventDefault()
      const credenciales = {
         correo: document.getElementById('login-email').value.trim(),
         contrasena: document.getElementById('login-pass').value
      }
      // TODO: enviar "credenciales" al backend / base de datos
      console.log('Login:', credenciales)
   }

   /*--------- Registro ---------*/
   handleRegisterSubmit(event) {
      event.preventDefault()

      const nuevoUsuario = {
         nombre: document.getElementById('register-name').value.trim(),
         correo: document.getElementById('register-email').value.trim(),
         contrasena: document.getElementById('register-pass').value,
         numeroEmpleado: document.getElementById('register-employee-number').value.trim()
      }

      if (!this.isValidRegistration(nuevoUsuario)) return

      // TODO: enviar "nuevoUsuario" al backend / base de datos

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
