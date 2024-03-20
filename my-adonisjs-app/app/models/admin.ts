import { HttpContext } from '@adonisjs/core/http'
import User from './user.js'

export default class Users {
  public async show({ params, response }: HttpContext) {
    try {
      const userId: number = params.id // Spécifiez le type du paramètre 'id'

      // Récupérer l'utilisateur par ID
      const user = await User.findOrFail(userId)

      return response.ok(user)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Internal server error' })
    }
  }
  static findOrFail(_userId: number) {
    throw new Error('Method not implemented.')
  }
}
