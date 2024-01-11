/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('/auth/register','AuthController.register')
  Route.post('auth/login','AuthController.login')

  // Route.get('/thread','ThreadsController.index')
  // Route.post('/thread','ThreadsController.store').middleware('auth')
  // Route.get('/thread/:id','ThreadsController.show')
  // Route.put('/thread/:id','ThreadsController.update').middleware('auth')
  // Route.delete('/thread/:id','ThreadsController.destroy').middleware('auth')

  Route.resource('/thread','ThreadsController').apiOnly().middleware({
    store: 'auth',
    update: 'auth',
    destroy: 'auth',
  })

  // Route.post('/thread/:thread_id/replies','RepliesController.store').middleware('auth')

  Route.resource('thread.replies','RepliesController').only(['store']).middleware({store:'auth',})
}).prefix('/api')