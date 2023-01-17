const { Router } = require('express')
const { fork } = require('child_process')
const router = Router()

router.get('/', (req, res) => {
    if (req.query) {
        const num = fork(__dirname + '/numRandom.js',[parseInt(req.query.cant)])
        num.send('start')
        num.on('message', resultado => {
            res.send(resultado)
        })
    }
})

router.post('/', (req, res) => {
})

module.exports = router