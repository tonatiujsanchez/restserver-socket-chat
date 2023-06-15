const { response, request } = require("express")

const esAdminRol = ( req=request, res=response, next ) => {
    
    const usuario = req.usuarioAutenticado

    if( !usuario ){
        return res.status(500).json({
            msg: 'No se puede verificar el rol sin validar el token primero'
        })
    }

    if( usuario.rol !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: `No autorizado - No es Administrador`
        })
    }

    next()
}


const tieneRol = ( ...roles ) => {
    return (req, res, next) => {

        const usuario = req.usuarioAutenticado

        if( !usuario ){
            return res.status(500).json({
                msg: 'No se puede verificar el rol sin validar el token primero'
            })
        }

        if( !roles.includes(usuario.rol) ){
            return res.status(401).json('No autorizado - Rol no válido')
        }
        
        next()
    }
}

module.exports = {
    esAdminRol,
    tieneRol
}