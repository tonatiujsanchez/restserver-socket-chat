const { response, request } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario')


const getUsuarios = async( req = request, res = response ) => {

    const { desde = 0, limite = 5 } = req.query

    const query = { estado: true }

    const [ usuarios, total ] = await Promise.all([
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),
        Usuario.countDocuments(query)
    ])

    res.json({
        total,
        usuarios,
    })
}


const postUsuarios = async( req, res = response ) => {

    const { nombre, correo, password, rol } = req.body

    const usuario = new Usuario({
        nombre, correo, password, rol
    })

    // Encriptar el password
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync( password, salt )

    // Guardar en la DB
    await usuario.save()

    res.json(usuario)
}


const putUsuarios = async( req, res = response ) => {

    const { id } = req.params
    const { _id, password, google, correo, ...resto } = req.body    

    if( password ){
        // Encriptar el password
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync( password, salt )
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto )


    res.json( usuario )
}



const deleteUsuarios = async( req, res = response ) => {

    const { id } = req.params

    // Borrar fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id)
    
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false })
    

    res.json( usuario )
}



const patchUsuarios = ( req, res = response ) => {

    

    res.json({
        msg: 'Hello world controller - PATCH API',
    })
}



module.exports = {
    getUsuarios,
    postUsuarios,
    putUsuarios,
    patchUsuarios,
    deleteUsuarios
}
