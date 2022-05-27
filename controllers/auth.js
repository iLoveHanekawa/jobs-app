const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { createCustomError } = require('../errors/CustomError')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const register = async (req, res) => {
    const user = await User.create({...req.body})
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: {name: user.name}, token })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if(!email || !password) {
        throw createCustomError(StatusCodes.BAD_REQUEST, 'provide both fields')
    }
    const user = await User.findOne({ email })
    if(!user) {
        throw createCustomError(StatusCodes.UNAUTHORIZED, 'Register first')
    }

    const isPassCorrect = await user.comparePass(password)
    if(!isPassCorrect) {
        console.log(isPassCorrect)
        throw createCustomError(StatusCodes.UNAUTHORIZED, 'Incorrect password')
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token})
}    

module.exports = { register, login }