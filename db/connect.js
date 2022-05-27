const mongoose = require('mongoose')

const connectDB = (uri) => {
    mongoose.connect(uri, () => {
        console.log('connected to db')
    })
}

module.exports = connectDB