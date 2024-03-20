import { HttpContext } from "@adonisjs/core/http"
import Job from "./job.js"
import { cuid } from "@adonisjs/core/helpers"
import { BaseModel } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})


export default class User extends compose(BaseModel, AuthFinder) {
  async register({ request, response }: HttpContext) {
    const email = request.input('email')
    const password = request.input('password')
    const fullName = request.input('full_name')
    const area = request.input('area')
    const tel = request.input('tel')
    const imgFile = request.file('img', {
      extnames: ['jpg', 'png', 'jpeg'],
      size: '4mb',
    })

    const jobId = request.input('job_id')

    // Check if every fields are filled
    if (!email || !password || !fullName || !area || !tel || !imgFile || !jobId) {
      return response.badRequest('Missing fields')
    }

    // Check if user already exists
    const user = await User.findBy('email', email)
    if (user) {
      return response.badRequest('Email already exists')
    }

    //Check strength of password
    if (password.length < 8) {
      return response.badRequest('Password too short')
    }

    // Check job exists
    const job = await Job.find(jobId)
    if (!job) {
      return response.badRequest('Job does not exist')
    }

    if (!imgFile.isValid) {
      return response.badRequest({ message: 'Invalid image' })
    }

    const filename = `${cuid()}.${imgFile.extname}`

    // Save user
    try {
      await User.create({
        email,
        password,
        fullName,
        area,
        tel,
        img: filename,
        jobId,
      })

      await imgFile.move('public/uploads', { name: filename })

      return response.created('User created')
    } catch (e) {
      console.log(e)
      return response.badRequest('Error creating user')
    }
  }
}