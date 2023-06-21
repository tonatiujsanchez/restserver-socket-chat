const path = require('path')
const fs = require('fs')
const { response, request } = require("express")
const cloudinary = require('cloudinary').v2

const { Usuario, Producto } = require('../models')
const { subirArchivo } = require("../helpers")

cloudinary.config( process.env.CLOUDINARY_URL )


const cargarArchivo = async( req = require, res = response ) => {

    try {

        const nombre = await subirArchivo( req.files, undefined, 'imagenes' )

        return res.status(200).json({
            nombre
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: error
        })
    }
}


const actualizarImagen = async( req = request, res = response ) => {

    const { coleccion, id } = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if( !modelo ){
                return res.status(400).json({
                    msg: `No se encontró un usuario con el id: ${ id }`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id)
            if( !modelo ){
                return res.status(400).json({
                    msg: `No se encontró un producto con el id: ${ id }`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg: 'Colección no válida'
            })       
    }

    // Limpiar imagenes previas
    if( modelo.img ){
        // Borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img)
        if( fs.existsSync( pathImagen ) ){
            fs.unlinkSync( pathImagen )
        }
    }

    // Subir imagen
    const nombre = await subirArchivo( req.files, undefined, coleccion )
    modelo.img = nombre

    await modelo.save()

    res.status(200).json(modelo)

}


const actualizarImagenCloudinary = async( req = request, res = response ) => {

    const { coleccion, id } = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if( !modelo ){
                return res.status(400).json({
                    msg: `No se encontró un usuario con el id: ${ id }`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id)
            if( !modelo ){
                return res.status(400).json({
                    msg: `No se encontró un producto con el id: ${ id }`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg: 'Colección no válida'
            })       
    }

    // Limpiar imagenes previas
    if( modelo.img ){
        const nombreArr = modelo.img.split('/')
        const nombre = nombreArr[ nombreArr.length - 1 ]
        const [ public_id ] = nombre.split('.')
        // await es opcional por que no necesitamos esperar una respuesta:: solo que haga el proceso aparte
        cloudinary.uploader.destroy( public_id )
    }

    // Subir imagen
    const { tempFilePath } = req.files.archivo
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath  )    
    modelo.img = secure_url

    await modelo.save()

    res.status(200).json(modelo)

}


const mostrarImagen = async( req = request, res = response ) => {

    const { coleccion, id } = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if( !modelo ){
                return res.status(400).json({
                    msg: `No se encontró un usuario con el id: ${ id }`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id)
            if( !modelo ){
                return res.status(400).json({
                    msg: `No se encontró un producto con el id: ${ id }`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg: 'Colección no válida'
            })       
    }

    // Limpiar imagenes previas
    if( modelo.img ){
        // Borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img)
        if( fs.existsSync( pathImagen ) ){
            return res.sendFile( pathImagen )
        }
    }


    const pathPlaceholder = path.join( __dirname, '../assets/no-image.jpg')
    return res.sendFile( pathPlaceholder )

}




module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}