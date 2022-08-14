const express = require('express')
const app = express()

app.use(express.json())

const commentRoute = require('./router/comment')
const userRoute = require('./router/user')
const postRoute = require('./router/post')

app.use('/user', userRoute)
app.use('/post', postRoute)
app.use('/comment', commentRoute)

app.listen(8001, () => console.log('8001...'))