


const validarArchivo = ( req, res, next ) => {
    
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

    next()
}

module.exports = {
    validarArchivo
}