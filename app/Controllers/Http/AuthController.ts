import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RegisterValidator from 'App/Validators/RegisterValidator'
import User from 'App/Models/User'

export default class AuthController {
    public async register({auth,request,response}: HttpContextContract){
        const validateData = await request.validate(RegisterValidator)
        const user = await User.create(validateData)
        const token = await auth.login(user)

        return response.status(201).json({
            user,
            token,
        })
    }

    public async login({auth,request,response}: HttpContextContract){
        const {email, password} = request.all()
        try{
            const token = await auth.attempt(email,password)
            return response.status(200).json({
                user: token.user,
                token: token.token,
            })
        }catch (error) {
            return response.status(401).json({
                message: error.message,
            })
        }
    }
}
