/*
|--------------------------------------------------------------------------
| routers file
|--------------------------------------------------------------------------
|
| The routers file is used for defining the HTTP routers.
|
*/

import router from '@adonisjs/core/services/router'
router.get('/users', 'UsersController.index')

router.group(() => {
  router.patch('/profile', 'UserController.updateProfile')
  router.patch('/profile/img', 'UserController.updateProfileImage')
  router.patch('/profile/password', 'UserController.updateProfilePassword')

  // Pour activer ou désactiver un compte
  router.post('/user/:id/enabled', 'UserController.toggleEnabled')
}).prefix('/user')

router.group(() => {
  router.get('/users', 'AdminController.getAllUsers')
  router.get('/user/:id', 'AdminController.getUser')
  router.patch('/user/:id', 'AdminController.updateUser')
  router.patch('/user/:id/img', 'AdminController.updateUserImage')
  router.patch('/user/:id/password', 'AdminController.updateUserPassword')
  router.delete('/user/:id', 'AdminController.deleteUser')
})
  .prefix('/admin')
