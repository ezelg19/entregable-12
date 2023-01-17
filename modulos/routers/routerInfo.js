const { Router } = require('express')
const { checkAuthentication } = require('../middleware/checkAuthentication.js')
const yargs = require('yargs/yargs')(process.argv.slice(2))


const router = Router()

router.get('/', checkAuthentication, (req, res) => {
    res.cookie('time', '1min', { maxAge: 60000 }).render('info', {
            argumentosDeEntrada: yargs.argv,
            Plataforma: process.platform,
            Version: `Node.js ${process.version}`,
            Memoria: process.memoryUsage(0).rss,
            Path: process.execPath,
            Pid: process.pid,
            Proyecto: process.cwd()
        
    })
})



module.exports = router