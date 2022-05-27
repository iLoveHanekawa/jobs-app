const { StatusCodes } = require('http-status-codes')
const Jobx = require('../models/Job')
const { createCustomError } = require('../errors/CustomError')

const getAllJobs = async (req, res) => {
    const jobs = await Jobx.find( {createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async (req, res) => {

    const { user: {userId}, params: {id: jobId}} = req
    const job = await Jobx.findOne({
        _id: jobId, createdBy: userId
    })
    if(!job) {
        throw createCustomError(StatusCodes.NOT_FOUND, 'Job not found')
    }
    res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Jobx.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

const updateJobs = async (req, res) => {
    const { body: { company, position }, user: {userId}, params: {id: jobId}} = req
    if(company === '' || position === '') {
        throw createCustomError(StatusCodes.BAD_REQUEST, 'Bad request')
    }
    const job = await Jobx.findByIdAndUpdate( {_id: jobId, createdBy: userId}, req.body, {
        new: true,
        runValidators: true
    })
    if(!job) {
        return res.status(StatusCodes.NOT_FOUND, 'job Not found')
    }
    res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
    const { user: {userId}, params: {id: jobId}} = req
    const job = await Jobx.findByIdAndRemove({
        _id: jobId,
        createdBy: userId
    })
    if(!job) {
        throw createCustomError(StatusCodes.NOT_FOUND, 'job not found')
    }
    res.status(StatusCodes.OK).send()
}

module.exports = {
    getAllJobs, getJob, createJob, updateJobs, deleteJob
}