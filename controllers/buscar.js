const { response, request } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Usuario, Categoria, Producto } = require('../models')

coleccionesPermitidas = [
    'usuarios', 
    'categorias',
    'productos',
]


const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoId = ObjectId.isValid( termino )

    if( esMongoId ){
        const usuario = await Usuario.findById(termino)

        return res.status(200).json({
            resultados: usuario ? [ usuario ] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    const usuarios =  await Usuario.find({
        $or: [
            { nombre: regex },
            { correo: regex },
        ],
        $and:[
            { estado: true }
        ]
    }) 

    return res.status(200).json({
        resultados: usuarios
    })
}


const buscarCategorias = async( termino = '', res = response ) => {

    const esMondoId = ObjectId.isValid( termino )

    if( esMondoId ){
        const categoria = await Categoria.findById( termino )

        return res.status(200).json({
            resultados: categoria ? [ categoria ] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    const categorias = await Categoria.find({
        $or: [
            { nombre: regex },
        ],
        $and:[
            { estado: true }
        ]
    }) 

    return res.status(200).json({
        resultados: categorias
    })
}


const buscarProductos = async( termino = '', res = response ) => {

    const esMondoId = ObjectId.isValid( termino )

    if( esMondoId ){
        const producto = await Producto.findById( termino )
            .populate('categoria', 'nombre') 

        return res.status(200).json({
            resultados: producto ? [ producto ] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    const productos = await Producto.find({
        $or: [
            { nombre: regex },
            { descripcion: regex },
        ],
        $and:[
            { estado: true }
        ]
    })
    .populate('categoria', 'nombre') 

    return res.status(200).json({
        resultados: productos
    })
}


const buscar = async( req = request, res = response ) => {

    const { coleccion, termino } = req.params

        if( !coleccionesPermitidas.includes( coleccion ) ){
            return res.status(400).json({
                msg: `las colecciones permitidas son: ${ coleccionesPermitidas }`
            })
        }


        switch (coleccion) {

            case 'usuarios':
                return buscarUsuarios(termino, res)

            case 'categorias':
                return buscarCategorias( termino, res )

            case 'productos':
                return buscarProductos( termino, res )
        
            default:
                res.status(500).json({
                    msg: 'Caleccion no validad - Switch'
                })
        }


}


module.exports = {
    buscar
}