import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import Thread from 'App/Models/Thread'
import SortThreadValidator from 'App/Validators/SortThreadValidator'
import ThreadValidator from 'App/Validators/ThreadValidator'
import { Query } from 'mysql2/typings/mysql/lib/protocol/sequences/Query'

export default class ThreadsController {
    public async store({request,auth,response}:HttpContextContract){
        const validateThread = await request.validate(ThreadValidator)

        try{
            const thread = await auth.user?.related('threads').create(validateThread)
            await thread?.load('category')
            await thread?.load('user')
            return response.status(201).json({
                data: thread,
            })
        }catch(error){
            return response.status(400).json({
                message: error.message,
            })
            
        }
        
    }

    // public async store({ request, auth, response }: HttpContextContract) {
    //     const validateData = await request.validate(ThreadValidator)
    
    //     try {
    //       const thread = await auth.user?.related('threads').create(validateData)
    //       await thread?.load('category')
    //       await thread?.load('user')
    
    //       return response.status(201).json({
    //         data: thread,
    //       })
    //     } catch (error) {
    //       return response.status(400).json({
    //         message: error.messages,
    //       })
    //     }
    //   }
    public async show({params,response}:HttpContextContract){
        try {
            // const thread = await Thread.findOrFail(params.id)
            const thread = await Thread.query().where('id',params.id).preload('category').preload('user').preload('replies').firstOrFail()
            return response.status(201).json({
                data: thread,
            })
        } catch (error) {
           return response.status(400).json({
            message: error.message,
           }) 
        }
    }
    public async index({request, response}:HttpContextContract){
        try {
            // const thread = await Thread.all()
            const page = request.input('page',1)
            const per_page = request.input('per_page',10)
            const userId = request.input('user_id')
            const categoryId = request.input('category_id')

            const validateData = await request.validate(SortThreadValidator)
            const sort_by = validateData.sort_by || 'id'
            const order = validateData.order || 'asc'
            const thread = await Thread.query().if(userId,(query) => query.where('user_id',userId)).if(categoryId,(query) => query.where('category_id', categoryId)).orderBy(sort_by,order).preload('category').preload('replies').preload('user').paginate(page,per_page)
            return response.status(201).json({
                data: thread
            })
        } catch (error) {
            return response.status(400).json({
                message: error.message
            })
        }
    }

    public async update({response,auth,request,params} :HttpContextContract){
        try {
            const user = await auth.user
            const thread = await Thread.findOrFail(params.id)
            if(user?.id !== thread.userId){
              
                throw new UnauthorizedException('Unauthorized',403,'E_UNAUTHORIZED')
             
            }
            const validateData = await request.validate(ThreadValidator)

            thread.merge(validateData).save()

            thread?.load('category')
            thread?.load('user')

            return response.status(201).json({
                data: thread,
            })
        } catch (error) {
            if(error.name === 'UnauthorizedException'){
                return response.status(error.status).json({
                    message: error.message
                })
            }else {
                return response.status(401).json({
                    message: 'Thread not Found',
                })
            }
            // return error.name
            // return response.status(400).json({
            //     message: error.message,
            // })
        }
    }

    public async destroy({response,auth,params}: HttpContextContract){
        try {
            const user = await auth.user
            const thread = await Thread.findOrFail(params.id)
            if(user?.id !== thread.userId){
                throw new UnauthorizedException('Unauthorized',403,'E_UNAUTHORIZED')
            }
            await thread.delete()

            return response.status(201).json({
                message: "Delete Succesfully",
            })
        } catch (error) {
            if(error.name === 'UnauthorizedException'){
                return response.status(error.status).json({
                    message: error.message
                })
            }else {
                return response.status(401).json({
                    message: 'Thread not Found',
                })
            }
        }
    }
}
