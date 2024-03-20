import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Job from './job.js'
import type {HasOne} from '@adonisjs/lucid/types/relations'
import { HttpContext } from '@adonisjs/core/http'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullname: string

  @column()
  declare email: string

  @column()
  declare area: string

  @column()
  declare job: string

  @column()
  declare tel: string

  @column()
  declare img: string

  @column()
  declare enable: boolean

  @column()
  declare isAdmin: boolean

  @column()
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @hasOne(() => Job)
  declare profile: HasOne<typeof Job>

  public async index({ response }: HttpContext) {
    try {
      // Récupérer tous les utilisateurs actifs sauf les administrateurs
      const users = await User.query().where('enabled', true).whereNot('isAdmin', true)

      return response.ok(users)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Internal server error' })
    }
  }
  async indexAdmin({ response }: HttpContext) {
    const users = await User.query().where('enabled', true).andWhere('isAdmin', false)
    return response.ok(users)
  }
}
