const { request, response } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/jwt')

const login = async( req = request, res = response )=> {
    
    const { correo, password } = req.body

    try {

        // Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo })

        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario o Contraseña no son correctos - Correo'
            })
        }

        // Verificar si el usuario esta activo
        if( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario o Contraseña no son correctos - Status'
            })
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if( !validPassword ){
            return res.status(400).json({
                msg: 'Usuario o Contraseña no son correctos - Password'
            })
        }

        // Generar GWT
        const token = await generarJWT( usuario.id )
        
        res.status(200).json({
            usuario, 
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Algo salio mal, hable con el administrador"
        })
    }
    

}


module.exports = {
    login
}