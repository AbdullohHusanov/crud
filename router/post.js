const route = require('express').Router()
const controller = require('../controllers/post')
const validation = require('../middleware/validation')


route.get('/', controller.getPosts)
route.get('/:post_id', controller.getPost)
route.post('/', validation.CheckToken, validation.Trim, validation.PostValidation, controller.createPost)
route.delete('/:post_id', validation.CheckToken, controller.deletePost)
route.put('/:post_id', validation.CheckToken, validation.Trim, validation.PostValidation4Update, controller.updatePost)

module.exports = route