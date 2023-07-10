const express = require('express')
var cors = require('cors')
const fileUpload = require('express-fileupload')
const { createServer } = require('http')

const { dbConnection } = require('../database/config')
const { socketController } = require('../sockets/socket-controller')

class Server {

    constructor(){
        this.app = express()
        this.port = process.env.PORT || 8080
        this.server = createServer(this.app)
        this.io = require('socket.io')(this.server)


        this.paths = {
            usuarios  : '/api/usuarios',
            auth      : '/api/auth',
            categorias: '/api/categorias',
            productos : '/api/productos',
            buscar    : '/api/buscar',
            uploads    : '/api/uploads'
        }

        // Conectar a la BD
        this.conectarDB()

        // middlewares
        this.middlewares()

        // rutas
        this.routes()
    
        // sockets
        this.sockets()
    }

    async conectarDB(){
        await dbConnection()
    }

    middlewares(){
        // CORS
        this.app.use( cors() ) 

        // Lectura y parseo del body
        this.app.use( express.json() )

        // Directorio público
        this.app.use( express.static('public') )

        // Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true //Crea la carpeta
        }));
    }

    routes(){
        this.app.use(this.paths.usuarios, require('../routes/usuarios'))
        this.app.use( this.paths.auth, require('../routes/auth') )
        this.app.use( this.paths.categorias, require('../routes/categorias') )
        this.app.use( this.paths.productos, require('../routes/productos') )
        this.app.use( this.paths.buscar, require('../routes/buscar') )
        this.app.use( this.paths.uploads, require('../routes/uploads') )
    }

    sockets(){
        this.io.on('connection', ( socket )=> socketController(socket, this.io));
    }

    listen(){
        this.server.listen(this.port, () => {
            console.log('Corriendo en el puerto', this.port);
        })
    }

}

module.exports = Server