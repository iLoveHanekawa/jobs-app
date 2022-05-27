const noMatch = async (req, res, next) => {
    res.status(404).send(`<h1>Resource not Found</h1>`)
}

module.exports = noMatch