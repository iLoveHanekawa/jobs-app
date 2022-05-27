const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'need company'],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, 'need position'],
        maxlength: 100
    },
    status: {
        type: String,
        enmu: ['interview', 'declined', 'pending'],
        default: 'pending',
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'provide user']
    },
}, {timestamps: true})

module.exports = mongoose.model('Jobx', JobSchema)