require('dotenv').config()
require('express-async-errors')
const errorHandler = require('./middlewares/errorHandler')
const noMatch = require('./middlewares/noMatch')
const connectDB = require('./db/connect')
const express = require('express')
const app = express()
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const authMidWare = require('./middlewares/auth')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

app.set('trust proxy', 1)

app.use(express.json())

app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100
}))

app.use(helmet())
app.use(cors())
app.use(xss())

app.get('/', (req, res) => {
    res.send(`<h1>Jobs api</h1><a href = "/api-docs">Documentations</a>`)
})
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authMidWare, jobsRouter)

app.use(errorHandler)
app.use(noMatch)

const port = process.env.PORT || 5000

const start = () => {
    try {
        connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`server listening at port: ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
} 

start()