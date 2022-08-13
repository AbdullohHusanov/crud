const route = require('express').Router()
const controller = require('../controllers/comment')

route.get('/', controller.getComments)
route.get('/:comment_id', controller.getComment)
route.post('/', controller.createComment)
route.delete('/:comment_id', controller.deleteComment)
route.put('/:comment_id', controller.updateComment)

module.exports = route