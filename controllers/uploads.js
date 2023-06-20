
const { response } = require("express");
const { subirArchivo } = require("../helpers");



const cargarArchivo = async( req = require, res = response ) => {


    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            msg: 'No hay archivos que subir'
        });
    }

    if (!req.files.archivo) {
        return res.status(400).json({
            msg: 'No hay archivos que subir'
        });
    }

    try {

        const nombre = await subirArchivo( req.files, ['pdf', 'txt', 'md'], 'documentos' )

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



module.exports = {
    cargarArchivo
}