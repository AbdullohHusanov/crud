const route = require('express').Router()
const controller = require('../controllers/comment')
const validation = require('../middleware/validation')

route.get('/', controller.getComments)
route.get('/:comment_id', controller.getComment)
route.post('/', validation.CheckToken, validation.Trim, validation.CommentValidation, controller.createComment)
route.delete('/:comment_id', validation.CheckToken, controller.deleteComment)
route.put('/:comment_id', validation.CheckToken, validation.Trim, validation.CommentValidation4Update, controller.updateComment)

module.exports = route