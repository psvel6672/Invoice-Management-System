const route = require('express').Router()
const UserController = require('../controllers/user.controller')
const AuthMW = require('../middlewares/auth.middleware')

route.get('/allusers', UserController.getAllUsers);
route.post('/getuserdetails', UserController.getUserDetails);
route.post('/updateuserdetails', UserController.updateUserDetails);
route.post('/deleteuser', UserController.removeUserData);
route.post('/createuser', UserController.addNewUserData);
route.post('/login', UserController.loginToSystem)
route.get('/logout', UserController.logoutSystem)

module.exports = route