const { StatusCodes } = require('http-status-codes')
const { CustomError } = require('../errors/CustomError')

const errorHandler = async (err, req, res, next) => {
    
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong try again later'
    }
    
    if(err instanceof CustomError) {
        return res.status(err.statusCode).json({msg: err.message})
    }
    if(err.code && err.code === 11000) {
        customError.msg = `Duplicate value entered for ${err.keyValue} field, please choose another value`,
        customError.statusCode = 400
    }
    // res.status(500).json({msg: 'something went wrong', err})
    return res.status(customError.statusCode).json({msg: customError.msg})
}

module.exports = errorHandler