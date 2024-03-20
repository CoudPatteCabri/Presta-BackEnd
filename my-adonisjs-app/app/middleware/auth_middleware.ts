import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'

  public async handle({ request, auth, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // Récupérer l'utilisateur par email
      const user = await User.findBy('email', email)

      // Vérifier si l'utilisateur existe
      if (!user) {
        return response.unauthorized({ error: 'Invalid email or password' })
      }

      // Vérifier si le mot de passe est correct
      const isPasswordValid = user.password === password // Mettez ici votre propre logique de vérification de mot de passe
      if (!isPasswordValid) {
        return response.unauthorized({ error: 'Invalid email or password' })
      }

      // Vérifier si l'utilisateur est activé
      if (!user.enable) {
        return response.unauthorized({ error: 'Your account is not verified' })
      }

      // Authentifier l'utilisateur et générer le token d'authentification
      const token = await auth.use('api')

      return response.ok({ token })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Internal server error' })
    }
    
  }
  
}
class IsAdminMiddleware {
  async handle({ auth, response }: any, next: () => any) {
    const user = auth.user

    if (!user || !user.isAdmin) {
      return response.unauthorized({ message: 'You are not authorized to perform this action' })
    }

    await next()
  }
}

module.exports = IsAdminMiddleware