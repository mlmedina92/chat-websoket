import express from 'express'
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'//para poner en marcha el motor de plantillas
import { Server } from 'socket.io'
import viewsRouter from './routes/views.router.js'

const app = express()//creo el serv

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//parada decirle donde esta la carpeta public: archivos estaticos
app.use(express.static(__dirname + '/public'))

//seteo motores de plantilla
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')


// cdo al guien llame a ruta raiz utilice viewsRouter
app.use('/', viewsRouter)

// creo servidor http
const httpServer = app.listen(8080, () => {
    console.log('Escuchando al puerto 8080');
})

// creo servidor websocket del lado del servidor
export const socketServer = new Server(httpServer)

const infoMensajes = []//guardo el msj y el nombre de la persona,el objeto completo info

// el servidor escucha si hay conecion o desocnecion

socketServer.on('connection', socket => {
    // el obejto que viene en el evento coneection iene una prop id
    console.log(`Usuario conectado: ${socket.id}`)//Usuario conectado: AfR8T9NXAEGN1Ll3AAAF

    socket.on('disconnet', () => {
        console.log('usuario desconectado');//Usuario desconectado

    })

    // Escucho evento q genera el clienet que viene con inf de usuario
    socket.on('nuevoUsuario', usuario => {
         console.log('usuario', usuario);//usuario cris desde un alerta en el cliente traigo hasta el servidor el nombre de c/us q se va conectando 

        //creo un evento q le llega a todos menos el q me mando el nuevo usuario
        socket.broadcast.emit('broadcast', usuario)
    })

    socket.on('mensaje', info => {//con el vento mensaje me viene un objeto info,lo escucho
        infoMensajes.push(info)//leno el []
        socketServer.emit('chat', infoMensajes)//emito un evento chat a todos los usuarios y mando todo el arreglo de mjs
    })
})