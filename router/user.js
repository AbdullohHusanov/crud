const route = require('express').Router()
const controller = require('../controllers/user')
const validation = require("../middleware/validation")

route.get('/', controller.getUsers)
route.get('/:user_id', controller.getUser)
route.post('/', validation.UserValidation, controller.createUser)
route.delete('/:userId', validation.CheckToken, controller.deleteUser)
route.put('/:userId', validation.CheckToken, controller.updateUser)

module.exports = route