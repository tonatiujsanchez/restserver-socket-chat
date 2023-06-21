
const { Router } = require('express')
const { check } = require('express-validator')

const { validarCampos, validarArchivo } = require('../middlewares')
const { cargarArchivo, actualizarImagen, mostrarImagen } = require('../controllers/uploads')
const { coleccionesPermitidas } = require('../helpers')


const router = Router()



router.post('/', validarArchivo, cargarArchivo )

router.put(
    '/:coleccion/:id', 
    [
        validarArchivo,
        check('id', 'ID no válido').isMongoId(),
        check('coleccion').custom( coleccion => coleccionesPermitidas( coleccion, ['usuarios', 'productos'] ) ),
        validarCampos
    ], 
    actualizarImagen 
)


router.get(
    '/:coleccion/:id',
    [
        check('id', 'ID no válido').isMongoId(),
        check('coleccion').custom( coleccion => coleccionesPermitidas( coleccion, ['usuarios', 'productos'] ) ),
        validarCampos
    ], 
    mostrarImagen 
)




module.exports = router