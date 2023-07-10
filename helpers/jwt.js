
const jwt = require('jsonwebtoken')
const { Usuario } = require('../models')


const generarJWT = ( uid = '' ) => {

    return new Promise(( resolve, reject )=>{
        
        const payload = { uid }
        
        jwt.sign( payload, process.env.JWT_SECRET_KEY, {
            expiresIn: '12h'
        }, ( err, token ) => {
            
            if( err ){
                console.log(err)
                reject('No se pudo generar el token')
            }
            resolve(token)
        } ) 
    })
}

const comprobarJWT = async( token = '' ) => {
    
    if( token.trim().length < 10 ){
        return null
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.JWT_SECRET_KEY )

        const usuario = await Usuario.findById(uid)

        if( !usuario ){
            return null
        }

        if( !usuario.estado ){
            return null
        }

        return usuario

    } catch (error) {
        return null
    }
}

module.exports = {
    generarJWT,
    comprobarJWT
}