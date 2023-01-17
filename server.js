require('dotenv').config()
const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const hbs = require('express-handlebars')
const MongoStore = require('connect-mongo')
const yargs = require("yargs/yargs")(process.argv.slice(2))

//-----------------------modulos------------------------//
const { productos } = require('./modulos/class/productos.js')
const mensajes = require('./modulos/class/mensajes.js')
const routerProd = require('./modulos/routers/routerProductos.js')
const routermsg = require('./modulos/routers/routermsg.js')
const login = require('./modulos/routers/session/routerLogin.js')
const register = require('./modulos/routers/session/routerRegister.js')
const routerSession = require('./modulos/routers/session/routerSession.js')
const routerCookies = require('./modulos/routers/cookies/routerCookies.js')
const { passport } = require('./modulos/middleware/passport.js')
const routerInfo = require('./modulos/routers/routerInfo.js')
const routerRandoms = require('./modulos/routers/routerRandoms.js')

//------------------------------------------------------//



const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)


app.engine('hbs', hbs.engine({
    extname: '.hbs',
    partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'server.hbs'
}))



//-------------session----------------//
const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
app.use(session({
    secret: process.env.SECRET_KEY_SESSION,
    store: MongoStore.create({
        mongoUrl: process.env.MONGOURL,
        mongoOptions: config
    }),
    cookie:{
        httpOnly: false,
        secure: false,
        maxAge: 1000*60*5
    },
    rolling: true,
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
//------------------------------------//


app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.SECRET_KEY_COOKIE))



app.set('views', './views')
app.set('view engine', 'hbs')


//---------------------Rutas----------------------//
app.use('/', routerSession)
app.use('/register', register)
app.use('/login', login)
app.use('/appi/productos', routerProd)
app.use('/cookies', routerCookies)
app.use('/mensajes', routermsg)
app.use('/info',routerInfo)
app.use('/appi/randoms', routerRandoms)
//------------------------------------------------//


let users = 0
//--------------------------Socket io---------------------------//
io.on('connection', async (socket) => {
    users++
    console.log(`usuario ${socket.id} conectado. N°:${users}`)
    socket.on('respuesta', async () => {
        io.sockets.emit('array', await productos.getAll())
        io.sockets.emit('mensajes', await mensajes.getAll())
    })
    socket.on('newProduct', async data => {
        productos.save(data)
        io.sockets.emit('array', await productos.getAll())
    })
    socket.on('newMensaje', async data => {
        await mensajes.save(data.mensaje, data.user)
        io.sockets.emit('mensajes', await mensajes.getAll())
    })
    socket.on('disconnect', () => { console.log('user disconnected'), users-- })
})
//--------------------------------------------------------------//


// const argv = yargs.default({
//     PORT: 4000
// }).argv
const PORT = yargs.default({PORT: 8080}).argv.PORT
httpServer.listen(PORT, () => { console.log(`escuchando ${PORT}`) })