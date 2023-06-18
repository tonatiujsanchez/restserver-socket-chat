
const { Role, Usuario, Categoria, Producto } = require("../models")


// ===== ===== ===== ===== USUARIOS ===== ===== ===== =====

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

    if( !existeUsuario.estado ){
        throw new Error('Usuario eliminado')
    }
}

// ===== ===== ===== ===== CATEGORÍAS ===== ===== ===== =====

const existeCategoriaPorId = async( id = '' ) => {
    const existeCategoria = await Categoria.findById(id)
    if( !existeCategoria ){
        throw new Error('Categoria no encontrada')
    }
    
    if( !existeCategoria.estado ){
        throw new Error('Categoria eliminada')
    }
}

// ===== ===== ===== ===== PRODUCTOS ===== ===== ===== =====

const existeProductoPorId = async( id = '' ) => {
    const existeProducto = await Producto.findById(id)
    if( !existeProducto ){
        throw new Error('Producto no encontrado')
    }
    
    if( !existeProducto.estado ){
        throw new Error('Producto eliminado')
    }
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}