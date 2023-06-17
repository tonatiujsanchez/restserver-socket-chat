

const { Router } = require('express')
const { check } = require('express-validator')

const { validarCampos, validarJWT, esAdminRol } = require('../middlewares')
const { existeCategoriaPorId } = require('../helpers/db-validators')

const { 
    obtenerCategorias, 
    obtenerCategoria, 
    crearCategoria, 
    actualizarCategoria, 
    eliminarCategoria 
} = require('../controllers/categorias')

const router = Router()


// Obtener todas las categorias :: Público
router.get('/', obtenerCategorias )


// Obtener una categoria /:id :: Público
router.get(
    '/:id',
    [
        check('id', 'No es un ID válido').isMongoId(),
        validarCampos
    ],
    obtenerCategoria
)

// Crear nueva categoria :: Privado
router.post(
    '/',
    [   
        validarJWT,
        check('nombre', "El nombre es obligatorio").not().isEmpty(),
        validarCampos
    ],
    crearCategoria
)

// Actualizar una categoria :: Privado
router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('nombre', "El nombre es obligatorio").not().isEmpty(),
        check('id').custom( existeCategoriaPorId ),
        validarCampos
    ],
    actualizarCategoria
)

// Borrar una categoria :: Solo USER_ADMIN
router.delete(
    '/:id',
    [
        validarJWT,
        esAdminRol,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeCategoriaPorId ),
        validarCampos
    ],
    eliminarCategoria
)








module.exports = router