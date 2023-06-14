const Role = require("../models/role")
const Usuario = require("../models/usuario")


const esRoleValido = async( rol = '' ) => {
    const existeRol = await Role.findOne({ rol })
    if( !existeRol ){
        throw new Error(`${ rol } no es un rol válido`)
    }
}

const emailExiste = async( correo = '' ) => {
    const existeEmail = await Usuario.findOne({ correo })
    if( existeEmail ){
        throw new Error(`El correo ${ correo } ya está registrado`)
    }
}

const existeUsuarioPorId = async( id = '' ) => {
    const existeUsuario = await Usuario.findById(id)
    if( !existeUsuario ){
        throw new Error(`Usuario no encontrado`)
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}