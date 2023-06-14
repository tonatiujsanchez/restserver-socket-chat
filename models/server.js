const express = require('express')
var cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {

    constructor(){
        this.app = express()
        this.port = process.env.PORT || 8080
        this.usuariosRouterPath = '/api/usuarios'

        // Conectar a la BD
        this.conectarDB()

        // middlewares
        this.middlewares()

        // rutas
        this.routes()
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
    }

    routes(){
        this.app.use(this.usuariosRouterPath, require('../routes/usuarios'))
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Corriendo en el puerto', this.port);
        })
    }

}

module.exports = Server