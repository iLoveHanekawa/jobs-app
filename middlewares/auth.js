const { StatusCodes } = require('http-status-codes')
const { createCustomError } = require('../errors/CustomError')
const jwt = require('jsonwebtoken')
const { decode } = require('jsonwebtoken')

const authMidWare = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        throw createCustomError(StatusCodes.BAD_REQUEST, 'Bad Request')
    }
    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { userId: decoded.userId, name: decoded.name}
        next()
    } catch (error) {
        throw createCustomError(StatusCodes.UNAUTHORIZED, 'Unauthorized')
    }
}

module.exports = authMidWare