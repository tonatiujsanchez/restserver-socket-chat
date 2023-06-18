

const { Router } = require('express')

const { check } = require('express-validator')

const { validarJWT, validarCampos, esAdminRol } = require('../middlewares')
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators')

const { 
    obtenerProductos, 
    obtenerProducto, 
    crearProducto, 
    actualizarProducto, 
    eliminarProducto 
} = require('../controllers/productos')

const router = Router()



router.get('/', obtenerProductos )

router.get(
    '/:id',
    [
        check('id', 'ID de producto no válido').isMongoId(),
        validarCampos
    ],
    obtenerProducto
)

router.post(
    '/',
    [
        validarJWT,
        check('nombre', "El nombre es obligatorio").not().isEmpty(),
        check('precio', "El precio es obligatorio").not().isEmpty(),
        check('precio', "Precio no válido").isNumeric(),
        check('disponible', 'La propiedad disponible debe de ser Boolean').optional().isBoolean(),
        check('categoria', 'ID de categoría no válido').isMongoId(),
        check('categoria').custom( existeCategoriaPorId ),
        validarCampos
    ],
    crearProducto
)

router.put(
    '/:id', 
    [
        validarJWT,
        check('id', 'ID de producto no válido').isMongoId(),
        check('nombre', "El nombre es obligatorio").not().isEmpty(),
        check('precio', "El precio es obligatorio").not().isEmpty(),
        check('precio', "Precio no válido").isNumeric(),
        check('disponible', 'La propiedad disponible debe de ser Boolean').optional().isBoolean(),
        check('categoria', 'ID de categoría no válido').optional().isMongoId(),
        check('categoria').optional().custom( existeCategoriaPorId ),
        check('id').custom( existeProductoPorId ),
        validarCampos
    ], 
    actualizarProducto
)

router.delete(
    '/:id',
    [
        validarJWT,
        esAdminRol,
        check('id', 'ID de producto no válido').isMongoId(),
        check('id').custom( existeProductoPorId ),
        validarCampos
    ],
    eliminarProducto
)


module.exports = router