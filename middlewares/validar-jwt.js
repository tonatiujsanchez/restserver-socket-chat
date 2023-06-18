const { request, response } = require('express')
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')


const validarJWT = async( req = request, res = response, next ) => {

    const token = req.header('x-token') 

    if( !token ){
        return res.status(401).json({
            msg: 'No autorizado - Sin token'
        })
    }

    try {

        const { uid } = jwt.verify( token, process.env.JWT_SECRET_KEY )

        const usuarioAutenticado = await Usuario.findById(uid)

        if( !usuarioAutenticado ){
            return res.status(401).json({
                msg: 'No autorizado - Usuario no encontrado'
            })
        }

        if( !usuarioAutenticado.estado ){
            return res.status(401).json({
                msg: 'No autorizado - Usuario en estado false'
            })
        }

        req.usuarioAutenticado = usuarioAutenticado   
        
        next()

    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'No autorizado - Token no Válido'
        })
    }


}

module.exports = {
    validarJWT
}